import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchReport, selectTaskReport } from '../../../store/slices/reportSlice.ts'
import { selectLoadingFetchTask, selectPopulatedTasks } from '../../../store/slices/taskSlice.ts'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const useTaskReport = () => {
  const report = useAppSelector(selectTaskReport)
  const loadingReport = useAppSelector(selectLoadingFetchReport)
  const tasks =  useAppSelector(selectPopulatedTasks)
  const loadingTasks = useAppSelector(selectLoadingFetchTask)

  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    if (!startDateParam || !endDateParam) {
      setStartDate(null)
      setEndDate(null)
      return
    }

    setStartDate(startDateParam)
    setEndDate(endDateParam)
  }, [location.search, dispatch])

  return {
    report,
    endDate,
    startDate,
    dispatch,
    location,
    loadingReport,
    tasks,
    loadingTasks,
  }
}
