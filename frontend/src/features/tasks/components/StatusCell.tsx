import { StatusColor } from '../../../types'
import { useAppDispatch } from '../../../app/hooks.ts'
import React, { useState } from 'react'
import { Box, Chip, Menu, MenuItem } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { fetchTasksByUserIdWithPopulate, fetchTasksWithPopulate, updateTask } from '../../../store/thunks/tasksThunk.ts'
import { PropsStatus } from '../hooks/TypesProps'


const StatusCell:React.FC<PropsStatus> =({ task, selectedUser  })  => {
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const statusColors: Record<string, StatusColor> = {
    'к выполнению': 'warning',
    'в работе': 'success',
    'готово': 'info',
  }

  const status = task.status || 'к выполнению'
  const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  const statusOptions = ['к выполнению', 'в работе', 'готово']
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = async (newStatus?: string) => {
    setAnchorEl(null)
    if (newStatus && newStatus !== task.status) {
      const currentDate = new Date().toISOString()

      const updatedData = {
        ...task,
        associated_arrival: task.associated_arrival ? task.associated_arrival._id : null,
        associated_order: task.associated_order ? task.associated_order._id : null,
        user: task.user._id,
        status: newStatus,
      }

      if (newStatus === 'в работе') {
        updatedData.date_inProgress = currentDate
        updatedData.date_Done = null
        updatedData.date_ToDO = null
      } else if (newStatus === 'готово') {
        updatedData.date_Done = currentDate
        updatedData.date_ToDO = null
        updatedData.date_inProgress = null
      } else if (newStatus === 'к выполнению') {
        updatedData.date_ToDO = currentDate
        updatedData.date_Done = null
        updatedData.date_inProgress = null
      }
      await dispatch(updateTask({ taskId: task._id, data: updatedData })).unwrap()
      if (!selectedUser) {
        await dispatch(fetchTasksWithPopulate())
      } else {
        await dispatch(fetchTasksByUserIdWithPopulate(selectedUser))
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
      {chip}
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

export default StatusCell
