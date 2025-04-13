import React, { useState } from 'react'
import { ArrivalWithClient } from '@/types'
import { useAppDispatch } from '@/app/hooks'
import { fetchPopulatedArrivals, updateArrival } from '@/store/thunks/arrivalThunk'
import { ArrivalStatus } from '@/constants'
import { toast } from 'react-toastify'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Tooltip } from '@/components/ui/tooltip'
import { TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { ChevronDown } from 'lucide-react'

export interface Props {
  row: ArrivalWithClient
}

const StatusArrivalCell: React.FC<Props> = ({ row }) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  const status = row.arrival_status || 'ожидается доставка'

  const softStatusStyles: Record<string, string> = {
    'ожидается доставка': 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800 transition-colors rounded-lg font-bold',
    'получена': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition-colors rounded-lg font-bold',
    'отсортирована': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-colors rounded-lg font-bold',
    default: 'bg-slate-100 text-slate-700 border',
  }

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  const handleChangeStatus = async (newStatus: string) => {
    if (newStatus === status) return
    setLoading(true)
    try {
      const updatedData = {
        ...row,
        client: row.client._id,
        stock: row.stock._id,
        arrival_status: newStatus,
        shipping_agent: row.shipping_agent?._id,
      }

      await dispatch(updateArrival({ arrivalId: row._id, data: updatedData })).unwrap()
      await dispatch(fetchPopulatedArrivals())
    } catch (error) {
      console.error(error)
      if (typeof error === 'string') toast.error(error)
      else if (error instanceof Error) toast.error(error.message)
      else if (error && typeof error === 'object' && 'message' in error) {
        toast.error((error as { message: string }).message)
      }
    } finally {
      setLoading(false)
    }
  }

  const badgeClass = softStatusStyles[status] || softStatusStyles.default

  const badgeContent = (
    <Badge
      className={`w-full justify-between gap-2 px-3 py-1 rounded-md text-sm font-medium ${ badgeClass } cursor-pointer`}
    >
      {capitalize(status)}
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
            {status && (
              <TooltipContent>
                <p>{status}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent>
          {ArrivalStatus.map(option => (
            <DropdownMenuItem
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

export default StatusArrivalCell
