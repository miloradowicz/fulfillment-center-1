import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Card, Typography } from '@mui/material'
import { useTaskRangePicker } from '../hooks/useTaskRangePicker.ts'

const DateRangePicker: React.FC = () => {

  const {  handlePresetRange,
    handleReportGeneration,
    maxDate,
    minDate,
    handleChange,
    startDate,
    endDate } = useTaskRangePicker()

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

