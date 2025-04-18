import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { handleErrorToast } from '@/utils/handleErrorToast.ts'
import { capitalize } from '@/utils/capitalizeFirstLetter'


interface StatusCellProps<T, K extends keyof T> {
  row: T
  statusKey: K
  statusOptions: string[]
  statusStyles: Record<string, string>
  onChangeStatus: (row: T, newStatus: string) => Promise<void>
}

const CommonStatusCell = <T, K extends keyof T>({
  row,
  statusKey,
  statusOptions,
  statusStyles,
  onChangeStatus,
}: StatusCellProps<T, K>) => {
  const [loading, setLoading] = useState(false)

  const currentStatus = String(row[statusKey])
  const badgeClass = statusStyles[currentStatus] || statusStyles.default

  const handleChangeStatus = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    setLoading(true)
    try {
      await onChangeStatus(row, newStatus)
    } catch (error) {
      console.error(error)
      handleErrorToast(error)
    } finally {
      setLoading(false)
    }
  }

  const badgeContent = (
    <Badge
      className={`w-full justify-between gap-2 px-3 py-1 rounded-md text-sm font-medium ${ badgeClass } cursor-pointer`}
    >
      {capitalize(currentStatus)}
      <ChevronDown className="h-4 w-4 opacity-60" />
    </Badge>
  )

  return (
    <div className="flex justify-center items-center w-full h-full cursor-pointer">
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                {badgeContent}
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{capitalize(currentStatus)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent>
          {statusOptions.map(option => (
            <DropdownMenuItem
              className="cursor-pointer"
              key={option}
              onClick={() => handleChangeStatus(option)}
              disabled={loading}
            >
              {capitalize(option)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CommonStatusCell
