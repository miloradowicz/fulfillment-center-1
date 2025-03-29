import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { fetchTaskReport } from '../../../store/thunks/reportThunk.ts'
import { selectLoadingFetchReport, selectTaskReport } from '../../../store/slices/reportSlice.ts'
import Grid from '@mui/material/Grid2'
import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import TaskReportTable from './TaskReportTable.tsx'
import TaskCountChart from './TaskCountChart.tsx'

const TaskReport = () => {
  const dispatch = useAppDispatch()
  const report = useAppSelector(selectTaskReport)
  const loading = useAppSelector(selectLoadingFetchReport)
  const fetchReport = useCallback(async () => {
    await dispatch(fetchTaskReport({ startDate:'2025-03-01', endDate:'2025-03-31' }))
  }, [dispatch])


  useEffect(() => {
    void fetchReport()
  }, [dispatch, fetchReport])
  return (
    <Box>
      {loading ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : <>  {report && report.userTaskReports?<> <TaskReportTable userTaskReports={report.userTaskReports} /><TaskCountChart data={report.dailyTaskCounts}/></>:null } </>}
    </Box>
  )
}

export default TaskReport
