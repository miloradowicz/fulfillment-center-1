import { OrderWithClient } from '@/types'
import { useAppDispatch } from '@/app/hooks.ts'
import React from 'react'
import { fetchOrdersWithClient, updateOrder } from '@/store/thunks/orderThunk.ts'
import { OrderStatus } from '@/constants.ts'
import CommonStatusCell from '@/components/CommonStatusCell/CommonStatusCell.tsx'
import { orderStatusStyles } from '@/utils/commonStyles.ts'

export interface Props {
  row: OrderWithClient
}

const StatusOrderCell: React.FC<Props> = ({ row }) => {
  const dispatch = useAppDispatch()

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
      statusStyles={orderStatusStyles}
      onChangeStatus={handleStatusChange}
    />
  )
}

export default StatusOrderCell
