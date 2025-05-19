import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '@/utils/axiosAPI.ts'
import {
  GlobalError,
  Order,
  OrderMutation,
  OrderWithClient,
  OrderWithProducts,
  OrderWithProductsAndClients,
  ValidationError,
} from '@/types'
import { isAxiosError } from 'axios'
import { createArrivalAndOrderFormData } from '@/utils/createArrivalAndOrderFormData.ts'

export const fetchOrders = createAsyncThunk<Order[]>(
  'orders/fetchOrders',
  async () => {
    const response = await axiosAPI.get('/orders')
    return response.data
  },
)

export const fetchOrdersByClientId = createAsyncThunk<Order[], string>(
  'arrivals/fetchOrdersByClientId',
  async (clientId: string) => {
    const response = await axiosAPI.get(`/orders?client=${ clientId }`)
    return response.data
  },
)

export const fetchArchivedOrders = createAsyncThunk<OrderWithClient[]>(
  'orders/fetchArchivedOrders',
  async () => {
    const response = await axiosAPI.get('/orders/archived/all?populate=true')
    return response.data
  },
)

export const fetchOrdersWithClient = createAsyncThunk<OrderWithClient[]>(
  'orders/fetchOrdersWithClient',
  async () => {
    const response = await axiosAPI.get('/orders?populate=1')
    return response.data
  },
)

export const fetchOrderById = createAsyncThunk<OrderWithProducts, string>(
  'orders/fetchOrderById',
  async (orderId: string) => {
    const response = await axiosAPI.get(`/orders/${ orderId }`)
    return response.data
  },
)

export const fetchOrderByIdWithPopulate = createAsyncThunk<OrderWithProductsAndClients , string>(
  'orders/fetchOrderByIdWithPopulate',
  async (orderId: string) => {
    const response = await axiosAPI.get(`/orders/${ orderId }?populate=true`)
    return response.data
  },
)

export const addOrder = createAsyncThunk<Order, OrderMutation & { files?: File[] }, { rejectValue: ValidationError}
>('orders/addOrder', async (data, { rejectWithValue }) => {
  try {
    const formData = createArrivalAndOrderFormData(data, data.files)
    const response = await axiosAPI.post('/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    if (isAxiosError(error) && error.response && error.response.status === 400) {
      return rejectWithValue(error.response.data as ValidationError)
    }
    throw error
  }
})

export const archiveOrder = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'orders/archiveOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/orders/${ orderId }/archive`)
      return { id: orderId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const unarchiveOrder = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'orders/unarchiveOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/orders/${ orderId }/unarchive`)
      return { id: orderId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const cancelOrder = createAsyncThunk<void, string, { rejectValue: GlobalError }
>('orders/cancelOrder', async (orderId: string, { rejectWithValue }) => {
  try {
    await axiosAPI.delete(`/orders/${ orderId }/cancel`)
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const deleteOrder = createAsyncThunk<void, string, { rejectValue: GlobalError }
>('orders/deleteOrder', async (orderId: string, { rejectWithValue }) => {
  try {
    await axiosAPI.delete(`/orders/${ orderId }`)
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const updateOrder = createAsyncThunk<Order, { orderId: string; data: OrderMutation & { files?: File[] } }, { rejectValue: ValidationError }>(
  'orders/updateOrder',
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      const formData = createArrivalAndOrderFormData(data, data.files)
      const response = await axiosAPI.put(`/orders/${ orderId }`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  },
)


