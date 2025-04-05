import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '../utils/FormattedDateForTitle.ts'
import { coefHeightChart, maxHeight, mdWidth, minHeight, smHeight, smWidth } from '../utils/taskReportConstants.ts'
import { PropsCountChart } from '../utils/TypesProps.ts'

export const useTaskCountAreaChart = ({ data }:PropsCountChart) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))
  const [containerHeight, setContainerHeight] = useState(
    window.innerWidth < smWidth ? smHeight * 0.8 : window.innerWidth < mdWidth ? minHeight : maxHeight,
  )

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(
        window.innerWidth < smWidth
          ? smHeight * coefHeightChart
          : window.innerWidth < mdWidth
            ? minHeight
            : maxHeight,
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
    startDate,
    endDate,
  }
}
