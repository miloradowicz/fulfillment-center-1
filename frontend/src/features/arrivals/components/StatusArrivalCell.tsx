import React from 'react'
import { ArrivalWithClient } from '@/types'
import { useAppDispatch } from '@/app/hooks'
import { fetchPopulatedArrivals, updateArrival } from '@/store/thunks/arrivalThunk'
import { ArrivalStatus } from '@/constants'

import CommonStatusCell from '@/components/CommonStatusCell/CommonStatusCell.tsx'

export interface Props {
  row: ArrivalWithClient
}

const StatusArrivalCell: React.FC<Props> = ({ row }) => {
  const dispatch = useAppDispatch()

  const statusStyles: Record<string, string> = {
    'ожидается доставка':
      'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800 transition-colors rounded-lg font-bold',
    'получена':
      'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition-colors rounded-lg font-bold',
    'отсортирована':
      'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-colors rounded-lg font-bold',
    default: 'bg-slate-100 text-slate-700 border font-bold',
  }

  const handleStatusChange = async (row: ArrivalWithClient, newStatus: string) => {
    const updatedData = {
      ...row,
      client: row.client._id,
      stock: row.stock._id,
      arrival_status: newStatus,
      shipping_agent: row.shipping_agent?._id,
    }

    await dispatch(updateArrival({ arrivalId: row._id, data: updatedData })).unwrap()
    await dispatch(fetchPopulatedArrivals())
  }

  return (
    <CommonStatusCell
      row={row}
      statusKey="arrival_status"
      statusOptions={ArrivalStatus}
      statusStyles={statusStyles}
      onChangeStatus={handleStatusChange}
    />
  )
}

export default StatusArrivalCell
