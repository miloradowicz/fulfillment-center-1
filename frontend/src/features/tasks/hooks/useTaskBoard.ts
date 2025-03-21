import { useCallback, useEffect, useState } from 'react'
import { TaskWithPopulate } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchTask, selectPopulatedTasks } from '../../../store/slices/taskSlice.ts'
import { fetchTasksWithPopulate } from '../../../store/thunks/tasksThunk.ts'


export const useTaskBoard = () => {
  const [todoItems, setTodoItems] = useState<TaskWithPopulate[]>([])
  const [doneItems, setDoneItems] = useState<TaskWithPopulate[]>([])
  const [inProgressItems, setInProgressItems] = useState<TaskWithPopulate[]>([])
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectPopulatedTasks)
  const fetchLoading = useAppSelector(selectLoadingFetchTask)
  const fetchAllTasks = useCallback(() => {
    dispatch(fetchTasksWithPopulate())
  }, [dispatch])

  useEffect(() => {
    void fetchAllTasks()
  }, [dispatch, fetchAllTasks])
  const filterTasksByStatus = useCallback((status: string) => {
    if(tasks){
      return tasks?.filter(task => task.status === status)
    }
    return []
  }, [tasks])

  useEffect(() => {
    if(tasks){
      setTodoItems(filterTasksByStatus('к выполнению'))
      setDoneItems(filterTasksByStatus('готово'))
      setInProgressItems(filterTasksByStatus('в работе'))
    }
  }, [filterTasksByStatus, tasks])
  return {
    todoItems,
    doneItems,
    inProgressItems,
    fetchLoading,
    setDoneItems,
    setTodoItems,
    setInProgressItems,
    open,
  }
}
