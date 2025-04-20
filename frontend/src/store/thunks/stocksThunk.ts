import { createAsyncThunk } from '@reduxjs/toolkit'
import { GlobalError, Stock, StockMutation, StockPopulate, ValidationError } from '@/types'
import axiosAPI from '@/utils/axiosAPI.ts'
import { isAxiosError } from 'axios'

export const fetchStocks = createAsyncThunk<Stock[], void>('stocks/fetchStocks', async () => {
  const response = await axiosAPI.get<Stock[]>('/stocks')
  return response.data
})

export const fetchArchivedStocks = createAsyncThunk<Stock[]>(
  'stocks/fetchArchivedCStocks',
  async () => {
    const response = await axiosAPI.get('/stocks/archived/all')
    return response.data
  },
)

export const fetchStockById = createAsyncThunk<StockPopulate, string>('stocks/fetchStockById', async stockId => {
  const response = await axiosAPI.get<StockPopulate>(`/stocks/${ stockId }`)
  return response.data
})

export const addStock = createAsyncThunk<void, StockMutation, { rejectValue: ValidationError }>(
  'stocks/addStock',
  async (stock: StockMutation, { rejectWithValue }) => {
    try {
      await axiosAPI.post<StockMutation>('/stocks', stock)
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data as ValidationError)
      }
      throw error
    }
  },
)

export const archiveStock = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'stocks/archiveStock',
  async (stockId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/stocks/${ stockId }/archive`)
      return { id: stockId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const unarchiveStock = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'stocks/unarchiveStock',
  async (stockId, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/stocks/${ stockId }/unarchive`)
      return { id: stockId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const deleteStock = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'stocks/deleteStock',
  async (stockId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.delete(`/stocks/${ stockId }`)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const updateStock = createAsyncThunk<
  void,
  { stockId: string; stock: StockMutation },
  { rejectValue: ValidationError }
>('stocks/updateStock', async ({ stockId, stock }, { rejectWithValue }) => {
  try {
    await axiosAPI.put(`/stocks/${ stockId }`, stock)
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 400) {
      return rejectWithValue(e.response.data as ValidationError)
    }
    throw e
  }
})
