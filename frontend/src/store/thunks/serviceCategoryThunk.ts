import { createAsyncThunk } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { GlobalError, ServiceCategory, ServiceCategoryMutation, ValidationError } from '@/types'
import axiosAPI from '@/utils/axiosAPI.ts'
import { isGlobalError } from '@/utils/helpers.ts'

export const fetchServiceCategories = createAsyncThunk<ServiceCategory[], void, { rejectValue: GlobalError }>(
  'serviceCategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.get('/servicecategories')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const fetchServiceCategoryById = createAsyncThunk<ServiceCategory, string, { rejectValue: GlobalError }>(
  'serviceCategories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.get(`/servicecategories/${ id }`)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const createServiceCategory = createAsyncThunk<
  ServiceCategory,
  ServiceCategoryMutation,
  { rejectValue: ValidationError | GlobalError }
>('serviceCategories/create', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.post('/servicecategories', data)
    return response.data
  } catch (error) {
    if (isAxiosError(error) && error.response && error.status === 400) {
      return rejectWithValue(error.response.data as ValidationError)
    } else if (isAxiosError(error) && error.response && isGlobalError(error.response.data)) {
      return rejectWithValue(error.response.data as GlobalError)
    }
    throw error
  }
})

export const updateServiceCategory = createAsyncThunk<
  ServiceCategory,
  { id: string; data: ServiceCategoryMutation },
  { rejectValue: ValidationError | GlobalError }
>('serviceCategories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.put(`/servicecategories/${ id }`, data)
    return response.data
  } catch (error) {
    if (isAxiosError(error) && error.response && error.status === 400) {
      return rejectWithValue(error.response.data as ValidationError)
    } else if (isAxiosError(error) && error.response && isGlobalError(error.response.data)) {
      return rejectWithValue(error.response.data as GlobalError)
    }
    throw error
  }
})

export const archiveServiceCategory = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'serviceCategories/archive',
  async (id, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/servicecategories/${ id }/archive`)
      return { id }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)

export const deleteServiceCategory = createAsyncThunk<{ message: string }, string, { rejectValue: GlobalError }>(
  'serviceCategories/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.delete(`/servicecategories/${ id }`)
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError)
      }
      throw error
    }
  },
)
