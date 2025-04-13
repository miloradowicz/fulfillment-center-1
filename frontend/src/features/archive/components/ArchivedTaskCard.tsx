import { TaskCardProps } from '../../tasks/hooks/TypesProps'
import { Box, Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useAppDispatch } from '@/app/hooks'
import {
  deleteTask,
  fetchArchivedTasks,
  fetchTasksWithPopulate,
  unarchiveTask,
} from '@/store/thunks/tasksThunk'
import { toast } from 'react-toastify'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { NavLink } from 'react-router-dom'
import dayjs from 'dayjs'
import UnarchiveIcon from '@mui/icons-material/Unarchive'

const ArchivedTaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useAppDispatch()
  const [openUnarchiveModal, setOpenUnarchiveModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleUnarchiveClient = async () => {
    try {
      await dispatch(unarchiveTask(task._id))
      await dispatch(fetchArchivedTasks())
      await dispatch(fetchTasksWithPopulate())
      toast.success('Задача восстановлена из архива.')
    } catch (e) {
      console.error(e)
      toast.error('Ошибка при восстановлении задачи.')
    }
    setOpenUnarchiveModal(false)
  }

  const handleDeleteTask = async () => {
    try {
      await dispatch(deleteTask(task._id))
      await dispatch(fetchArchivedTasks())
      toast.success('Задача успешно удалена.')
    } catch (e) {
      console.error(e)
      toast.error('Ошибка при удалении задачи.')
    }
    setOpenDeleteModal(false)
  }

  return (
    <Card
      sx={{
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: 2,
        padding: '8px 12px',
        position: 'relative',
        minWidth: '280px',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            #<strong>{task.taskNumber}</strong>
          </Typography>
        </Box>
        <Typography variant="body1">
          Исполнитель: <strong>{task.user.displayName}</strong>
        </Typography>
        <Typography variant="body1">Тип: {task.type}</Typography>
        <Typography variant="body1">{task.title}</Typography>

        {task.associated_arrival && (
          <NavLink to={`/arrivals/${ task.associated_arrival._id }`} style={{
            textDecoration: 'underline',
            color: '#1A73E8',
          }}>
            {`Поставка ${ task.associated_arrival.arrivalNumber }`}
          </NavLink>
        )}

        {task.associated_order && (
          <NavLink to={`/orders/${ task.associated_order._id }`} style={{
            textDecoration: 'underline',
            color: '#1A73E8',
          }}>
            {`Заказ ${ task.associated_order.orderNumber }`}
          </NavLink>
        )}

        {task.description && (
          <Typography variant="body2" color="textSecondary">
            {task.description}
          </Typography>
        )}

        {task.createdAt && (
          <Typography variant="body2" color="textSecondary" mt={1}>
            Создано: {dayjs(task.createdAt).format('DD.MM.YYYY HH:mm')}
          </Typography>
        )}
        {task.updatedAt && (
          <Typography variant="body2" color="textSecondary">
            Обновлено: {dayjs(task.updatedAt).format('DD.MM.YYYY HH:mm')}
          </Typography>
        )}
      </CardContent>

      <IconButton
        sx={{ position: 'absolute', top: 0, right: 0 }}
        onClick={handleMenuOpen}
      >
        <MoreHorizIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setOpenUnarchiveModal(true)
            handleMenuClose()
          }}
        >
          <UnarchiveIcon sx={{ marginRight: 1 }} />
          Восстановить
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenDeleteModal(true)
            handleMenuClose()
          }}
        >
          <ClearIcon sx={{ marginRight: 1 }} />
          Удалить
        </MenuItem>
      </Menu>

      <ConfirmationModal
        open={openUnarchiveModal}
        entityName="эту задачу"
        actionType="unarchive"
        onConfirm={handleUnarchiveClient}
        onCancel={() => setOpenUnarchiveModal(false)}
      />

      <ConfirmationModal
        open={openDeleteModal}
        entityName="эту задачу"
        actionType="delete"
        onConfirm={handleDeleteTask}
        onCancel={() => setOpenDeleteModal(false)}
      />
    </Card>
  )
}

export default ArchivedTaskCard
