import Grid from '@mui/material/Grid2'
import { CircularProgress, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import DateRangePicker from '../../components/DateRangePicker.tsx'
import { useClientReport } from '../../hooks/useClientReport.ts'
import ClientReportTable from './ClientReportTable.tsx'

const ClientReport = () => {

  const { clientReport,
    endDate,
    startDate,
    loadingReport,
  } = useClientReport()

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="start"  flexWrap={'wrap'} mb={3}>
      <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center" gap={2} flexWrap={'wrap'} mb={3}>
        <Box sx={{
          flex: 1,
          display:'flex',
          justifyContent:'center',
          minWidth: '500px',
          maxWidth: '700px',
          width: '100%',
          '@media (max-width: 900px)': {
            width: '100%',
            minWidth: '100%',
          },
        }}>
          <DateRangePicker />
        </Box>
      </Box>
      {loadingReport ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        clientReport && (
          <>{!startDate || !endDate? <Typography variant={'h6'} textAlign={'center'} mt={3} sx={{ fontSize: { xs: '14px', sm: '16px' } }}>Период не выбран</Typography>:  <> {(!clientReport ) ? (
            <Typography variant={'h6'} textAlign={'center'} mt={3} mb={5} sx={{ fontSize: { xs: '14px', sm: '16px' },
            }}>В выбранном периоде нет заказов</Typography>
          ) : (
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-around"
              flexWrap="wrap"
              mt={2}
            >
              <Box flexGrow={1}  sx={{
                flex: 1,
                marginLeft: '40px',
                minWidth: '540px',
                maxWidth: '600px',
                width: '100%',
                '@media (max-width: 900px)': {
                  marginLeft:'0',
                  width: '100%',
                  minWidth: '100%',
                },
              }}>
                <ClientReportTable clientOrderReport={clientReport.clientOrderReport} />
              </Box>
            </Box>
          )}</> }
          </>
        )
      )}
    </Box>)}

export default ClientReport
