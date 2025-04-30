import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '../utils/FormattedDateForTitle.ts'
import { coefHeightChart, maxHeight, mdWidth, minHeight, smHeight, smWidth } from '../utils/taskReportConstants.ts'
import { PropsCountChart } from '../utils/TypesProps.ts'
import useBreakpoint from '@/hooks/useBreakpoint.ts'

export const useTaskCountAreaChart = ({ data }:PropsCountChart) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))
  const [containerHeight, setContainerHeight] = useState(
    Math.min(
      window.innerWidth < smWidth
        ? smHeight * 0.8
        : window.innerWidth < mdWidth
          ? minHeight
          : maxHeight,
      300,
    ),
  )

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(
        Math.min(
          window.innerWidth < smWidth
            ? smHeight * coefHeightChart
            : window.innerWidth < mdWidth
              ? minHeight
              : maxHeight,
          300,
        ),
      )
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const chartData = data.map(item => ({
    date: item.date,
    taskCount: item.taskCount,
  }))

  const isMobile = useBreakpoint()
  const margin = isMobile
    ? { top: 5, right: 5, left: -10, bottom: 10 }
    : { top: 10, right: 10, left: -10, bottom: 10 }

  return {
    containerHeight,
    chartData,
    startDate,
    endDate,
    margin,
  }
}
