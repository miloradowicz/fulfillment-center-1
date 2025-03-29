import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import CustomTitle from '../../../components/UI/CustomTitle/CustomTitle.tsx'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchTask } from '../../../store/slices/taskSlice.ts'
import Grid from '@mui/material/Grid2'
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'
import { fetchTasksWithPopulate } from '../../../store/thunks/tasksThunk.ts'
import { CustomTabPanel } from '../utils/CustomTabPanel.tsx'
import { TabProps } from '../utils/TabProps.ts'
import { useNavigate, useLocation } from 'react-router-dom'
import TaskReport from '../components/TaskReport.tsx'

export default function ReportTabs() {
  const [value, setValue] = React.useState(0)
  const loadingTask = useAppSelector(selectLoadingFetchTask)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    dispatch(fetchTasksWithPopulate())
  }, [dispatch])

  const tabNames = ['tasks', 'clients', 'orders', 'deliveries', 'warehouses']

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation()

    const tabName = tabNames[newValue]

    navigate(`?tab=${ tabName }`, { replace: true })
    setValue(newValue)
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tab = queryParams.get('tab')
    if (tab) {
      const tabIndex = tabNames.indexOf(tab)
      if (tabIndex !== -1) {
        setValue(tabIndex)
      }
    }
  }, [location, tabNames])

  return (
    <Box sx={{ width: '100%' }}>
      <Box style={{ textAlign: 'center', margin: '30px' }}>
        <CustomTitle text={'Отчеты'} />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered={true}>
          <Tab label="Задачи" {...TabProps(0)} />
          <Tab label="Клиенты" {...TabProps(1)} />
          <Tab label="Заказы" {...TabProps(2)} />
          <Tab label="Поставки" {...TabProps(3)} />
          <Tab label="Склады" {...TabProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {loadingTask ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <TaskReport/>
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
