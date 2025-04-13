import { Task, TaskWithPopulate, ValidationError } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store.ts'
import {
  addTask, archiveTask,
  deleteTask, fetchArchivedTasks,
  fetchTaskById,
  fetchTasks, fetchTasksByUserId, fetchTasksByUserIdWithPopulate,
  fetchTasksWithPopulate, unarchiveTask,
  updateTask,
  updateTaskStatus,
} from '../thunks/tasksThunk.ts'

interface TaskState {
  task: TaskWithPopulate | null
  tasksPopulate: TaskWithPopulate[] | null
  tasks: Task[] | null
  archivedTasks: TaskWithPopulate[] | null
  loadingFetch: boolean
  loadingFetchTaskById: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  loadingArchive: boolean
  loadingFetchArchived: boolean
  error: boolean
  createError: ValidationError | null
}

const initialState: TaskState = {
  task: null,
  tasksPopulate: null,
  tasks: null,
  archivedTasks: null,
  loadingFetch: false,
  loadingFetchTaskById: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  loadingArchive: false,
  loadingFetchArchived: false,
  error: false,
  createError: null,
}


export const selectTask= (state: RootState) => state.tasks.task
export const selectAllTasks = (state: RootState) => state.tasks.tasks
export const selectAllArchivedTasks = (state: RootState) => state.tasks.archivedTasks
export const selectPopulatedTasks = (state: RootState) => state.tasks.tasksPopulate
export const selectLoadingFetchTask = (state: RootState) => state.tasks.loadingFetch
export const selectLoadingFetchArchivedTasks = (state: RootState) => state.tasks.loadingFetchArchived
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
      .addCase(fetchArchivedTasks.pending, state => {
        state.loadingFetchArchived = true
        state.error = false
      })
      .addCase(fetchArchivedTasks.fulfilled, (state, { payload }) => {
        state.loadingFetchArchived = false
        state.archivedTasks = payload
      })
      .addCase(fetchArchivedTasks.rejected, state => {
        state.loadingFetchArchived = false
        state.error = true
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
        state.loadingFetchTaskById = true
        state.error = false
      })
      .addCase(fetchTaskById.fulfilled, (state, { payload: task }) => {
        state.loadingFetchTaskById = false
        state.task = task
      })
      .addCase(fetchTaskById.rejected, state => {
        state.loadingFetchTaskById = false
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
      .addCase(unarchiveTask.pending, state => {
        state.loadingArchive = true
        state.error = false
      })
      .addCase(unarchiveTask.fulfilled, (state, action) => {
        state.loadingArchive = false
        state.error = false
        if (state.archivedTasks) {
          state.archivedTasks = state.archivedTasks.filter(task => task._id !== action.payload.id)
        }
      })
      .addCase(unarchiveTask.rejected, state => {
        state.loadingArchive = false
        state.error = true
      })
  },
})

export const taskReducer = taskSlice.reducer
