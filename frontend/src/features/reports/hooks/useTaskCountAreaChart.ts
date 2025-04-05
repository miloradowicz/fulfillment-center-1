import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '../utils/FormattedDateForTitle.ts'
import { maxHeight, mdWidth, minHeight, smHeight, smWidth } from '../utils/taskReportConstants.ts'
import useIsMobile from '../utils/UseIMobile.ts'
import { PropsCountChart } from '../utils/TypesProps.ts'

export const useTaskCountAreaChart = ({ data }:PropsCountChart) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))
  const [containerHeight, setContainerHeight] = useState(
    window.innerWidth < mdWidth  ? minHeight : maxHeight,
  )
  const isMobile = useIsMobile()
  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(
        window.innerWidth < smWidth ? smHeight : window.innerWidth < mdWidth ? minHeight : maxHeight,
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const chartData = data.map(item => ({
    date: item.date,
    taskCount: item.taskCount,
  }))

  return {
    containerHeight,
    chartData,
    isMobile,
    startDate,
    endDate,
  }
}
