import React from 'react'
import { ArrivalWithClient } from '@/types'
import { useAppDispatch } from '@/app/hooks'
import { fetchPopulatedArrivals, updateArrival } from '@/store/thunks/arrivalThunk'
import { ArrivalStatus } from '@/constants'

import CommonStatusCell from '@/components/CommonStatusCell/CommonStatusCell.tsx'
import { arrivalStatusStyles } from '@/utils/commonStyles.ts'

export interface Props {
  row: ArrivalWithClient
}

const StatusArrivalCell: React.FC<Props> = ({ row }) => {
  const dispatch = useAppDispatch()

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
      statusStyles={arrivalStatusStyles}
      onChangeStatus={handleStatusChange}
    />
  )
}

export default StatusArrivalCell
