import { Box, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import KanbanLane from './CanbanLine.tsx'
import { DndContext, rectIntersection } from '@dnd-kit/core'
import { useAppDispatch } from '../../../app/hooks.ts'
import { onDragEnd } from '../hooks/onDragEnd.ts'
import { useCanbanBoard } from '../hooks/useCanbanBoard.ts'

const KanbanBoard = () => {
  const dispatch = useAppDispatch()

  const {
    todoItems,
    setTodoItems,
    doneItems,
    setDoneItems,
    inProgressItems,
    setInProgressItems,
    fetchLoading,
  } = useCanbanBoard()

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={e =>
        onDragEnd({
          e,
          todoItems,
          setTodoItems,
          doneItems,
          setDoneItems,
          inProgressItems,
          setInProgressItems,
          dispatch,
        })}
    >
      {fetchLoading? <Box textAlign={'center'} mt={5}><CircularProgress/></Box>:<Box display="flex" flexDirection="column" p={2}>
        <Grid container spacing={2} mt={2}>
          <Grid size={{ xs: 4 }}><KanbanLane title="к выполнению" items={todoItems} /></Grid>
          <Grid size={{ xs: 4 }}><KanbanLane title="в работе" items={inProgressItems} /></Grid>
          <Grid size={{ xs: 4 }}><KanbanLane title="готово" items={doneItems} /></Grid>
        </Grid>
      </Box>}
    </DndContext>
  )
}

export default KanbanBoard
