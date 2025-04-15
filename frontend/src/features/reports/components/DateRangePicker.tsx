import 'react-datepicker/dist/react-datepicker.css'
import { useRangePicker } from '../hooks/useRangePicker.ts'
import ButtonDateRangePicker from '@/features/reports/components/DateRangeButton.tsx'
import { ShadcnRangePicker } from '@/features/reports/components/inlineRandgePicker.tsx'

const DateRangePicker = () => {

  const { handlePresetRange,
    handleReportGeneration,
    maxDate,
    minDate,
    handleChange,
    startDate,
    endDate } = useRangePicker()

  return (
    <div
      className="w-full mt-5 mb-2 p-1"
      style={{
        height: 'auto',
      }}
    >
      <h6 className="text-center text-base sm:text-xl">
      Выберите период
      </h6>
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start p-2 w-full">
        <div className="mr-0 sm:mr-[10px] sm:mb-0 mb-[10px] flex flex-col items-center sm:items-end w-[242px] sm:w-[45%] ">
          <ButtonDateRangePicker
            text={'Текущая неделя'}
            onClick={()=>handlePresetRange('current-week')}
            className="mb-2"
          />
          <ButtonDateRangePicker
            text={'Текущий месяц'}
            onClick={()=>handlePresetRange('current-month')}
            className="mb-2"
          />
          <ButtonDateRangePicker
            text={'Текущий год'}
            onClick={()=>handlePresetRange('current-year')}
            className="mb-2"
          />
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
            <ButtonDateRangePicker
              text={'Получить отчет'}
              onClick={handleReportGeneration}
              className="mt-auto sm:mt-0"
            />
          </div>
        </div>
        <div style={{ margin: 'auto 0' }}>
          <ShadcnRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </div>
    </div>
  )
}


export default DateRangePicker

