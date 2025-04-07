import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '../../utils/axiosAPI.ts'
import { isAxiosError } from 'axios'
import { Counterparty, CounterpartyMutation, GlobalError, ValidationError } from '../../types'

export const fetchAllCounterparties = createAsyncThunk<Counterparty[], void, { rejectValue: GlobalError }>(
  'counterparties/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.get('/counterparties')
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const fetchAllArchivedCounterparties = createAsyncThunk<Counterparty[], void, { rejectValue: GlobalError }>(
  'counterparty/fetchArchivedCounterparties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.get('/counterparties/archived/all')
      return response.data
    } catch (e) {
      if (isAxiosError(e)) {
        return rejectWithValue({
          message: e.response?.data?.message || e.message || 'Ошибка сети',
        })
      }
      return rejectWithValue({ message: 'Неизвестная ошибка' })
    }
  },
)

export const fetchCounterpartyById = createAsyncThunk<
  Counterparty,
  string,
  { rejectValue: GlobalError }
>(
  'counterparties/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.get(`/counterparties/${ id }`)
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const createCounterparty = createAsyncThunk<Counterparty, CounterpartyMutation, { rejectValue: ValidationError }>(
  'counterparties/create',
  async (data: CounterpartyMutation, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/counterparties', data)
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  },
)

export const updateCounterparty = createAsyncThunk<Counterparty, { id: string; data: CounterpartyMutation }, { rejectValue: ValidationError }>(
  'counterparties/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.put(`/counterparties/${ id }`, data)
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  },
)

export const archiveCounterparty = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'counterparties/archive',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/counterparties/${ id }/archive`)
      return { id }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const unarchiveCounterparty = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'counterparties/unarchiveCounterparty',
  async (counterpartyId, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/counterparties/${ counterpartyId }/unarchive`)
      return { id: counterpartyId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const deleteCounterparty = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'counterparties/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosAPI.delete(`/counterparties/${ id }`)
      return { id }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)
