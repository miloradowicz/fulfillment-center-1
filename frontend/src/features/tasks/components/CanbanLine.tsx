import { FC } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Box, Typography, Paper } from '@mui/material'
import KanbanCard from './CanbanCard.tsx'
import { KanbanLaneProps } from '../hooks/TypesProps'


const KanbanLane: FC<KanbanLaneProps> = ({ title, items }) => {
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
          <KanbanCard key={task._id} index={key} parent={title} task={task} />
        ))}
      </Paper>
    </Box>
  )
}

export default KanbanLane
