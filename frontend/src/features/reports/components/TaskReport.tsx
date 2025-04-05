import Grid from '@mui/material/Grid2'
import { CircularProgress, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TaskReportTable from './TaskReportTable.tsx'
import TaskCountAreaChart from './TaskCountChart.tsx'
import DateRangePicker from './DateRangePicker.tsx'
import TaskSummary from './TaskStateForReport.tsx'
import { useTaskReport } from '../hooks/useTaskReport.ts'

const TaskReport = () => {

  const { report,
    endDate,
    startDate,
    loadingReport,
    tasks,
    loadingTasks } = useTaskReport()

  return (
    <Box>
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
        {loadingTasks ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Box sx={{
            flex: 1,
            minWidth: '650px',
            maxWidth:'650px',
            width: '100%',
            '@media (max-width: 900px)': {
              width: '100%',
              minWidth: '100%',
            },
          }}>
            <TaskSummary tasks={tasks} />
          </Box>
        )}
      </Box>

      {loadingReport ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        report && report.userTaskReports && (
          <>{!startDate || !endDate? <Typography variant={'h6'} textAlign={'center'} mt={3}>Период не выбран</Typography>:  <> {(report.userTaskReports.length === 0 && report.dailyTaskCounts.length === 0 ) ? (
            <Typography variant={'h6'} textAlign={'center'} mt={3}>В выбранном периоде нет выполненных задач</Typography>
          ) : (
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-around"
              flexWrap="wrap"
              mt={2}
            >
              <Box sx={{
                flex: 1,
                minWidth: '500px',
                maxWidth: '700px',
                width: '100%',
                '@media (max-width: 900px)': {
                  width: '100%',
                  minWidth: '100%',
                },
              }}>
                <TaskCountAreaChart data={report.dailyTaskCounts} />
              </Box>
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
                <TaskReportTable userTaskReports={report.userTaskReports} />
              </Box>
            </Box>
          )}</> }
          </>
        )
      )}
    </Box>)}

export default TaskReport
