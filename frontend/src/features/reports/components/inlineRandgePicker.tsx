import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'

interface Props {
  startDate: Date | undefined
  endDate: Date | undefined
  onChange: (range: { startDate?: Date; endDate?: Date }) => void
  minDate?: Date
  maxDate?: Date
}

export const ShadcnRangePicker: React.FC<Props> = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
}) => {

  const [range, setRange] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  })

  React.useEffect(() => {
    setRange({ from: startDate, to: endDate })
  }, [startDate, endDate])

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange)

    onChange({
      startDate: newRange?.from,
      endDate: newRange?.to,
    })
  }

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={handleSelect}
      numberOfMonths={1}
      fromDate={minDate}
      toDate={maxDate}
      defaultMonth={range?.from}
      weekStartsOn={1}
    />
  )
}
