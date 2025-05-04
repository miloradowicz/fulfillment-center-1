import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { capitalize } from '@/utils/capitalizeFirstLetter.ts'

export function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <div className={cn('p-1', className)}>
      <DayPicker
        showOutsideDays
        formatters={{
          formatWeekdayName: (date, options) =>
            capitalize(
              new Intl.DateTimeFormat('ru-RU', {
                weekday: 'short',
                ...options,
              }).format(date),
            ),
          formatMonthCaption: (date, options) => {
            const month = capitalize(
              new Intl.DateTimeFormat('ru-RU', {
                month: 'long',
                ...options,
              }).format(date),
            )
            const year = new Intl.DateTimeFormat('ru-RU', {
              year: 'numeric',
              ...options,
            }).format(date)
            return `${ month } ${ year }`
          },
        }}
        {...props}
      />
    </div>
  )
}
