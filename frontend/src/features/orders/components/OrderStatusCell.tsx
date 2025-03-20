import { OrderWithClient } from '../../../types'
import { useAppDispatch } from '../../../app/hooks.ts'
import React, { useState } from 'react'
import { fetchOrdersWithClient, updateOrder } from '../../../store/thunks/orderThunk.ts'
import { Box, Chip, Menu, MenuItem } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export interface Props  {
  row: OrderWithClient,
}

const OrderStatusCell:React.FC<Props> =({ row })  => {
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const statusColors: Record<string, 'warning' | 'success' | 'info' | 'default'> = {
    'в сборке': 'warning',
    'доставлен': 'success',
    'в пути': 'info',
  }

  const statusOptions = ['в сборке', 'в пути', 'доставлен']
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = async (newStatus?: string) => {
    setAnchorEl(null)
    if (newStatus) {
      const updatedData = {
        ...row,
        client: row.client._id,
        status: newStatus,
      }
      await dispatch(updateOrder({ orderId: row._id, data: updatedData })).unwrap()
      dispatch(fetchOrdersWithClient())
    }
  }
  const status = row.status ?? 'в сборке'

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      <Chip
        label={status}
        color={statusColors[status] ?? 'default'}
        onClick={handleClick}
        icon={<ArrowDropDownIcon style={{ marginRight: '5px' }} />}
        sx={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          width: '100%',
          cursor: 'pointer',
        }}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
        {statusOptions.map(option => (
          <MenuItem key={option} onClick={() => handleClose(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default OrderStatusCell
