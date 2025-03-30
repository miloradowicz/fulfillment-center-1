import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Card, Typography } from '@mui/material'
import { fetchTaskReport } from '../../../store/thunks/reportThunk.ts'
import { useAppDispatch } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

const DateRangePicker: React.FC = () => {
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

  const handleReportGeneration = async () =>  {
    if(startDate && endDate){
      const startDateStr = formatDate(startDate)
      const endDateStr = formatDate(endDate)
      const reportUrl = `/reports?tab=tasks&startDate=${ startDateStr }&endDate=${ endDateStr }`
      window.history.pushState(null, '', reportUrl)
      await dispatch(fetchTaskReport({ startDate:startDateStr, endDate:endDateStr }))
    }
    else{
      toast.error('Выберите даты')
    }
  }

  return (
    <Card sx={{ width:'490px', margin: '20px', padding: '5px', height:'360px' }}>
      <Typography variant={'h6'} textAlign={'center'}>Выберите период</Typography>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', width:'490px' }}>
        <div style={{ display: 'flex', flexDirection: 'column',alignItems: 'flex-start', marginRight: '20px' }}>
          <button
            onClick={() => handlePresetRange('current-week')}
            className="px-4 py-2 w-44 mb-2 bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
          >
            Текущая неделя
          </button>
          <button
            onClick={() => handlePresetRange('current-month')}
            className="px-4 py-2 w-44 mb-2 bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
          >
            Текущий месяц
          </button>
          <button
            onClick={() => handlePresetRange('current-year')}
            className="px-4 py-2 w-44 mb-2 bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
          >
            Текущий год
          </button>
          {startDate && endDate? (
            <div style={{ height: '72px' }}>
              <p style={{ fontSize:'16px', textAlign:'center', paddingTop:'10px' }}>
                Выбранный период:<span style={{ fontSize:'16px', fontWeight:'500', display:'block' }}>{startDate.toLocaleDateString()} -{' '}
                  {endDate.toLocaleDateString()}</span>
              </p>
            </div>
          ):<div style={{ height: '72px' }}></div>}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleReportGeneration} className="px-4 py-2 w-44 text-center bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-base mt-auto shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg">
              Получить отчет
            </button>
          </div>
        </div>
        <div style={{ margin: 'auto 0' }} >
          <DatePicker
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            calendarStartDay={1}
            dateFormat="dd/MM/yyyy"
            showMonthYearDropdown={true}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </div>
    </Card>
  )
}


export default DateRangePicker

