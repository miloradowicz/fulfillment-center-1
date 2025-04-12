import { OrderWithClient, StatusColor } from '@/types'
import { useAppDispatch } from '@/app/hooks.ts'
import React, { useState } from 'react'
import { fetchOrdersWithClient, updateOrder } from '@/store/thunks/orderThunk.ts'
import { Box, Chip, Menu, MenuItem } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import { toast } from 'react-toastify'

export interface Props {
  row: OrderWithClient,
}

const StatusOrderCell: React.FC<Props> = ({ row }) => {
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const statusColors: Record<string, StatusColor> = {
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
    try {
      setAnchorEl(null)
      if (newStatus && newStatus !== row.status) {
        const updatedData = {
          ...row,
          client: row.client._id,
          stock: row.stock._id,
          status: newStatus,
        }
        await dispatch(updateOrder({ orderId: row._id, data: updatedData })).unwrap()
        dispatch(fetchOrdersWithClient())
      }
    } catch (e) {
      if (isGlobalError(e) ) {
        toast.error(e.message)
      } else if (hasMessage(e)) {
        toast.error(e.message)
      }
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

export default StatusOrderCell
