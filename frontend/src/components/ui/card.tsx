import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('rounded-lg border bg-white shadow-md my-2', className)}>
      {children}
    </div>
  )
}

export const CardContent = ({ children }: { children: ReactNode }) => {
  return <div className="p-4">{children}</div>
}
