import Grid from '@mui/material/Grid2'
import { CircularProgress, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TaskReportTable from './TaskReportTable.tsx'
import TaskCountAreaChart from './TaskCountChart.tsx'
import DateRangePicker from './DateRangePicker.tsx'
import TaskSummary from './TaskStateForReport.tsx'
import { useTaskReport } from '../hooks/useTaskReport.ts'

const TaskReport = () => {

  const {   report,
    endDate,
    startDate,
    loadingReport,
    tasks,
    loadingTasks } = useTaskReport()

  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center" flexWrap={'wrap'}>
        <DateRangePicker />
        {loadingTasks ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Box width={'650px'}>
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
              <Box width="700px">
                <TaskCountAreaChart data={report.dailyTaskCounts} />
              </Box>
              <Box flexGrow={1} width="500px">
                <TaskReportTable userTaskReports={report.userTaskReports} />
              </Box>
            </Box>
          )}</> }
          </>
        )
      )}
    </Box>)}

export default TaskReport
