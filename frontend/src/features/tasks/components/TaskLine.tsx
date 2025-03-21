
import { FC } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Box, Typography, Paper } from '@mui/material'
import { TaskLineProps } from '../hooks/TypesProps'
import TaskCard from './TaskCard.tsx'

const getStatusStyles = (status: string) => {
  switch (status) {
  case 'к выполнению':
    return {
      backgroundColor: '#D1D3D8',
      color: '#6B7280',
    }
  case 'в работе':
    return {
      backgroundColor: '#0052CC',
      color: '#FFFFFF',
    }
  case 'готово':
    return {
      backgroundColor: '#36B37E',
      color: '#FFFFFF',
    }
  default:
    return {
      backgroundColor: '#f7f7f7',
      color: '#000000',
    }
  }
}

const TaskLine: FC<TaskLineProps> = ({ title, items }) => {
  const { setNodeRef } = useDroppable({
    id: title,
  })

  const statusStyles = getStatusStyles(title) // Получаем стиль для статуса

  return (
    <Box
      flex={3}
      p={2}
      display="flex"
      flexDirection="column"
      minHeight="10rem"
      height="100%"
    >
      <Box style={{ display:'flex', alignItems:'center', justifyContent:'flex-start' }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            ...statusStyles,
            fontSize: '15px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '3px 10px',
            borderRadius: '7px',
            marginBottom: '12px',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Paper
        ref={setNodeRef}
        sx={{
          background: '#f7f7f7',
          borderRadius: 2,
          flex: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {items.map((task, key) => (
          <TaskCard key={task._id} index={key} parent={title} task={task} />
        ))}
      </Paper>
    </Box>
  )
}

export default TaskLine
