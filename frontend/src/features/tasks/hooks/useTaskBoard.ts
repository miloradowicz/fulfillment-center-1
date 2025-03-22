import { useCallback, useEffect, useRef, useState } from 'react'
import { TaskWithPopulate } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchTask, selectPopulatedTasks } from '../../../store/slices/taskSlice.ts'
import { fetchTasksByUserIdWithPopulate, fetchTasksWithPopulate } from '../../../store/thunks/tasksThunk.ts'
import { selectAllUsers } from '../../../store/slices/userSlice.ts'
import { fetchUsers } from '../../../store/thunks/userThunk.ts'

export const useTaskBoard = () => {
  const [todoItems, setTodoItems] = useState<TaskWithPopulate[]>([])
  const [doneItems, setDoneItems] = useState<TaskWithPopulate[]>([])
  const [inProgressItems, setInProgressItems] = useState<TaskWithPopulate[]>([])
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectPopulatedTasks)
  const fetchLoading = useAppSelector(selectLoadingFetchTask)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null) // ID выбранного пользователя
  const inputRef = useRef<HTMLInputElement | null>(null)
  const users = useAppSelector(selectAllUsers)

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

  const filterTasks = (items: TaskWithPopulate[]) =>
    items
      .filter(item =>
        (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))))
      .map(item => ({ ...item, key: item._id }))

  useEffect(() => {
    if(tasks){
      setTodoItems(filterTasksByStatus('к выполнению'))
      setDoneItems(filterTasksByStatus('готово'))
      setInProgressItems(filterTasksByStatus('в работе'))
    }
  }, [filterTasksByStatus, tasks])


  const fetchAllUsers = useCallback(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    void fetchAllUsers()
  }, [dispatch, fetchAllUsers])

  const clearAllFilters = async () => {
    setSearchQuery('')
    setSelectedUser(null)
    inputRef.current?.focus()
    await dispatch(fetchTasksWithPopulate())
  }

  const clearSearch =  async () => {
    setSearchQuery('')
    inputRef.current?.focus()
    if (selectedUser) {
      await dispatch(fetchTasksByUserIdWithPopulate(selectedUser))
    } else {
      await dispatch(fetchTasksWithPopulate())
    }
  }
  return {
    todoItems,
    doneItems,
    inProgressItems,
    fetchLoading,
    setDoneItems,
    setTodoItems,
    setInProgressItems,
    open,
    searchQuery,
    users,
    clearAllFilters,
    clearSearch,
    filterTasks,
    setSearchQuery,
    inputRef,
    selectedUser,
    setSelectedUser,
  }
}
