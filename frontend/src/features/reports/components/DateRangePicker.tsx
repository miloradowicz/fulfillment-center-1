import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Card, Typography } from '@mui/material'
import { useRangePicker } from '../hooks/useRangePicker.ts'
import ButtonDataRange from './ButtonDataRange.tsx'

const DateRangePicker = () => {

  const { handlePresetRange,
    handleReportGeneration,
    maxDate,
    minDate,
    handleChange,
    startDate,
    endDate } = useRangePicker()


  return (
    <Card
      sx={{
        margin: '20px 0',
        padding: '5px',
        height: {
          xs: 'auto',
          md: '360px',
        },
        width: '100%',
      }}
    >
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
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start p-2 w-full">
        <div className="mr-0 sm:mr-[10px] sm:mb-0 mb-[10px] flex flex-col items-center sm:items-end w-[242px] sm:w-[45%] ">
          <ButtonDataRange text={'Текущая неделя'} onClick={()=>handlePresetRange('current-week')} />
          <ButtonDataRange text={'Текущий месяц'} onClick={()=>handlePresetRange('current-month')} />
          <ButtonDataRange text={'Текущий год'} onClick={()=>handlePresetRange('current-year')} />
          {startDate && endDate ? (
            <div className="sm:h-[72px] h-auto w-full sm:w-44 overflow-hidden">
              <p className="text-center pt-[10px] sm:pt-0 block mx-auto text-sm sm:text-base">
                Выбранный период:
                <span className="font-medium block mx-auto text-sm sm:text-base">
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </span>
              </p>
            </div>
          ) : <div className="sm:h-[72px] h-0 overflow-hidden"></div>}
          <div className="mt-1 sm:mt-[20px] w-full sm:w-auto">
            <button onClick={handleReportGeneration}
              className="px-2 sm:px-4 py-2 w-full sm:w-44 text-center bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm mt-auto sm:mt-0 shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
            >
              Получить отчет
            </button>
          </div>
        </div>
        <div style={{ margin: 'auto 0' }}>
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

