import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '../../utils/axiosAPI'
import { isAxiosError } from 'axios'
import {
  GlobalError,
  LoginMutation,
  User,
  UserMutation,
  UserRegistrationMutation,
  UserStripped,
  ValidationError,
} from '../../types'
import { RootState } from '../../app/store.ts'

export const registerUser = createAsyncThunk<
  User,
  UserRegistrationMutation,
  { rejectValue: ValidationError }
>(
  'users/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/users/register', data)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data as ValidationError)
      }
      throw error
    }
  },
)

export const loginUser = createAsyncThunk<User, LoginMutation, { rejectValue: ValidationError }>(
  'users/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/users/sessions', data)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as ValidationError)
      }
      throw error
    }
  },
)

export const fetchUsers = createAsyncThunk< UserStripped[]>(
  'users/fetchUsers',
  async () => {
    const response = await axiosAPI.get('/users')
    return response.data
  },
)

export const fetchUserById = createAsyncThunk<User, string>(
  'users/fetchUserById',
  async (userId: string) => {
    const response = await axiosAPI.get(`/users/${ userId }`)
    return response.data
  },
)

export const updateUser = createAsyncThunk<
  void,
  { userId: string; data: UserMutation },
  { rejectValue: GlobalError }
>(
  'users/updateUser',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      await axiosAPI.put(`/users/${ userId }`, data)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const archiveUser = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'users/archiveUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/users/${ userId }/archive`)
      return { id: userId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const deleteUser = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosAPI.delete(`/users/${ userId }`)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const logoutUser = createAsyncThunk<void, void, { state: RootState; rejectValue: GlobalError }>(
  'users/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.user?.token

      if (token) {
        await axiosAPI.delete('/users/sessions', {
          headers: {
            Authorization: `Bearer ${ token }`,
          },
        })
      } else {
        await axiosAPI.delete('/users/sessions')
      }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)


