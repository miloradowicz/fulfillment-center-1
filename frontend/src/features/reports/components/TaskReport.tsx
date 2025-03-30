import {  useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchReport, selectTaskReport } from '../../../store/slices/reportSlice.ts'
import Grid from '@mui/material/Grid2'
import { CircularProgress, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TaskReportTable from './TaskReportTable.tsx'
import TaskCountAreaChart from './TaskCountChart.tsx'
import DateRangePicker from './DateRangePicker.tsx'
import TaskSummary from './TaskStateForReport.tsx'
import { selectLoadingFetchTask, selectPopulatedTasks } from '../../../store/slices/taskSlice.ts'

const TaskReport = () => {

  const report = useAppSelector(selectTaskReport)
  const loadingReport = useAppSelector(selectLoadingFetchReport)
  const tasks =  useAppSelector(selectPopulatedTasks)
  const loadingTasks = useAppSelector(selectLoadingFetchTask)
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
          <>
            {(report.userTaskReports.length === 0 && report.dailyTaskCounts.length === 0 ) ? (
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
            )}
          </>
        )
      )}
    </Box>)}

export default TaskReport
