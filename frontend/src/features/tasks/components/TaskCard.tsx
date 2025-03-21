import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { CSS } from '@dnd-kit/utilities'
import React, { useState } from 'react'
import { TaskCardProps } from '../hooks/TypesProps'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useAppDispatch } from '../../../app/hooks.ts'
import { archiveTask, fetchTasksWithPopulate } from '../../../store/thunks/tasksThunk.ts'
import { toast } from 'react-toastify'

const TaskCard: React.FC<TaskCardProps> = ({ task, index, parent }) => {
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
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    console.log('Редактирование')
    handleMenuClose()
  }

  const handleDelete = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите переместить в архив эту задачу?')) {
        await dispatch(archiveTask(id))
        await dispatch(fetchTasksWithPopulate())
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
    zIndex: isDragging ? 1000 : 'auto',
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
        willChange: 'transform',
        zIndex: style.zIndex,
      }}
      {...attributes}
    >
      <CardContent {...listeners}>
        <Typography marginTop={'10px'} variant="body1">
          Исполнитель: <strong>{task.user.displayName}</strong>
        </Typography>
        <Typography variant="body1">{task.title}</Typography>
        {task.description ? (
          <Typography variant="body2" color="textSecondary">
            {task.description}
          </Typography>
        ) : null}
      </CardContent>
      <IconButton
        type={'button'}
        style={{ position: 'absolute', top: '0', right: '0', zIndex: 1000 }}
        onClick={handleMenuOpen}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu style={{ marginLeft: '10px' }} anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon style={{ marginRight: 8 }} /> Редактировать
        </MenuItem>
        <MenuItem onClick={() => handleDelete(task._id)}>
          <DeleteIcon style={{ marginRight: 8 }} /> Удалить
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default TaskCard
