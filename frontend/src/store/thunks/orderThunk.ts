import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '../../utils/axiosAPI.ts'
import { GlobalError, Order, OrderMutation } from '../../types'
import { isAxiosError } from 'axios'

export const fetchOrders = createAsyncThunk<Order[]>(
  'orders/fetchOrders',
  async () => {
    const response = await axiosAPI.get('/orders')
    return response.data
  },
)

export const fetchOrderById = createAsyncThunk<Order, string>(
  'orders/fetchOrderById',
  async (orderId: string) => {
    const response = await axiosAPI.get(`/orders/?=${ orderId }`)
    return response.data
  },
)

export const addOrder = createAsyncThunk<void, OrderMutation, { rejectValue: GlobalError }
>('orders/addOrder', async (data: OrderMutation, { rejectWithValue }) => {
  try {
    await axiosAPI.post('/orders', data)
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
    await axiosAPI.delete(`/orders/?=${ orderId }`)
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const updateOrder = createAsyncThunk<void, { orderId: string; data: OrderMutation }, { rejectValue: GlobalError }>(
  'orders/updateOrder',
  async ({ orderId, data }, { rejectWithValue }) => {
    try {
      await axiosAPI.put(`/orders/${ orderId }`, data)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)
