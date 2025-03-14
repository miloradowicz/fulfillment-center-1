import { Task, TaskWithPopulate, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import {
  addTask,
  deleteTask,
  fetchTaskById,
  fetchTasks, fetchTasksByUserId,
  fetchTasksWithPopulate,
  updateTask,
} from '../thunks/tasksThunk.ts'

interface TaskState {
  task: Task | null
  tasksPopulate: TaskWithPopulate[] | null
  tasks: Task[] | null
  loadingFetch: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
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
  },
})

export const taskReducer = taskSlice.reducer
