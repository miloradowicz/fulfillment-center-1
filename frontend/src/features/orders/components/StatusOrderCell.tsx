import { OrderWithClient } from '@/types'
import { useAppDispatch } from '@/app/hooks.ts'
import React from 'react'
import { fetchOrdersWithClient, updateOrder } from '@/store/thunks/orderThunk.ts'
import { OrderStatus } from '@/constants.ts'
import CommonStatusCell from '@/components/CommonStatusCell/CommonStatusCell.tsx'

export interface Props {
  row: OrderWithClient
}

const StatusOrderCell: React.FC<Props> = ({ row }) => {
  const dispatch = useAppDispatch()

  const statusStyles: Record<string, string> = {
    'в сборке':
      'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800 transition-colors rounded-lg font-bold',
    'в пути':
      'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-colors rounded-lg font-bold',
    'доставлен':
      'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition-colors rounded-lg font-bold',
    default: 'bg-primary/10 text-primary/80 border font-bold hover:bg-primary/20 hover:text-primary',
  }

  const handleStatusChange = async (row: OrderWithClient, newStatus: string) => {
    const updatedData = {
      ...row,
      client: row.client._id,
      stock: row.stock._id,
      status: newStatus,
    }

    await dispatch(updateOrder({ orderId: row._id, data: updatedData })).unwrap()
    await dispatch(fetchOrdersWithClient())
  }

  return (
    <CommonStatusCell
      row={row}
      statusKey="status"
      statusOptions={OrderStatus}
      statusStyles={statusStyles}
      onChangeStatus={handleStatusChange}
    />
  )
}

export default StatusOrderCell
