import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchArchivedTasks } from '../../../store/thunks/tasksThunk'
import { Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ArchivedTaskCard from './ArchivedTaskCard.tsx'
import { selectAllArchivedTasks } from '../../../store/slices/taskSlice'

const ArchivedTasksPage = () => {
  const dispatch = useAppDispatch()
  const archivedTasks = useAppSelector(selectAllArchivedTasks)

  useEffect(() => {
    if (!archivedTasks?.length) {
      dispatch(fetchArchivedTasks())
    }
  }, [dispatch, archivedTasks])

  return (
    <Box>
      {archivedTasks?.length === 0 ? (
        <Typography>Архив пуст.</Typography>
      ) : (
        <Grid container spacing={2}>
          {archivedTasks?.map((task, index) => (
            <Grid key={task._id}>
              <ArchivedTaskCard
                task={task}
                index={index}
                parent="archived"
                selectedUser={null}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default ArchivedTasksPage
