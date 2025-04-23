import { cn } from '@/lib/utils'
import { Tooltip, TooltipProps } from 'recharts'
import { ContentType } from 'recharts/types/component/Tooltip'

type ValueTypeConstraint = (string | number)[]
type NameTypeConstraint = string | number

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
  }
>

export function ChartContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
  config?: ChartConfig
}) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden p-4 sm:p-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ChartTooltip<
  ValueType extends ValueTypeConstraint = (number | string)[],
  NameType extends NameTypeConstraint = string
>({
  content,
}: {
  content: ContentType<ValueType, NameType>
}) {
  return <Tooltip content={content} />
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  config,
}: TooltipProps<(number | string)[], string> & {
  hideLabel?: boolean
  config?: ChartConfig
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="p-2 text-sm shadow-sm">
      {!hideLabel && <div className="font-medium">{label}</div>}
      {payload.map((entry, index) => {
        const entryConfig = config?.[entry.name as string] ?? {}
        const displayLabel = entryConfig.label ?? entry.name
        const colorStyle = entryConfig.color
          ? { color: entryConfig.color }
          : undefined

        return (
          <div
            key={`item-${ index }`}
            className="flex items-center justify-between gap-4"
          >
            <span style={colorStyle}>{displayLabel}</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        )
      })}
    </div>
  )
}

