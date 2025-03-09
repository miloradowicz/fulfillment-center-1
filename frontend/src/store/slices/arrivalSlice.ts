import { Arrival, ArrivalWithPopulate, GlobalError, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import { addArrival, deleteArrival, fetchArrivalById, fetchArrivalByIdWithPopulate, fetchArrivals, updateArrival } from '../thunks/arrivalThunk.ts'

interface ArrivalState {
  arrival: Arrival | null
  arrivalWithPopulate: ArrivalWithPopulate | null
  arrivals: Arrival[] | null
  loadingFetch: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  error: GlobalError | null
  createError: ValidationError | null
}

const initialState: ArrivalState = {
  arrival: null,
  arrivalWithPopulate: null,
  arrivals: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  createError: null,
}

export const selectArrival = (state: RootState) => state.arrivals.arrival
export const selectArrivalWithPopulate = (state: RootState) => state.arrivals.arrivalWithPopulate
export const selectAllArrival = (state: RootState) => state.arrivals.arrivals
export const selectLoadingFetchArrival = (state: RootState) => state.arrivals.loadingFetch
export const selectLoadingAddArrival = (state: RootState) => state.arrivals.loadingAdd
export const selectLoadingDeleteArrival = (state: RootState) => state.arrivals.loadingDelete
export const selectLoadingUpdateArrival = (state: RootState) => state.arrivals.loadingUpdate
export const selectArrivalError = (state: RootState) => state.arrivals.error
export const selectCreateError = (state: RootState) => state.arrivals.createError

const arrivalSlice = createSlice({
  name: 'arrivals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchArrivals.pending, state => {
        state.loadingFetch = true
      })
      .addCase(fetchArrivals.fulfilled, (state, action) => {
        state.loadingFetch = false
        state.arrivals = action.payload
      })
      .addCase(fetchArrivals.rejected, state => {
        state.loadingFetch = false
      })
      .addCase(fetchArrivalById.pending, state => {
        state.loadingFetch = true
      })
      .addCase(fetchArrivalById.fulfilled, (state, action) => {
        state.loadingFetch = false
        state.arrival = action.payload
      })
      .addCase(fetchArrivalById.rejected, state => {
        state.loadingFetch = false
      })
      .addCase(fetchArrivalByIdWithPopulate.pending, state => {
        state.loadingFetch = true
      })
      .addCase(fetchArrivalByIdWithPopulate.fulfilled, (state, action) => {
        state.loadingFetch = false
        state.arrivalWithPopulate = action.payload
      })
      .addCase(fetchArrivalByIdWithPopulate.rejected, state => {
        state.loadingFetch = false
      })
      .addCase(addArrival.pending, state => {
        state.loadingAdd = true
      })
      .addCase(addArrival.fulfilled, state => {
        state.loadingAdd = false
      })
      .addCase(addArrival.rejected, (state, { payload: error }) => {
        state.loadingAdd = false
        state.createError = error || null
      })
      .addCase(deleteArrival.pending, state => {
        state.loadingDelete = true
        state.error = null
      })
      .addCase(deleteArrival.fulfilled, state => {
        state.loadingDelete = false
        state.error = null
      })
      .addCase(deleteArrival.rejected, (state, { payload: error }) => {
        state.loadingDelete = false
        state.error = error || null
      })
      .addCase(updateArrival.pending, state => {
        state.loadingUpdate = true
        state.error = null
      })
      .addCase(updateArrival.fulfilled, state => {
        state.loadingUpdate = false
        state.error = null
      })
      .addCase(updateArrival.rejected, (state, { payload: error }) => {
        state.loadingUpdate = false
        state.error = error || null
      })
  },
})

export const arrivalReducer = arrivalSlice.reducer
