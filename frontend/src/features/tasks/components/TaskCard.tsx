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


const TaskCard:React.FC<TaskCardProps> = ({ task, index, parent }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
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

  const handleMenuOpen = (event:  React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    console.log('Редактирование')
    handleMenuClose()
  }
  const handleDelete = async (id:string) => {
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
  }

  return (
    <Card
      ref={setNodeRef}
      sx={{
        borderRadius: 1,
        border: '2px solid #9e9e9e',
        boxShadow: '0px 0px 5px 2px rgba(33, 33, 33, 0.23)',
        backgroundColor: '#fff',
        marginBottom: 2,
        transform: style.transform,
        position: 'relative',
        willChange: 'transform',
      }}
      {...attributes}
    >
      <CardContent  {...listeners}>
        <Typography variant="body1">Исполнитель: <strong>{task.user.displayName}</strong></Typography>
        <Typography variant="body1">{task.title}{task._id}</Typography>
        {task.description?<Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>:null}
      </CardContent>
      <IconButton
        type={'button'}
        style={{ position: 'absolute', top: '0', right: '0',  zIndex: 1000 }}
        onClick={handleMenuOpen}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        style={{ marginLeft: '10px' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon style={{ marginRight: 8 }} /> Редактировать
        </MenuItem>
        <MenuItem onClick={() =>
          handleDelete(task._id)
        }>
          <DeleteIcon style={{ marginRight: 8 }} /> Удалить
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default TaskCard


