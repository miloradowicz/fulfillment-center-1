import { ArrivalWithClient, StatusColor } from '../../../types'
import { useAppDispatch } from '../../../app/hooks.ts'
import React, { useState } from 'react'
import { Box, Chip, Menu, MenuItem, Tooltip } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { fetchPopulatedArrivals, updateArrival } from '../../../store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'


export interface Props  {
  row: ArrivalWithClient,
}

const StatusArrivalCell:React.FC<Props> =({ row })  => {
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const statusColors: Record<string, StatusColor> = {
    'ожидается доставка': 'warning',
    'получена': 'success',
    'отсортирована': 'info',
  }

  const statusOptions = ['ожидается доставка', 'получена', 'отсортирована']

  const status = row.arrival_status || 'ожидается доставка'
  const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = async (newStatus?: string) => {
    try {
      setAnchorEl(null)
      if (newStatus && newStatus !== row.arrival_status) {
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
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        return error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error((error as { message: string }).message)
      } else if (typeof error === 'string') {
        toast.error(error)
      }
    }
  }

  const chip = (
    <Chip
      label={capitalizeFirstLetter(status)}
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
  )

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      {status === 'ожидается доставка' || status === 'отсортирована'? <Tooltip title={status} arrow placement="top">{chip}</Tooltip>:chip}
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

export default StatusArrivalCell
