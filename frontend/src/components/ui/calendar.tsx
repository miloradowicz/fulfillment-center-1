import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'

export function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <div className={cn('p-1', className)}>
      <DayPicker
        showOutsideDays
        {...props}
      />
    </div>
  )
}
