import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '../../utils/axiosAPI.ts'
import {
  Arrival,
  ArrivalMutation,
  ArrivalWithClient,
  ArrivalWithPopulate,
  GlobalError,
  ValidationError,
} from '../../types'
import { isAxiosError } from 'axios'

export const fetchArrivals = createAsyncThunk<Arrival[]>('arrivals/fetchArrivals', async () => {
  const response = await axiosAPI.get('/arrivals')
  return response.data
})

export const fetchArrivalById = createAsyncThunk<Arrival, string>(
  'arrivals/fetchArrivalById',
  async (arrivalId: string) => {
    const response = await axiosAPI.get(`/arrivals/?=${ arrivalId }`)
    return response.data
  },
)

export const fetchArrivalByIdWithPopulate = createAsyncThunk<ArrivalWithPopulate, string>(
  'arrivals/fetchArrivalByIdWithPopulate',
  async (arrivalId: string) => {
    const response = await axiosAPI.get(`/arrivals/${ arrivalId }`, { params: { populate: '1' } })
    return response.data
  },
)

export const fetchArrivalsByClientId = createAsyncThunk<Arrival[], string>(
  'arrivals/fetchArrivalsByClientId',
  async (clientId: string) => {
    const response = await axiosAPI.get(`/arrivals?client=${ clientId }`)
    return response.data
  },
)

export const fetchPopulatedArrivals = createAsyncThunk<ArrivalWithClient[]>(
  'arrivals/fetchArrivalsWithPopulate',
  async () => {
    const response = await axiosAPI.get('/arrivals?populate=1')
    return response.data
  },
)

export const addArrival = createAsyncThunk<Arrival, ArrivalMutation | FormData, { rejectValue: ValidationError }>(
  'arrivals/addArrival',
  async (arrivalData, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/arrivals', arrivalData, {
        headers: arrivalData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
      })
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data as ValidationError)
      }
      throw error
    }
  },
)


export const archiveArrival = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'arrivals/archiveArrival',
  async (arrivalId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/arrivals/${ arrivalId }/archive`)
      return { id: arrivalId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const deleteArrival = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'arrivals/deleteArrival',
  async (arrivalId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.delete(`/arrivals/${ arrivalId }`)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const updateArrival = createAsyncThunk<
  void,
  { arrivalId: string; data: FormData },
  {  rejectValue: ValidationError  }
>('arrivals/updateArrival',
  async ({ arrivalId, data }, { rejectWithValue }) => {
    try {
      await axiosAPI.put(`/arrivals/${ arrivalId }`, data)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  })
