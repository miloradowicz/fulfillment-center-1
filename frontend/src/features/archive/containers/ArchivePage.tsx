import * as React from 'react'
import { useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import CustomTitle from '../../../components/UI/CustomTitle/CustomTitle.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { TabProps } from '../../reports/utils/TabProps.ts'
import { CustomTabPanel } from '../../reports/utils/CustomTabPanel.tsx'

const ArchivePage = () =>  {
  const [value, setValue] = React.useState(0)
  const location = useLocation()
  const navigate = useNavigate()


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
          <Tab label="Заказы" sx={{ fontSize:'1rem' }} {...TabProps(1)} />
          <Tab label="Поставки" sx={{ fontSize:'1rem' }}  {...TabProps(2)} />
          <Tab label="Задачи" sx={{ fontSize:'1rem' }} {...TabProps(3)} />
          <Tab label="Склады" sx={{ fontSize:'1rem' }} {...TabProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Клиенты
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Заказы
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Поставки
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Задачи
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Склады
      </CustomTabPanel>
    </Box>
  )
}

export default ArchivePage
