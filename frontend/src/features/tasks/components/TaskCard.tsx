import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { CSS } from '@dnd-kit/utilities'
import React, { useState } from 'react'
import { TaskCardProps } from '../hooks/TypesProps'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useAppDispatch } from '../../../app/hooks.ts'
import { archiveTask, fetchTasksByUserIdWithPopulate, fetchTasksWithPopulate } from '../../../store/thunks/tasksThunk.ts'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const TaskCard: React.FC<TaskCardProps> = ({ task, index, parent, selectedUser }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: {
      ...task,
      index,
      parent,
    },
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const dispatch = useAppDispatch()

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation()
    console.log('Редактирование')
    handleMenuClose()
  }

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      if (confirm('Вы уверены, что хотите переместить в архив эту задачу?')) {
        await dispatch(archiveTask(id))
        if (!selectedUser) {
          await dispatch(fetchTasksWithPopulate())
        } else {
          await dispatch(fetchTasksByUserIdWithPopulate(selectedUser))
        }
        toast.success('Задача перемещена в архив.')
      } else {
        toast.info('Вы отменили перемещение задачи в архив.')
      }
    } catch (e) {
      console.error(e)
    }
    handleMenuClose()
  }

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : 'none',
    zIndex: isDragging ? 9999 : 'auto',
    opacity: isDragging ? 0.9 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      sx={{
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: 2,
        transform: style.transform,
        position: 'relative',
        cursor: 'grab',
        willChange: 'transform',
        zIndex: style.zIndex,
        opacity: style.opacity,
      }}
      {...attributes}
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
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
          <Typography marginTop={'10px'} variant="body1">
            Исполнитель: <strong>{task.user.displayName}</strong>
          </Typography>
          <Typography variant="body1">{task.title}</Typography>
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
        <MenuItem onClick={e => handleDelete(task._id, e)}>
          <DeleteIcon style={{ marginRight: 8 }} /> Удалить
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default TaskCard
