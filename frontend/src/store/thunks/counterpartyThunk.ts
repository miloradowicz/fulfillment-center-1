import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '../../utils/axiosAPI.ts'
import { isAxiosError } from 'axios'
import { Counterparty, GlobalError } from '../../types'

export const fetchCounterparties = createAsyncThunk<Counterparty[]>(
  'counterparties/fetchAll',
  async () => {
    const response = await axiosAPI.get('/counterparties')
    return response.data
  },
)

export const fetchAllCounterparties = createAsyncThunk('counterparties/fetchAllWithArchived', async () => {
  const response = await axiosAPI.get('/counterparties/all')
  return response.data
})

export const fetchCounterpartyById = createAsyncThunk('counterparties/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.get(`/counterparties/${ id }`)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const fetchCounterpartyByIdWithArchived = createAsyncThunk('counterparties/fetchByIdWithArchived', async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.get(`/counterparties/all/${ id }`)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const createCounterparty = createAsyncThunk('counterparties/create', async (data: { name: string; phone_number?: string; address?: string }, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.post('/counterparties', data)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const updateCounterparty = createAsyncThunk('counterparties/update', async ({ id, data }: { id: string; data: { name?: string; phone_number?: string; address?: string } }, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.put(`/counterparties/${ id }`, data)
    return response.data
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const archiveCounterparty = createAsyncThunk('counterparties/archive', async (id: string, { rejectWithValue }) => {
  try {
    await axiosAPI.patch(`/counterparties/${ id }/archive`)
    return { id }
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e  }
})

export const deleteCounterparty = createAsyncThunk('counterparties/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosAPI.delete(`/counterparties/${ id }`)
    return { id }
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})
