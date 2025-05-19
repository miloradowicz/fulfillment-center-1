import {
  Client,
  GlobalError,
  Order,
  OrderWithClient,
  OrderWithProducts,
  OrderWithProductsAndClients,
  ValidationError,
} from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store.ts'
import {
  addOrder,
  archiveOrder,
  cancelOrder,
  deleteOrder,
  fetchArchivedOrders,
  fetchOrderById,
  fetchOrderByIdWithPopulate,
  fetchOrders,
  fetchOrdersByClientId,
  fetchOrdersWithClient,
  unarchiveOrder,
  updateOrder,
} from '../thunks/orderThunk.ts'

interface OrderState {
  order: OrderWithProducts | null
  archivedOrder: Client[] | null;
  orders: Order[] | null
  archivedOrders: OrderWithClient[] | null
  populateOrder: OrderWithProductsAndClients | null
  ordersWithClient: OrderWithClient[] | null
  loadingFetch: boolean
  loadingFetchArchive: boolean
  loadingFetchPopulate: boolean
  loadingAdd: boolean
  loadingArchive: boolean
  loadingUnarchive: boolean
  loadingCancel: boolean
  loadingUpdate: boolean
  loadingDelete: boolean
  error: GlobalError | null
  createAndUpdateError: ValidationError | null
}

const initialState: OrderState = {
  order: null,
  archivedOrder: null,
  orders: null,
  archivedOrders: null,
  populateOrder: null,
  ordersWithClient: null,
  loadingFetch: false,
  loadingFetchArchive: false,
  loadingFetchPopulate: false,
  loadingAdd: false,
  loadingArchive: false,
  loadingUnarchive: false,
  loadingCancel: false,
  loadingUpdate: false,
  loadingDelete: false,
  error: null,
  createAndUpdateError: null,
}

export const selectOrder = (state: RootState) => state.orders.order
export const selectAllOrders = (state: RootState) => state.orders.orders
export const selectAllArchivedOrders = (state: RootState) => state.orders.archivedOrders
export const selectPopulateOrder = (state: RootState) => state.orders.populateOrder
export const selectAllOrdersWithClient = (state: RootState) => state.orders.ordersWithClient
export const selectLoadingFetchOrder = (state: RootState) => state.orders.loadingFetch
export const selectLoadingFetchArchivedOrders = (state: RootState) => state.orders.loadingFetchArchive
export const selectLoadingFetchOrderPopulate = (state: RootState) => state.orders.loadingFetchPopulate
export const selectLoadingAddOrder = (state: RootState) => state.orders.loadingAdd
export const selectLoadingArchiveOrder = (state: RootState) => state.orders.loadingArchive
export const selectLoadingCancelOrder = (state: RootState) => state.orders.loadingCancel
export const selectLoadingUpdateOrder = (state: RootState) => state.orders.loadingUpdate
export const selectLoadingDeleteOrder = (state: RootState) => state.orders.loadingDelete
export const selectOrderError = (state: RootState) => state.orders.error
export const selectCreateOrderError = (state: RootState) => state.orders.createAndUpdateError

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearPopulateOrder: state => {
      state.populateOrder = null
    },
    clearErrorOrder: state => {
      state.createAndUpdateError = null
    },
    clearArchivedOrders: state => {
      state.archivedOrders = null
    },
    clearAll: state => {
      state.order = null
      state.archivedOrder = null
      state.orders = null
      state.archivedOrders = null
      state.populateOrder = null
      state.ordersWithClient = null
      state.loadingFetch = false
      state.loadingFetchArchive = false
      state.loadingFetchPopulate = false
      state.loadingAdd = false
      state.loadingArchive = false
      state.loadingUnarchive = false
      state.loadingCancel = false
      state.loadingUpdate = false
      state.error = null
      state.createAndUpdateError = null
    },
  },
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
    builder.addCase(fetchArchivedOrders.pending, state => {
      state.loadingFetchArchive = true
      state.error = null
    })
    builder.addCase(fetchArchivedOrders.fulfilled, (state, action) => {
      state.loadingFetchArchive = false
      state.archivedOrders = action.payload
      state.error = null
    })
    builder.addCase(fetchArchivedOrders.rejected, (state, action) => {
      state.loadingFetchArchive = false
      state.error = action.payload as GlobalError
    })
    builder.addCase(fetchOrdersWithClient.pending, state => {
      state.loadingFetch = true
      state.populateOrder = null
    })
    builder.addCase(fetchOrdersWithClient.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.ordersWithClient = action.payload
    })
    builder.addCase(fetchOrdersWithClient.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchOrdersByClientId.pending, state => {
      state.loadingFetch = true
      state.populateOrder = null
    })
    builder.addCase(fetchOrdersByClientId.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.orders = action.payload
    })
    builder.addCase(fetchOrdersByClientId.rejected, state => {
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
    builder.addCase(fetchOrderByIdWithPopulate.pending, state => {
      state.loadingFetchPopulate = true
    })
    builder.addCase(fetchOrderByIdWithPopulate.fulfilled, (state, action) => {
      state.loadingFetchPopulate = false
      state.populateOrder = action.payload
    })
    builder.addCase(fetchOrderByIdWithPopulate.rejected, state => {
      state.loadingFetchPopulate = false
    })
    builder.addCase(addOrder.pending, state => {
      state.loadingAdd = true
      state.createAndUpdateError = null
    })
    builder.addCase(addOrder.fulfilled, state => {
      state.loadingAdd = false
    })
    builder.addCase(addOrder.rejected, (state, { payload: error }) => {
      state.loadingAdd = false
      state.createAndUpdateError = error || null
    })
    builder.addCase(archiveOrder.pending, state => {
      state.loadingArchive = true
      state.error = null
    })
    builder.addCase(archiveOrder.fulfilled, state => {
      state.loadingArchive = false
      state.error = null
    })
    builder.addCase(archiveOrder.rejected, (state, { payload: error }) => {
      state.loadingArchive = false
      state.error = error || null
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
    builder.addCase(unarchiveOrder.pending, state => {
      state.loadingUnarchive = true
      state.error = null
    })
    builder.addCase(unarchiveOrder.fulfilled, (state, action) => {
      state.loadingUnarchive = false
      state.error = null

      if (state.archivedOrders) {
        state.archivedOrders = state.archivedOrders.filter(order => order._id !== action.payload.id)
      }
    })
    builder.addCase(unarchiveOrder.rejected, (state, { payload: error }) => {
      state.loadingUnarchive = false
      state.error = error || null
    })
    builder.addCase(cancelOrder.pending, state => {
      state.loadingCancel = true
      state.error = null
    })
    builder.addCase(cancelOrder.fulfilled, state => {
      state.loadingCancel = false
      state.error = null
    })
    builder.addCase(cancelOrder.rejected, (state, { payload: error }) => {
      state.loadingCancel = false
      state.error = error || null
    })
    builder.addCase(updateOrder.pending, state => {
      state.loadingUpdate = true
      state.createAndUpdateError = null
    })
    builder.addCase(updateOrder.fulfilled, state => {
      state.loadingUpdate = false
      state.createAndUpdateError = null
    })
    builder.addCase(updateOrder.rejected, (state, { payload: error }) => {
      state.loadingUpdate = false
      state.createAndUpdateError = error || null
    })
  },
})

export const orderReducer = orderSlice.reducer
export const { clearPopulateOrder } = orderSlice.actions
export const { clearErrorOrder, clearAll } = orderSlice.actions
