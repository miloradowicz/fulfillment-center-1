import { Task, TaskWithPopulate, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import {
  addTask, archiveTask,
  deleteTask,
  fetchTaskById,
  fetchTasks, fetchTasksByUserId, fetchTasksByUserIdWithPopulate,
  fetchTasksWithPopulate,
  updateTask,
  updateTaskStatus,
} from '../thunks/tasksThunk.ts'

interface TaskState {
  task: Task | null
  tasksPopulate: TaskWithPopulate[] | null
  tasks: Task[] | null
  loadingFetch: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  loadingArchive: boolean
  error: boolean
  createError: ValidationError | null
}

const initialState: TaskState= {
  task: null,
  tasksPopulate: null,
  tasks: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  loadingArchive: false,
  error: false,
  createError: null,
}

export const selectTask= (state: RootState) => state.tasks.task
export const selectAllTasks = (state: RootState) => state.tasks.tasks
export const selectPopulatedTasks = (state: RootState) => state.tasks.tasksPopulate
export const selectLoadingFetchTask = (state: RootState) => state.tasks.loadingFetch
export const selectLoadingAddTask = (state: RootState) => state.tasks.loadingAdd
export const selectLoadingDeleteTask = (state: RootState) => state.tasks.loadingDelete
export const selectLoadingUpdateTask = (state: RootState) => state.tasks.loadingUpdate
export const selectLoadingArchiveTask = (state: RootState) => state.tasks.loadingArchive
export const selectArrivalError = (state: RootState) => state.tasks.error
export const selectCreateError = (state: RootState) => state.tasks.createError

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchTasks.fulfilled, (state, { payload: tasks }) => {
        state.loadingFetch = false
        state.tasks = tasks
      })
      .addCase(fetchTasks.rejected, state => {
        state.loadingFetch = false
      })
      .addCase(fetchTasksByUserId.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchTasksByUserId.fulfilled, (state, { payload: tasks }) => {
        state.loadingFetch = false
        state.tasks = tasks
      })
      .addCase(fetchTasksByUserId.rejected, state => {
        state.loadingFetch = false
      })
      .addCase(fetchTasksWithPopulate.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchTasksWithPopulate.fulfilled, (state, { payload: tasks }) => {
        state.loadingFetch = false
        state.tasksPopulate = tasks
      })
      .addCase(fetchTasksWithPopulate.rejected, state => {
        state.loadingFetch = false
      })
      .addCase(fetchTasksByUserIdWithPopulate.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchTasksByUserIdWithPopulate.fulfilled, (state, { payload: tasks }) => {
        state.loadingFetch = false
        state.tasksPopulate = tasks
      })
      .addCase(fetchTasksByUserIdWithPopulate.rejected, state => {
        state.loadingFetch = false
      })

      .addCase(fetchTaskById.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchTaskById.fulfilled, (state, { payload: task }) => {
        state.loadingFetch = false
        state.task = task
      })
      .addCase(fetchTaskById.rejected, state => {
        state.loadingFetch = false
      })

      .addCase(addTask.pending, state => {
        state.loadingAdd = true
        state.createError = null
      })
      .addCase(addTask.fulfilled, state => {
        state.loadingAdd = false
      })
      .addCase(addTask.rejected, (state, { payload: error }) => {
        state.loadingAdd = false
        state.createError = error || null
      })

      .addCase(deleteTask.pending, state => {
        state.loadingDelete = true
        state.error = false
      })
      .addCase(deleteTask.fulfilled, state => {
        state.loadingDelete = false
        state.error = false
      })
      .addCase(deleteTask.rejected, state => {
        state.loadingDelete = false
        state.error = true
      })

      .addCase(updateTask.pending, state => {
        state.loadingUpdate = true
        state.error = false
      })
      .addCase(updateTask.fulfilled, state => {
        state.loadingUpdate = false
        state.error = false
      })
      .addCase(updateTask.rejected, state => {
        state.loadingUpdate = false
        state.error = true
      })

      .addCase(updateTaskStatus.pending, state => {
        state.loadingUpdate = true
        state.error = false
      })
      .addCase(updateTaskStatus.fulfilled, state => {
        state.loadingUpdate = false
        state.error = false
      })
      .addCase(updateTaskStatus.rejected, state => {
        state.loadingUpdate = false
        state.error = true
      })

      .addCase(archiveTask.pending, state => {
        state.loadingArchive = true
        state.error = false
      })
      .addCase(archiveTask.fulfilled, state => {
        state.loadingArchive = false
        state.error = false
      })
      .addCase(archiveTask.rejected, state => {
        state.loadingArchive = false
        state.error = true
      })
  },
})

export const taskReducer = taskSlice.reducer
