import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import CustomTitle from '../../../components/UI/CustomTitle/CustomTitle.tsx'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchTask, selectPopulatedTasks } from '../../../store/slices/taskSlice.ts'
import Grid from '@mui/material/Grid2'
import { CircularProgress } from '@mui/material'
import TasksList from '../components/TaskList.tsx'
import { useEffect } from 'react'
import { fetchTasksWithPopulate } from '../../../store/thunks/tasksThunk.ts'
import { CustomTabPanel } from '../utils/CustomTabPanel.tsx'
import { TabProps } from '../utils/TabProps.ts'

export default function ReportTabs() {
  const [value, setValue] = React.useState(0)
  const tasks = useAppSelector(selectPopulatedTasks)
  const loadingTask = useAppSelector(selectLoadingFetchTask)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchTasksWithPopulate())
  }, [dispatch])
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation()
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box style={{ textAlign: 'center', margin: '30px' }}>
        <CustomTitle text={'Отчеты'}/>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered={true}>
          <Tab label="Задачи" {...TabProps(0)} />
          <Tab label="Клиенты" {...TabProps(1)} />
          <Tab label="Заказы" {...TabProps(2)} />
          <Tab label="Поставки" {...TabProps(2)} />
          <Tab label="Склады" {...TabProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {loadingTask ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <TasksList tasks={tasks || []} />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Клиенты
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Заказы
      </CustomTabPanel>
    </Box>
  )
}
