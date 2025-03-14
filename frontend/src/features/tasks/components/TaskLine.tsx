import { FC } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Box, Typography, Paper } from '@mui/material'
import { TaskLineProps } from '../hooks/TypesProps'
import TaskCard from './TaskCard.tsx'


const TaskLine: FC<TaskLineProps> = ({ title, items }) => {
  const { setNodeRef } = useDroppable({
    id: title,
  })

  return (
    <Box flex={3} p={2} display="flex" flexDirection="column" minHeight="10rem">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Paper
        ref={setNodeRef}
        sx={{
          backgroundColor: 'grey.200',
          borderRadius: 1,
          flex: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
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
