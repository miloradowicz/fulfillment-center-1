import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Card, Typography } from '@mui/material'
import { useTaskRangePicker } from '../hooks/useTaskRangePicker.ts'

const DateRangePicker: React.FC = () => {

  const { handlePresetRange,
    handleReportGeneration,
    maxDate,
    minDate,
    handleChange,
    startDate,
    isMobile,
    endDate } = useTaskRangePicker()

  return (
    <Card sx={{ margin: '20px 0', padding: '5px', height:'360px', minWidth:'400px',
      width: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          marginBottom: { xs: '5px', sm: '10px' },
          fontSize: { xs: '1rem', sm: '1.25rem' },
          textAlign: 'center',
        }}
      >
      Выберите период
      </Typography>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '10px', width:'100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column',alignItems: 'flex-start', marginRight: '10px',  width:'auto' }}>
          <button
            onClick={() => handlePresetRange('current-week')}
            className="px-2 sm:px-4 py-2 w-34 sm:w-44 mb-2 bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
          >
            Текущая неделя
          </button>
          <button
            onClick={() => handlePresetRange('current-month')}
            className="px-2 sm:px-4 py-2 w-34 sm:w-44 mb-2 bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
          >
            Текущий месяц
          </button>
          <button
            onClick={() => handlePresetRange('current-year')}
            className="px-2 sm:px-4 py-2 w-34 sm:w-44 bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
          >
            Текущий год
          </button>
          {startDate && endDate? (
            <div style={{ height: '72px' }}>
              <p style={{
                fontSize: isMobile ? '13px' : '16px',
                textAlign: 'center',
                paddingTop: '10px',
                display: 'block',
                marginInline: 'auto',
              }}>
                Выбранный период:
                <span style={{
                  fontSize: isMobile ? '13px' : '16px',
                  fontWeight: '500',
                  display: 'block',
                }}>
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </span>
              </p>
            </div>
          ) : <div style={{ height: '72px' }}></div>}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleReportGeneration}
              className="px-2 sm:px-4 py-2 w-34 sm:w-44 text-center bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm mt-auto shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg">
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

