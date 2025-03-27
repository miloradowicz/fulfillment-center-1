import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { GlobalError, PopulatedService, ServiceMutation } from '../../types'
import axiosAPI from '../../utils/axiosAPI.ts'

export const fetchServices = createAsyncThunk<PopulatedService[], void, { rejectValue: GlobalError }>(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.get('/services')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const fetchServiceById = createAsyncThunk<PopulatedService, string, { rejectValue: GlobalError }>(
  'services/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.get(`/services/${id}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const createService = createAsyncThunk<PopulatedService, ServiceMutation, { rejectValue: GlobalError }>(
  'services/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/services', data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const updateService = createAsyncThunk<PopulatedService, { id: string; data: ServiceMutation }, { rejectValue: GlobalError }>(
  'services/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.put(`/services/${id}`, data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const archiveService = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'services/archive',
  async (id, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/services/${id}/archive`)
      return { id }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const deleteService = createAsyncThunk<{ message: string }, string, { rejectValue: GlobalError }>(
  'services/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.delete(`/services/${id}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)
