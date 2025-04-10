import { Stock, ValidationError } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { addStock, archiveStock, deleteStock, fetchStockById, fetchStocks, updateStock } from '../thunks/stocksThunk.ts'
import { RootState } from '@/app/store.ts'

interface StockState {
  stocks: Stock[] | null
  stock: Stock | null
  isFetching: boolean
  isCreating: boolean
  isArchiving: boolean
  error: boolean
  createError: ValidationError | null
}

const initialState: StockState = {
  stocks: null,
  stock: null,
  isFetching: false,
  isCreating: false,
  isArchiving: false,
  error: false,
  createError: null,
}

export const selectAllStocks = (state: RootState) => state.stocks.stocks
export const selectOneStock = (state: RootState) => state.stocks.stock
export const selectIsStocksLoading = (state: RootState) => state.stocks.isFetching
export const selectIsStockArchiving = (state: RootState) => state.stocks.isArchiving
export const selectIsStockCreating = (state: RootState) => state.stocks.isCreating
export const selectStockCreateError = (state: RootState) => state.stocks.createError
export const selectStockError = (state: RootState) => state.stocks.error

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStocks.pending, state => {
        state.isFetching = true
        state.error = false
      })
      .addCase(fetchStocks.fulfilled, (state, { payload: stocks }) => {
        state.isFetching = false
        state.stocks = stocks
      })
      .addCase(fetchStocks.rejected, state => {
        state.isFetching = false
        state.error = true
      })

      .addCase(fetchStockById.pending, state => {
        state.isFetching = true
        state.error = false
      })
      .addCase(fetchStockById.fulfilled, (state, { payload: stock }) => {
        state.isFetching = false
        state.stock = stock
      })
      .addCase(fetchStockById.rejected, state => {
        state.isFetching = false
        state.error = true
      })

      .addCase(addStock.pending, state => {
        state.isCreating = true
        state.createError = null
      })
      .addCase(addStock.fulfilled, state => {
        state.isCreating = false
      })
      .addCase(addStock.rejected, (state, { payload: error }) => {
        state.isCreating = false
        state.createError = error || null
      })

      .addCase(archiveStock.pending, state => {
        state.isArchiving = true
        state.error = false
      })
      .addCase(archiveStock.fulfilled, state => {
        state.isArchiving = false
      })
      .addCase(archiveStock.rejected, state => {
        state.isArchiving = false
        state.error = true
      })

      .addCase(deleteStock.pending, state => {
        state.isFetching = true
        state.error = false
      })
      .addCase(deleteStock.fulfilled, state => {
        state.isFetching = false
      })
      .addCase(deleteStock.rejected, state => {
        state.isFetching = false
        state.error = true
      })

      .addCase(updateStock.pending, state => {
        state.isFetching = true
        state.error = false
      })
      .addCase(updateStock.fulfilled, state => {
        state.isFetching = false
      })
      .addCase(updateStock.rejected, state => {
        state.isFetching = false
        state.error = true
      })
  },
})

export const stockReducer = stocksSlice.reducer
