import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import React from 'react'

export function InputWithError({
  error,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { error?: string }) {
  return (
    <div className="space-y-1">
      <Input
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive/30',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
