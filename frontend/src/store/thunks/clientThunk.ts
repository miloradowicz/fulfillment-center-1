import { createAsyncThunk } from '@reduxjs/toolkit'
import { Client, ClientMutation, GlobalError, ValidationError } from '../../types'
import axiosAPI from '../../utils/axiosAPI.ts'
import { isAxiosError } from 'axios'

export const fetchClients = createAsyncThunk<Client[]>(
  'clients/fetchClients',
  async () => {
    const response = await axiosAPI.get('/clients')
    return response.data
  },
)

export const fetchClientById = createAsyncThunk<Client, string>(
  'clients/fetchClient',
  async (clientId: string) => {
    const response = await axiosAPI.get(`/clients/${ clientId }`)
    return response.data
  },
)

export const addClient = createAsyncThunk<void, ClientMutation, { rejectValue: ValidationError | GlobalError }>(
  'clients/addClient',
  async (data: ClientMutation, { rejectWithValue }) => {
    try {
      await axiosAPI.post('/clients', data)
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError)
      } else if (isAxiosError(e) && e.response && 'message' in e.response.data) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const archiveClient = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'clients/archiveClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/clients/${ clientId }/archive`)
      return { id: clientId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const deleteClient = createAsyncThunk<void, string, { rejectValue: GlobalError }
>('clients/deleteClient', async (clientId: string, { rejectWithValue }) => {
  try {
    await axiosAPI.delete(`/clients/${ clientId }`)
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const updateClient = createAsyncThunk<void, { clientId: string; data: ClientMutation }, { rejectValue: GlobalError }>(
  'clients/updateClient',
  async ({ clientId, data }, { rejectWithValue }) => {
    try {
      await axiosAPI.put(`/clients/${ clientId }`, data)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)





