import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useSearchParams } from 'react-router-dom'
import { PropsClientTable } from '../../utils/TypesProps.ts'
import { formatDate } from '../../utils/FormattedDateForTitle.ts'
import GenericDropdown from '../../components/Dropdown.tsx'

const ClientReportTable: React.FC<PropsClientTable> = ({ clientOrderReport }) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))
  return (
    <>{ !clientOrderReport ? null:
      <Box style={{ textAlign: 'center', marginBottom: '30px', minWidth:'300px', width: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            marginInline:'auto',
            width:{ xs:'90%', sm: '80%', xl: '95%', lg: '95%', md:'95%' },
            marginBottom: { xs: '15px', sm: '15px' },
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textAlign: 'center',
          }}
        >
  Количество заказов каждого клиента за период с {startDate} по {endDate}
        </Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 650, minWidth: 350, marginInline:'auto' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell  sx={{
                  padding: { xs: 1, sm: 1, md: 1, xl: 1 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 550,
                }}>Клиент</TableCell>
                <TableCell sx={{
                  padding: { xs: 1, sm: 1, md: 1, xl: 1 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 550,
                }} align="center">Заказы</TableCell>
                <TableCell sx={{
                  padding: { xs: 1, sm: 1, md: 1, xl: 1 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 550,
                }} align="center">Количество заказов</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientOrderReport.map(report => (
                <TableRow key={report.client._id}>
                  <TableCell width={'auto'} sx={{ padding: { xs: 1, sm: 1, md: 2, xl: 2 },
                    fontSize: { xs: '0.875rem', md: '1rem' } }} component="th" scope="row">
                    {report.client.name}
                  </TableCell>
                  <TableCell  width={'auto'} sx={{ padding: { xs: 1, sm: 1, md: 2, xl: 2 },
                    fontSize: { xs: '0.875rem', md: '1rem' } }} align="center">
                    {report.orderCount === 0 ? (
                      <div className={'h-[38px] flex items-center justify-center'}>-</div>
                    ) : (
                      <GenericDropdown
                        items={report.orders}
                        getLabel={order => order.orderNumber}
                        getLink={order => `/orders/${ order._id }`}
                        getStatus={order => order.status}
                        statusFilterOptions={['в сборке', 'в пути', 'доставлен']}
                      />
                    )}
                  </TableCell>
                  <TableCell  width={'auto'} sx={{ padding: { xs: 1, sm: 1, md: 2, xl: 2 },
                    fontSize: { xs: '0.875rem', md: '1rem' } }} align="center">
                    {report.orderCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    }
    </>
  )
}

export default ClientReportTable
