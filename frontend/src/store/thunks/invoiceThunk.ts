import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '@/utils/axiosAPI.ts'
import {
  GlobalError, Invoice, InvoiceMutation,
  ValidationError,
} from '@/types'
import { isAxiosError } from 'axios'

export const fetchInvoices = createAsyncThunk<Invoice[]>(
  'invoices/fetchInvoices',
  async () => {
    const response = await axiosAPI.get('/invoices')
    return response.data
  },
)

export const fetchArchivedInvoices = createAsyncThunk<Invoice[]>(
  'invoices/fetchArchivedInvoices',
  async () => {
    const response = await axiosAPI.get('/invoices/archived')
    return response.data
  },
)

export const fetchInvoiceById = createAsyncThunk<Invoice, string>(
  'invoices/fetchInvoiceById',
  async (invoiceId: string) => {
    const response = await axiosAPI.get(`/invoices/${ invoiceId }`)
    return response.data
  },
)

export const createInvoices = createAsyncThunk<void, InvoiceMutation, { rejectValue: ValidationError }>(
  'invoices/createInvoices',
  async (data: InvoiceMutation, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/invoices', data)
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  },
)

export const archiveInvoice = createAsyncThunk<{id:string}, string, { rejectValue: GlobalError }>(
  'invoices/archiveInvoice',
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/invoices/${ invoiceId }/archive`)
      return { id: invoiceId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const unarchiveInvoice = createAsyncThunk<{id:string}, string, { rejectValue: GlobalError }>(
  'invoice/ unarchiveInvoice',
  async (invoiceId, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/invoices/${ invoiceId }/unarchive`)
      return { id: invoiceId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const deleteInvoice = createAsyncThunk<void, string, { rejectValue: GlobalError }
>('invoices/deleteInvoice', async (invoiceId: string, { rejectWithValue }) => {
  try {
    await axiosAPI.delete(`/invoices/${ invoiceId }`)
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const updateInvoice = createAsyncThunk<void, { id: string; data: InvoiceMutation }, { rejectValue: ValidationError }>(
  'invoices/updateInvoice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.put(`/invoices/${ id }`, data)
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  },
)



