import { GlobalError, Stock, ValidationError } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import {
  addStock,
  archiveStock,
  deleteStock,
  fetchArchivedStocks,
  fetchStockById,
  fetchStocks,
  updateStock,
} from '../thunks/stocksThunk.ts'
import { RootState } from '@/app/store.ts'

interface StockState {
  stocks: Stock[] | null
  archivedStocks: Stock[] | null
  stock: Stock | null
  archivedStock: Stock | null
  loadingFetch: boolean
  loadingFetchArchive: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean
  loadingArchive: boolean
  error: GlobalError | null
  createAndUpdateError: ValidationError | null
  deletionError: GlobalError | null
}

const initialState: StockState = {
  stocks: null,
  archivedStocks: null,
  stock: null,
  archivedStock: null,
  loadingFetch: false,
  loadingFetchArchive: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingArchive: false,
  error: null,
  createAndUpdateError: null,
  deletionError: null,
}

export const selectAllStocks = (state: RootState) => state.stocks.stocks
export const selectAllArchivedStocks = (state: RootState) => state.stocks.archivedStocks
export const selectOneStock = (state: RootState) => state.stocks.stock
export const selectOneArchivedStock = (state: RootState) => state.stocks.archivedStock
export const selectIsStocksLoading = (state: RootState) => state.stocks.loadingFetch
export const selectLoadingFetchArchivedStocks = (state: RootState) => state.stocks.loadingFetchArchive
export const selectIsStockArchiving = (state: RootState) => state.stocks.loadingArchive
export const selectIsStockCreating = (state: RootState) => state.stocks.loadingCreate
export const selectStockCreateError = (state: RootState) => state.stocks.createAndUpdateError
export const selectStockError = (state: RootState) => state.stocks.error

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    clearStockError: state => {
      state.createAndUpdateError = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStocks.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchStocks.fulfilled, (state, { payload: stocks }) => {
        state.loadingFetch = false
        state.stocks = stocks
      })
      .addCase(fetchStocks.rejected, state => {
        state.loadingFetch = false
      })

      .addCase(fetchArchivedStocks.pending, state => {
        state.loadingFetchArchive = true
        state.error = null
      })
      .addCase(fetchArchivedStocks.fulfilled, (state, action) => {
        state.loadingFetchArchive = false
        state.archivedStocks = action.payload
      })
      .addCase(fetchArchivedStocks.rejected, (state, action) => {
        state.loadingFetchArchive = false
        state.error = action.payload as GlobalError || { message: 'Ошибка загрузки архивных складов' }
      })

      .addCase(fetchStockById.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchStockById.fulfilled, (state, { payload: stock }) => {
        state.loadingFetch = false
        state.stock = stock
      })
      .addCase(fetchStockById.rejected, state => {
        state.loadingFetch = false
      })

      .addCase(addStock.pending, state => {
        state.loadingCreate = true
        state.createAndUpdateError = null
      })
      .addCase(addStock.fulfilled, state => {
        state.loadingCreate = false
      })
      .addCase(addStock.rejected, (state, { payload: error }) => {
        state.loadingCreate = false
        state.createAndUpdateError = error || null
      })

      .addCase(archiveStock.pending, state => {
        state.loadingArchive = true
        state.error = null
      })
      .addCase(archiveStock.fulfilled, state => {
        state.loadingArchive = false
      })
      .addCase(archiveStock.rejected, (state, { payload: error }) => {
        state.loadingArchive = false
        state.error = error || null
      })

      .addCase(deleteStock.pending, state => {
        state.loadingDelete = true
        state.error = null
      })
      .addCase(deleteStock.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(deleteStock.rejected, (state, { payload: error }) => {
        state.loadingDelete = false
        state.error = error || null
      })

      .addCase(updateStock.pending, state => {
        state.loadingUpdate = true
        state.createAndUpdateError = null
      })
      .addCase(updateStock.fulfilled, state => {
        state.loadingUpdate = false
      })
      .addCase(updateStock.rejected, (state, { payload: error }) => {
        state.loadingUpdate = false
        state.createAndUpdateError = error || null
      })
  },
})

export const { clearStockError } = stocksSlice.actions
export const stockReducer = stocksSlice.reducer
