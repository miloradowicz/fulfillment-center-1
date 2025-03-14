import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, Typography } from '@mui/material'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'
import { TaskCardProps } from '../hooks/TypesProps'


const TaskCard:React.FC<TaskCardProps> = ({ task, index, parent }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: {
      ...task,
      index,
      parent,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
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
      }}
      {...listeners}
      {...attributes}
    >
      <CardContent>
        <Typography variant="body1">Исполнитель: <strong>{task.user.displayName}</strong></Typography>
        <Typography variant="body1">{task.title}</Typography>
        {task.description?<Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>:null}
      </CardContent>
    </Card>
  )
}

export default TaskCard


