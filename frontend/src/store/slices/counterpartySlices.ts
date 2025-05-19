import { createSlice } from '@reduxjs/toolkit'
import {
  fetchAllCounterparties,
  fetchCounterpartyById,
  createCounterparty,
  updateCounterparty,
  archiveCounterparty,
  deleteCounterparty, fetchAllArchivedCounterparties, unarchiveCounterparty,
} from '../thunks/counterpartyThunk'
import { Counterparty, GlobalError, ValidationError } from '@/types'
import { RootState } from '@/app/store'

interface CounterpartyState {
  counterparties: Counterparty[] | null
  archivedCounterparties: Counterparty[] | null
  counterparty: Counterparty | null
  loadingFetch: boolean
  loadingFetchArchive: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  loadingArchive: boolean
  loadingUnarchive: boolean
  error: GlobalError | null
  createError: ValidationError | null
  updateError: ValidationError | null
}

const initialState: CounterpartyState = {
  counterparties: null,
  archivedCounterparties: null,
  counterparty: null,
  loadingFetch: false,
  loadingFetchArchive: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  loadingArchive: false,
  loadingUnarchive: false,
  error: null,
  createError: null,
  updateError: null,
}

export const selectAllCounterparties = (state: RootState) => state.counterparties.counterparties
export const selectAllArchivedCounterparties = (state: RootState) => state.counterparties.archivedCounterparties
export const selectOneCounterparty = (state: RootState) => state.counterparties.counterparty
export const selectCounterpartyError = (state: RootState) => state.counterparties.error
export const selectCounterpartyCreateError = (state: RootState) => state.counterparties.createError
export const selectCounterpartyUpdateError = (state: RootState) => state.counterparties.updateError

export const selectLoadingFetch = (state: RootState) => state.counterparties.loadingFetch
export const selectLoadingFetchArchive = (state: RootState) => state.counterparties.loadingFetchArchive
export const selectLoadingAdd = (state: RootState) => state.counterparties.loadingAdd
export const selectLoadingDelete = (state: RootState) => state.counterparties.loadingDelete
export const selectLoadingUpdate = (state: RootState) => state.counterparties.loadingUpdate
export const selectLoadingArchive = (state: RootState) => state.counterparties.loadingArchive

const counterpartiesSlice = createSlice({
  name: 'counterparties',
  initialState,
  reducers: {
    clearErrors: state => {
      state.createError = null
      state.updateError = null
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCounterparties.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchAllCounterparties.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.counterparties = payload
      })
      .addCase(fetchAllCounterparties.rejected, (state, { payload: error }) => {
        state.loadingFetch = false
        state.error = error || null
      })

      .addCase(fetchAllArchivedCounterparties.pending, state => {
        state.loadingFetchArchive = true
        state.error = null
      })
      .addCase(fetchAllArchivedCounterparties.fulfilled, (state, action) => {
        state.loadingFetchArchive = false
        state.archivedCounterparties = action.payload
      })
      .addCase(fetchAllArchivedCounterparties.rejected, (state, { payload: error }) => {
        state.loadingFetchArchive = false
        state.error = error || { message: 'Ошибка при загрузке' }
      })

      .addCase(fetchCounterpartyById.pending, state => {
        state.loadingFetch = true
        state.error = null
      })
      .addCase(fetchCounterpartyById.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.counterparty = payload
      })
      .addCase(fetchCounterpartyById.rejected, (state, { payload: error }) => {
        state.loadingFetch = false
        state.error = error || null
      })

      .addCase(createCounterparty.pending, state => {
        state.loadingAdd = true
        state.createError = null
      })
      .addCase(createCounterparty.fulfilled, state => {
        state.loadingAdd = false
        state.createError = null
      })
      .addCase(createCounterparty.rejected, (state, { payload: error }) => {
        state.loadingAdd = false
        state.createError = error || null
      })

      .addCase(updateCounterparty.pending, state => {
        state.loadingUpdate = true
        state.updateError = null
      })
      .addCase(updateCounterparty.fulfilled, state => {
        state.loadingUpdate = false
        state.updateError = null
      })
      .addCase(updateCounterparty.rejected, (state, { payload: error }) => {
        state.loadingUpdate = false
        state.updateError = error || null
      })

      .addCase(archiveCounterparty.pending, state => {
        state.loadingArchive = true
        state.error = null
      })
      .addCase(archiveCounterparty.fulfilled, state => {
        state.loadingArchive = false
        state.error = null
      })
      .addCase(archiveCounterparty.rejected, (state, { payload: error }) => {
        state.loadingArchive = false
        state.error = error || null
      })

      .addCase(unarchiveCounterparty.pending, state => {
        state.loadingUnarchive = true
        state.error = null
      })
      .addCase(unarchiveCounterparty.fulfilled, (state, action) => {
        state.loadingUnarchive = false
        state.error = null

        if (state.archivedCounterparties) {
          state.archivedCounterparties = state.archivedCounterparties.filter(counterparty => counterparty._id !== action.payload.id)
        }
      })
      .addCase(unarchiveCounterparty.rejected, (state, { payload: error }) => {
        state.loadingUnarchive = false
        state.error = error || null
      })

      .addCase(deleteCounterparty.pending, state => {
        state.loadingDelete = true
        state.error = null
      })
      .addCase(deleteCounterparty.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(deleteCounterparty.rejected, (state, { payload: error }) => {
        state.loadingDelete = false
        state.error = error || null
      })
  },
})

export const { clearErrors } = counterpartiesSlice.actions
export const counterpartyReducer = counterpartiesSlice.reducer
