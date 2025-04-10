import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import CustomTitle from '@/components/ui/CustomTitle/CustomTitle.tsx'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectLoadingFetchTask } from '@/store/slices/taskSlice.ts'
import Grid from '@mui/material/Grid2'
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'
import { fetchTasksWithPopulate } from '@/store/thunks/tasksThunk.ts'
import { CustomTabPanel } from '../utils/CustomTabPanel.tsx'
import { TabProps } from '../utils/TabProps.ts'
import { useNavigate, useLocation } from 'react-router-dom'
import TaskReport from '../taskPeport/components/TaskReport.tsx'
import ClientReport from '../clientReport/components/ClientReport.tsx'

export default function ReportTabs() {
  const [value, setValue] = React.useState(0)
  const loadingTask = useAppSelector(selectLoadingFetchTask)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    dispatch(fetchTasksWithPopulate())
  }, [dispatch])

  const tabNames = React.useMemo(() => ['tasks', 'clients', 'orders', 'arrivals', 'stocks'], [])

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
      <Box style={{ textAlign: 'center', margin: '10px 0 15px' }}>
        <CustomTitle text={'Отчеты'} />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          scrollButtons="auto"
          sx={{
            '.MuiTabs-flexContainer': {
              display: 'flex',
              flexWrap: 'nowrap',
              scrollBehavior: 'smooth',
              '@media (max-width: 470px)': {
                overflowX: 'auto',
                justifyContent: 'flex-start',
              },
              '@media (min-width: 471px)': {
                justifyContent: 'center',
              },
            },
            '.MuiTab-root': {
              fontSize: '1rem',
              padding: '4px 16px',
              width: 'auto',
            },
            '@media (max-width: 630px)': {
              '.MuiTab-root': {
                fontSize: '0.8rem',
                padding: '2px 4px',
              },
            },
          }}
        >
          <Tab label="Задачи" sx={{ fontSize:'1rem' }} {...TabProps(0)} />
          <Tab label="Клиенты" sx={{ fontSize:'1rem' }} {...TabProps(1)} />
          <Tab label="Заказы" sx={{ fontSize:'1rem' }} {...TabProps(2)} />
          <Tab label="Поставки" sx={{ fontSize:'1rem' }}  {...TabProps(3)} />
          <Tab label="Склады" sx={{ fontSize:'1rem' }} {...TabProps(4)} />
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
        <ClientReport/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Заказы
      </CustomTabPanel>
    </Box>
  )
}
