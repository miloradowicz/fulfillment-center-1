import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '@/utils/axiosAPI.ts'
import {
  GlobalError,
  Task,
  TaskMutation,
  TaskWithPopulate, ValidationError,
} from '@/types'
import { isAxiosError } from 'axios'

export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetchTasks',
  async () => {
    const response = await axiosAPI.get('/tasks')
    return response.data
  },
)

export const fetchArchivedTasks = createAsyncThunk<TaskWithPopulate[]>(
  'tasks/fetchArchivedTasks',
  async () => {
    const response = await axiosAPI.get('/tasks/archived/all?populate=1')
    return response.data
  },
)

export const fetchTasksWithPopulate = createAsyncThunk<TaskWithPopulate[]>(
  'tasks/fetchTasksWithPopulate',
  async () => {
    const response = await axiosAPI.get('/tasks?populate=1')
    return response.data
  },
)

export const fetchTasksByUserId = createAsyncThunk<Task[], string>(
  'arrivals/fetchTasksByUserId',
  async (userId: string) => {
    const response = await axiosAPI.get(`/tasks?user=${ userId }`)
    return response.data
  },
)
export const fetchTasksByUserIdWithPopulate = createAsyncThunk<TaskWithPopulate[], string>(
  'arrivals/fetchTasksByUserIdWithPopulate',
  async (userId: string) => {
    const response = await axiosAPI.get(`/tasks?user=${ userId }&populate=1`)
    return response.data
  },
)

export const fetchTaskById = createAsyncThunk<Task, string>(
  'tasks/fetchTaskById',
  async (taskId: string) => {
    const response = await axiosAPI.get(`/tasks/?=${ taskId }`)
    return response.data
  },
)

export const addTask= createAsyncThunk<void, TaskMutation, { rejectValue: ValidationError}
>('tasks/addTask', async (data: TaskMutation, { rejectWithValue }) => {
  try {
    await axiosAPI.post('/tasks', data)
  } catch (error) {
    if (isAxiosError(error) && error.response && error.response.status === 400) {
      return rejectWithValue(error.response.data as ValidationError)
    }
    throw error
  }
})

export const deleteTask = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.delete(`/tasks/${ taskId }`)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const archiveTask = createAsyncThunk<{ id: string }, string>(
  'tasks/archiveTask',
  async taskId => {
    const response = await axiosAPI.patch(`/tasks/${ taskId }/archive`)
    return response.data
  },
)

export const unarchiveTask = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'tasks/unarchiveTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/tasks/${ taskId }/unarchive`)
      return { id: taskId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)


export const updateTask = createAsyncThunk<
  void,
  { taskId: string; data: TaskMutation },
  { rejectValue: GlobalError }
>('tasks/updateTask', async ({ taskId, data }, { rejectWithValue }) => {
  try {
    await axiosAPI.put(`/tasks/${ taskId }`, data)
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const updateTaskStatus = createAsyncThunk<void, { taskId: string; data: TaskMutation }, { rejectValue: GlobalError }>(
  'tasks/updateTaskStatus',
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/tasks/${ taskId }/status`, data)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)
