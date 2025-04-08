import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '../../utils/FormattedDateForTitle.ts'
import { PropsTaskTable } from '../../utils/TypesProps.ts'
import GenericDropdown from './Dropdown.tsx'

const TaskReportTable: React.FC<PropsTaskTable> = ({ userTaskReports }) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))

  return (
    <>{userTaskReports.length === 0 ? null:
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
          Количество задач, выполненных каждым  {' '}
          сотрудником за период с {startDate} по {endDate}
        </Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 650, minWidth: 350, marginInline:'auto' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell  sx={{
                  padding: { xs: 1, sm: 1, md: 1, xl: 2 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 550,
                }}>Имя пользователя</TableCell>
                <TableCell sx={{
                  padding: { xs: 1, sm: 1, md: 1, xl: 2 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 550,
                }} align="center">Выполненные <br/> задачи</TableCell>
                <TableCell sx={{
                  padding: { xs: 1, sm: 1, md: 1, xl: 2 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 550,
                }} align="center">Количество <br/> выполеннных задач</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userTaskReports.map(report => (
                <TableRow key={report.user._id}>
                  <TableCell width={'auto'} sx={{ padding: { xs: 1, sm: 1, md: 2, xl: 3 },
                    fontSize: { xs: '0.875rem', md: '1rem' } }} component="th" scope="row">
                    {report.user.displayName}
                  </TableCell>
                  <TableCell  width={'auto'} sx={{ padding: { xs: 1, sm: 1, md: 2, xl: 3 },
                    fontSize: { xs: '0.875rem', md: '1rem' } }} align="center">
                    <GenericDropdown
                      items={report.tasks}
                      getLabel={task => task.taskNumber}
                      getLink={task => `/tasks/${ task._id }`}
                      buttonText="Задачи"
                    />
                  </TableCell>
                  <TableCell  width={'auto'} sx={{ padding: { xs: 1, sm: 1, md: 2, xl: 3 },
                    fontSize: { xs: '0.875rem', md: '1rem' } }} align="center">
                    {report.taskCount}
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

export default TaskReportTable
