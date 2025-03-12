import { GlobalError, Order, OrderWithClient, OrderWithProducts, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import {
  addOrder,
  deleteOrder,
  fetchOrderById,
  fetchOrders,
  fetchOrdersWithClient,
  updateOrder,
} from '../thunks/orderThunk.ts'

interface OrderState {
  order: OrderWithProducts | null
  orders: Order[] | null
  ordersWithClient: OrderWithClient[] | null
  loadingFetch : boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  error: GlobalError | null
  createError: ValidationError | null
}

const initialState: OrderState = {
  order: null,
  orders: null,
  ordersWithClient: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  createError:null,
}

export const selectOrder = (state: RootState) => state.orders.order
export const selectAllOrders = (state: RootState) => state.orders.orders
export const selectAllOrdersWithClient = (state: RootState) => state.orders.ordersWithClient
export const selectLoadingFetchOrder = (state: RootState) => state.orders.loadingFetch
export const selectLoadingAddOrder = (state: RootState) => state.orders.loadingAdd
export const selectLoadingDeleteOrder = (state: RootState) => state.orders.loadingDelete
export const selectLoadingUpdateOrder = (state: RootState) => state.orders.loadingUpdate
export const selectOrderError = (state: RootState) => state.orders.error
export const selectCreateOrderError = (state: RootState) => state.orders.createError

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchOrders.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.orders = action.payload
    })
    builder.addCase(fetchOrders.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchOrdersWithClient.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchOrdersWithClient.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.ordersWithClient = action.payload
    })
    builder.addCase(fetchOrdersWithClient.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchOrderById.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.order = action.payload
    })
    builder.addCase(fetchOrderById.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(addOrder.pending, state => {
      state.loadingAdd = true
      state.createError=null
    })
    builder.addCase(addOrder.fulfilled, state => {
      state.loadingAdd = false
    })
    builder.addCase(addOrder.rejected, (state, { payload: error }) => {
      state.loadingAdd = false
      state.createError = error || null
    })
    builder.addCase(deleteOrder.pending, state => {
      state.loadingDelete = true
      state.error = null
    })
    builder.addCase(deleteOrder.fulfilled, state => {
      state.loadingDelete = false
      state.error = null
    })
    builder.addCase(deleteOrder.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.error = error || null
    })
    builder.addCase(updateOrder.pending, state => {
      state.loadingUpdate = true
      state.error = null
    })
    builder.addCase(updateOrder.fulfilled, state => {
      state.loadingUpdate = false
      state.error = null
    })
    builder.addCase(updateOrder.rejected, (state, { payload: error }) => {
      state.loadingUpdate = false
      state.error = error || null
    })
  },
})

export const orderReducer = orderSlice.reducer
