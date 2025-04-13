import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, IconButton, Menu, MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material'
import { CSS } from '@dnd-kit/utilities'
import React, { useState } from 'react'
import { TaskCardProps } from '../hooks/TypesProps'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useAppDispatch } from '@/app/hooks.ts'
import {
  archiveTask,
  fetchTasksByUserIdWithPopulate,
  fetchTasksWithPopulate,
} from '@/store/thunks/tasksThunk.ts'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import StatusCell from './StatusCell.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { NavLink } from 'react-router-dom'
import Modal from '@/components/Modal/Modal.tsx'
import TaskForm from './TaskForm.tsx'

const TaskCard: React.FC<TaskCardProps> = ({ task, index, parent, selectedUser }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const open = Boolean(anchorEl)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: {
      ...task,
      index,
      parent,
    },
    disabled: isMobile,
  })

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation()
    setOpenEditModal(true)
    handleMenuClose()
  }

  const handleDelete = async () => {
    try {
      await dispatch(archiveTask(task._id))
      if (!selectedUser) {
        await dispatch(fetchTasksWithPopulate())
      } else {
        await dispatch(fetchTasksByUserIdWithPopulate(selectedUser))
      }
      toast.success('Задача перемещена в архив.')
    } catch (e) {
      console.error(e)
    }
    setOpenDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setOpenDeleteModal(false)
  }

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : 'none',
    zIndex: isDragging ? 9999 : 'auto',
    opacity: isDragging ? 0.9 : 1,
    touchAction: 'none',
  }



  return (
    <Card
      id={task._id}
      ref={setNodeRef}
      sx={{
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: 2,
        transform: style.transform,
        position: 'relative',
        cursor:  'grab',
        willChange: 'transform',
        zIndex: style.zIndex,
        opacity: style.opacity,
        touchAction: 'auto',
        userSelect: 'none',
      }}
      {...attributes}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <div
        {...listeners}
        style={{ padding: 16 }}
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <CardContent>
          <Typography variant="body1">
            #<strong>{task.taskNumber}</strong>
          </Typography>
          <Typography variant="body1" marginTop={1}>
            Исполнитель: <strong>{task.user.displayName}</strong>
          </Typography>
          <Typography variant="body1">
            Тип: {task.type}
          </Typography>
          <Typography variant="body1">{task.title} </Typography>
          {task.associated_arrival && (
            <NavLink to={`/arrivals/${ task.associated_arrival._id }`}  style={{
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
            <Typography variant="body2" color="textSecondary" marginTop={'5px'}>
              Создано: {dayjs(task.createdAt).format('DD.MM.YYYY HH:mm')}
            </Typography>
          )}
          {task.updatedAt && (
            <Typography variant="body2" color="textSecondary">
              Обновлено: {dayjs(task.updatedAt).format('DD.MM.YYYY HH:mm')}
            </Typography>
          )}
        </CardContent>
        {isMobile && <StatusCell task={task} selectedUser={selectedUser} />}
      </div>

      <IconButton
        style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}
        onClick={handleMenuOpen}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu style={{ marginLeft: '10px' }} anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon style={{ marginRight: 8 }} /> Редактировать
        </MenuItem>
        <MenuItem
          onClick={e => {
            e.stopPropagation()
            setOpenDeleteModal(true)
            handleMenuClose()
          }}
        >
          <DeleteIcon style={{ marginRight: 8 }} /> Переместить в архив
        </MenuItem>
      </Menu>
      <ConfirmationModal
        open={openDeleteModal}
        entityName="эту задачу"
        actionType="archive"
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />
      <Modal open={openEditModal} handleClose={() => setOpenEditModal(false)}>
        <TaskForm initialData={task} onSuccess={() => setOpenEditModal(false)}/>
      </Modal>
    </Card>
  )
}

export default TaskCard
