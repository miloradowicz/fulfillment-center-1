import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectClientReport, selectLoadingFetchReport } from '../../../store/slices/reportSlice.ts'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const useClientReport = () => {
  const clientReport = useAppSelector(selectClientReport)
  const loadingReport = useAppSelector(selectLoadingFetchReport)

  const [endDate, setEndDate] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    if (startDateParam && endDateParam && (startDate !== startDateParam || endDate !== endDateParam)) {
      setStartDate(startDateParam)
      setEndDate(endDateParam)
    }
  }, [location.search, dispatch, startDate, endDate])


  return {
    clientReport,
    endDate,
    startDate,
    dispatch,
    location,
    loadingReport,
  }
}
