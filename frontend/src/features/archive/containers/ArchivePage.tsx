import * as React from 'react'
import { useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import CustomTitle from '../../../components/UI/CustomTitle/CustomTitle.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { TabProps } from '../../reports/utils/TabProps.ts'
import { CustomTabPanel } from '../../reports/utils/CustomTabPanel.tsx'
import Grid from '@mui/material/Grid2'
import { CircularProgress } from '@mui/material'
import { selectLoadingArchiveClient } from '../../../store/slices/clientSlice.ts'
import { useAppSelector } from '../../../app/hooks.ts'
import ArchivedClients from '../components/ArchivedClients.tsx'
import ArchivedArrivals from '../components/ArchivedArrivals.tsx'
import { selectLoadingFetchArchivedArrivals } from '../../../store/slices/arrivalSlice.ts'
import ArchivedProducts from '../components/ArchivedProducts.tsx'
import { selectLoadingFetchArchivedProduct } from '../../../store/slices/productSlice.ts'
import ArchivedStocks from '../components/ArchivedStocks.tsx'
import { selectLoadingFetchArchivedStocks } from '../../../store/slices/stocksSlice.ts'
import ArchivedCounterparties from '../components/ArchivedCounterparties.tsx'
import { selectLoadingFetchArchive } from '../../../store/slices/counterpartySlices.ts'
import { selectLoadingFetchArchivedTasks } from '../../../store/slices/taskSlice.ts'
import ArchivedTasksPage from '../components/ArchivedTasksPage.tsx'

const ArchivePage = () =>  {
  const [value, setValue] = React.useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const loadingClients = useAppSelector(selectLoadingArchiveClient)
  const loadingArrivals = useAppSelector(selectLoadingFetchArchivedArrivals)
  const loadingProducts = useAppSelector(selectLoadingFetchArchivedProduct)
  const loadingStocks = useAppSelector(selectLoadingFetchArchivedStocks)
  const loadingCounterparties = useAppSelector(selectLoadingFetchArchive)
  const loadingTasks = useAppSelector(selectLoadingFetchArchivedTasks)

  const tabNames = React.useMemo(() => ['clients', 'orders', 'arrivals', 'tasks', 'stocks'], [])

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
        <CustomTitle text={'Архив'} />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered={true}>
          <Tab label="Клиенты" sx={{ fontSize:'1rem' }} {...TabProps(0)} />
          <Tab label="Товары" sx={{ fontSize:'1rem' }} {...TabProps(1)} />
          <Tab label="Поставки" sx={{ fontSize:'1rem' }}  {...TabProps(2)} />
          <Tab label="Заказы" sx={{ fontSize:'1rem' }} {...TabProps(3)} />
          <Tab label="Задачи" sx={{ fontSize:'1rem' }} {...TabProps(4)} />
          <Tab label="Склады" sx={{ fontSize:'1rem' }} {...TabProps(5)} />
          <Tab label="Контрагенты" sx={{ fontSize:'1rem' }} {...TabProps(6)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {loadingClients ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <ArchivedClients/>
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {loadingProducts ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <ArchivedProducts/>
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {loadingArrivals ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <ArchivedArrivals/>
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Заказы
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        {loadingTasks ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <ArchivedTasksPage />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        {loadingStocks ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <ArchivedStocks/>
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        {loadingCounterparties ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <ArchivedCounterparties/>
          </>
        )}
      </CustomTabPanel>

    </Box>
  )
}

export default ArchivePage
