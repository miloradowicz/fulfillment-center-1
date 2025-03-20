import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '../../utils/axiosAPI.ts'
import {
  GlobalError,
  Task,
  TaskMutation,
  TaskWithPopulate, ValidationError,
} from '../../types'
import { isAxiosError } from 'axios'

export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetchTasks',
  async () => {
    const response = await axiosAPI.get('/tasks')
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

export const archiveTask = createAsyncThunk<void, string>(
  'tasks/archiveTask',
  async taskId => {
    return await axiosAPI.patch(`/tasks/${ taskId }/archive`)
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
