import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('rounded-lg border bg-white shadow-md', className)}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children }: { children: ReactNode }) => {
  return <div className="border-b p-4">{children}</div>
}

export const CardTitle = ({ children }: { children: ReactNode }) => {
  return <h3 className="text-xl font-semibold">{children}</h3>
}

export const CardDescription = ({ children }: { children: ReactNode }) => {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

export const CardContent = ({ children }: { children: ReactNode }) => {
  return <div className="p-4">{children}</div>
}
