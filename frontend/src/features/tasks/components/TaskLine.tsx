
import { FC } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Box, Typography, Paper } from '@mui/material'
import { TaskLineProps } from '../hooks/TypesProps'
import TaskCard from './TaskCard.tsx'
import { getStatusStyles } from '../utils/statusStyle.ts'
import TaskCardSceleton from './TaskCardSceleton.tsx'
import { useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchTask } from '../../../store/slices/taskSlice.ts'


const TaskLine: FC<TaskLineProps> = ({ title, items, selectedUser }) => {
  const loadingFetchTask = useAppSelector(selectLoadingFetchTask)
  const { setNodeRef } = useDroppable({
    id: title,
  })

  const statusStyles = getStatusStyles(title)

  return (
    <Box
      flex={3}
      p={2}
      display="flex"
      flexDirection="column"
      minHeight="300px"
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
        {loadingFetchTask?<>
          <TaskCardSceleton /></>:<> {items.map((task, key) => (
          <TaskCard selectedUser={selectedUser} key={task._id} index={key} parent={title} task={task} />
        ))}</>}

      </Paper>
    </Box>
  )
}

export default TaskLine
