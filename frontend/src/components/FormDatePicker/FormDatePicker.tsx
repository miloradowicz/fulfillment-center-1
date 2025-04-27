import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ru } from 'date-fns/locale'

dayjs.locale('ru')

interface FormDatePickerProps {
  value: string
  onChange: (value: string) => void
  onBlur?: (e: { target: { value: string } }) => void
  error?: string
  label?: string
  className?: string
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({ value, onChange, onBlur, error, label, className }) => {
  const [date, setDate] = useState<Date | undefined>(() => {
    return value ? dayjs(value).toDate() : undefined
  })
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  useEffect(() => {
    if (!isPopoverOpen) {
      setDate(value ? dayjs(value).toDate() : undefined)
    }
  }, [value, isPopoverOpen])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    const newValue = dayjs(selectedDate).format('YYYY-MM-DD')
    setDate(selectedDate)
    onChange(newValue)
    onBlur?.({ target: { value: newValue } })
    setIsPopoverOpen(false)
  }

  const handleTriggerBlur = () => {
    onBlur?.({ target: { value: value || '' } })
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className="text-sm font-medium leading-none">{label}</Label>}

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              error && 'border-destructive',
            )}
            type="button"
            onBlur={handleTriggerBlur}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? dayjs(date).format('DD.MM.YYYY') : <span>Выберите дату</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} locale={ru} initialFocus />
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default FormDatePicker
