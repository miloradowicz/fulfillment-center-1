import { createSlice } from '@reduxjs/toolkit'
import {
  fetchCounterparties,
  fetchAllCounterparties,
  fetchCounterpartyById,
  fetchCounterpartyByIdWithArchived,
  createCounterparty,
  updateCounterparty,
  archiveCounterparty,
  deleteCounterparty,
} from '../thunks/counterpartyThunk'
import { Counterparty, ValidationError } from '@/types'
import { RootState } from '@/app/store'

interface CounterpartyState {
  counterparties: Counterparty[] | null
  counterparty: Counterparty | null
  loadingFetch: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  loadingArchive: boolean
  error: boolean
  createError: ValidationError | null
  updateError: ValidationError | null
}

const initialState: CounterpartyState = {
  counterparties: null,
  counterparty: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  loadingArchive: false,
  error: false,
  createError: null,
  updateError: null,
}

export const selectAllCounterparties = (state: RootState) => state.counterparties.counterparties
export const selectOneCounterparty = (state: RootState) => state.counterparties.counterparty
export const selectCounterpartyError = (state: RootState) => state.counterparties.error
export const selectCounterpartyCreateError = (state: RootState) => state.counterparties.createError
export const selectCounterpartyUpdateError = (state: RootState) => state.counterparties.updateError

export const selectLoadingFetch = (state: RootState) => state.counterparties.loadingFetch
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
      state.error = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCounterparties.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchCounterparties.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.counterparties = payload
      })
      .addCase(fetchCounterparties.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })

      .addCase(fetchAllCounterparties.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchAllCounterparties.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.counterparties = payload
      })
      .addCase(fetchAllCounterparties.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })

      .addCase(fetchCounterpartyById.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchCounterpartyById.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.counterparty = payload
      })
      .addCase(fetchCounterpartyById.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })

      .addCase(fetchCounterpartyByIdWithArchived.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchCounterpartyByIdWithArchived.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.counterparty = payload
      })
      .addCase(fetchCounterpartyByIdWithArchived.rejected, state => {
        state.loadingFetch = false
        state.error = true
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
        state.error = false
      })
      .addCase(archiveCounterparty.fulfilled, state => {
        state.loadingArchive = false
        state.error = false
      })
      .addCase(archiveCounterparty.rejected, state => {
        state.loadingArchive = false
        state.error = true
      })

      .addCase(deleteCounterparty.pending, state => {
        state.loadingDelete = true
        state.error = false
      })
      .addCase(deleteCounterparty.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(deleteCounterparty.rejected, state => {
        state.loadingDelete = false
        state.error = true
      })
  },
})

export const { clearErrors } = counterpartiesSlice.actions
export const counterpartyReducer = counterpartiesSlice.reducer
