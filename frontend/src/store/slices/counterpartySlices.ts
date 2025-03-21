import { createSlice } from '@reduxjs/toolkit'
import { Counterparty, GlobalError } from '../../types'
import {
  fetchCounterparties,
  fetchAllCounterparties,
  fetchCounterpartyById,
  fetchCounterpartyByIdWithArchived,
  createCounterparty,
  updateCounterparty,
  archiveCounterparty,
  deleteCounterparty,
} from '../thunks/counterpartyThunk.ts'
import { RootState } from '../../app/store.ts'

interface CounterpartiesState {
  counterparties: Counterparty[];
  counterparty: Counterparty | null;
  loadingFetch: boolean;
  loadingAdd: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  loadingArchive: boolean;
  error: GlobalError | null;
}

const initialState: CounterpartiesState = {
  counterparties: [],
  counterparty: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  loadingArchive: false,
  error: null,
}

export const selectCounterparty = (state: RootState) => state.counterparties.counterparty
export const selectAllCounterparties = (state: RootState) => state.counterparties.counterparties
export const selectLoadingFetchCounterparty = (state: RootState) => state.counterparties.loadingFetch
export const selectLoadingAddCounterparty = (state: RootState) => state.counterparties.loadingAdd
export const selectLoadingDeleteCounterparty = (state: RootState) => state.counterparties.loadingDelete
export const selectLoadingUpdateCounterparty = (state: RootState) => state.counterparties.loadingUpdate
export const selectCounterpartyError = (state: RootState) => state.counterparties.error

const counterpartiesSlice = createSlice({
  name: 'counterparties',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCounterparties.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchCounterparties.fulfilled, (state, action) => {
        state.loadingFetch = false
        state.counterparties = action.payload
      })
      .addCase(fetchCounterparties.rejected, (state, action) => {
        state.loadingFetch = false
        state.error = action.error.message ? { message: action.error.message } : null
      })

      .addCase(fetchAllCounterparties.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchAllCounterparties.fulfilled, (state, action) => {
        state.loadingFetch = false
        state.counterparties = action.payload
      })
      .addCase(fetchAllCounterparties.rejected, (state, action) => {
        state.loadingFetch = false
        state.error = action.error.message ? { message: action.error.message } : null
      })

      .addCase(fetchCounterpartyById.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchCounterpartyById.fulfilled, (state, action) => {
        state.loadingFetch = false
        state.counterparty = action.payload
      })
      .addCase(fetchCounterpartyById.rejected, (state, action) => {
        state.loadingFetch = false
        state.error = action.error.message ? { message: action.error.message } : { message: 'Ошибка загрузки контрагента' }
      })

      .addCase(fetchCounterpartyByIdWithArchived.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchCounterpartyByIdWithArchived.fulfilled, (state, action) => {
        state.loadingFetch = false
        state.counterparty = action.payload
      })
      .addCase(fetchCounterpartyByIdWithArchived.rejected, (state, action) => {
        state.loadingFetch = false
        state.error = action.error.message ? { message: action.error.message } : null
      })

      .addCase(createCounterparty.pending, state => {
        state.loadingAdd = true
        state.error = null
      })
      .addCase(createCounterparty.fulfilled, (state, action) => {
        state.loadingAdd = false
        state.counterparties.push(action.payload)
      })
      .addCase(createCounterparty.rejected, (state, action) => {
        state.loadingAdd = false
        state.error = action.error.message ? { message: action.error.message } : null
      })

      .addCase(updateCounterparty.pending, state => {
        state.loadingUpdate = true
        state.error = null
      })
      .addCase(updateCounterparty.fulfilled, (state, action) => {
        state.loadingUpdate = false
        const index = state.counterparties.findIndex(counterparty => counterparty._id === action.payload._id)
        if (index !== -1) {
          state.counterparties[index] = action.payload
        }
      })
      .addCase(updateCounterparty.rejected, (state, action) => {
        state.loadingUpdate = false
        state.error = action.error.message ? { message: action.error.message } : null
      })

      .addCase(archiveCounterparty.pending, state => {
        state.loadingArchive = true
        state.error = null
      })
      .addCase(archiveCounterparty.fulfilled, state => {
        state.loadingArchive = false
      })
      .addCase(archiveCounterparty.rejected, (state, action) => {
        state.loadingArchive = false
        state.error = action.error.message ? { message: action.error.message } : null
      })

      .addCase(deleteCounterparty.pending, state => {
        state.loadingDelete = true
        state.error = null
      })
      .addCase(deleteCounterparty.fulfilled, (state, action) => {
        state.loadingDelete = false
        state.counterparties = state.counterparties.filter(counterparty => counterparty._id !== action.meta.arg)
      })
      .addCase(deleteCounterparty.rejected, (state, action) => {
        state.loadingDelete = false
        state.error = action.error.message ? { message: action.error.message } : null
      })
  },
})

export const counterpartyReducer = counterpartiesSlice.reducer
