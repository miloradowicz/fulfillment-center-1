import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../app/hooks.ts'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchTaskReport } from '../../../store/thunks/reportThunk.ts'
import { toast } from 'react-toastify'

export const useTaskRangePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const dispatch = useAppDispatch()
  const location = useLocation() // Для получения параметров из URL

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    if (startDateParam && endDateParam) {
      const parsedStartDate = new Date(startDateParam)
      const parsedEndDate = new Date(endDateParam)
      setStartDate(parsedStartDate)
      setEndDate(parsedEndDate)
      dispatch(fetchTaskReport({ startDate: startDateParam, endDate: endDateParam }))
    }
  }, [location.search, dispatch])
  const getCurrentWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek
    const startOfWeek = new Date(today.setDate(diff - 7))
    const endOfWeek = new Date(today.setDate(diff))
    return [startOfWeek, endOfWeek]
  }

  const getCurrentMonth = () => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return [startOfMonth, endOfMonth]
  }

  const getCurrentYear = () => {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 1)
    const endOfYear = new Date(today.getFullYear(), 11, 31)
    return [startOfYear, endOfYear]
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${ year }-${ month }-${ day }`
  }

  const handlePresetRange = (range: 'current-week' | 'current-month' | 'current-year') => {
    let dates
    if (range === 'current-week') {
      dates = getCurrentWeek()
    } else if (range === 'current-month') {
      dates = getCurrentMonth()
    } else if (range === 'current-year') {
      dates = getCurrentYear()
    }
    if(dates){
      setStartDate(dates[0])
      setEndDate(dates[1])
    }
  }

  const handleChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates
      setStartDate(start)
      setEndDate(end)
    }
  }

  const minDate = new Date('2025-01-01')
  const maxDate = new Date('2025-12-31')
  const navigate = useNavigate()

  const handleReportGeneration = async () =>  {
    if(startDate && endDate){
      const startDateStr = formatDate(startDate)
      const endDateStr = formatDate(endDate)
      const reportUrl = `/reports?tab=tasks&startDate=${ startDateStr }&endDate=${ endDateStr }`
      navigate(reportUrl, { replace: true })
      await dispatch(fetchTaskReport({ startDate:startDateStr, endDate:endDateStr }))
    }
    else{
      toast.error('Выберите даты')
    }
  }

  return {
    handlePresetRange,
    handleReportGeneration,
    maxDate,
    minDate,
    handleChange,
    startDate,
    endDate,
  }
}
