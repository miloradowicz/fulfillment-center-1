import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchArchivedTasks } from '@/store/thunks/tasksThunk'
import { Typography, Box, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ArchivedTaskCard from './ArchivedTaskCard.tsx'
import {
  selectAllArchivedTasks,
  selectLoadingFetchArchivedTasks,
} from '@/store/slices/taskSlice'

const ArchivedTasksPage = () => {
  const dispatch = useAppDispatch()
  const archivedTasks = useAppSelector(selectAllArchivedTasks)
  const isLoading = useAppSelector(selectLoadingFetchArchivedTasks)

  useEffect(() => {
    if (!archivedTasks && !isLoading) {
      dispatch(fetchArchivedTasks())
    }
  }, [dispatch, archivedTasks, isLoading])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (!archivedTasks) {
    return <Typography>Не удалось загрузить архив</Typography>
  }

  return (
    <Box>
      {archivedTasks.length === 0 ? (
        <Typography>Архивированных задач нет.</Typography>
      ) : (
        <Grid container spacing={2}>
          {archivedTasks.map((task, index) => (
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
