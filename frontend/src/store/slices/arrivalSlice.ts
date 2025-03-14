import { Arrival, ArrivalWithPopulate, GlobalError, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import { addArrival, deleteArrival, fetchArrivalById, fetchArrivalByIdWithPopulate, fetchArrivals, updateArrival } from '../thunks/arrivalThunk.ts'

interface ArrivalState {
  arrival: Arrival | null
  arrivalWithPopulate: ArrivalWithPopulate | null
import { Arrival, ArrivalWithClient, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import {
  addArrival,
  deleteArrival,
  fetchArrivalById,
  fetchArrivals,
  fetchArrivalsByClientId,
  fetchPopulatedArrivals,
  updateArrival,
} from '../thunks/arrivalThunk.ts'

interface ArrivalState {
  arrival: Arrival | null
  arrivalsPopulate: ArrivalWithClient[] | null
  arrivals: Arrival[] | null
  loadingFetch: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  error: boolean
  createError: ValidationError | null
}

const initialState: ArrivalState = {
  arrival: null,
  arrivalWithPopulate: null,
  arrivalsPopulate: null,
  arrivals: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: false,
  createError: null,
}

export const selectArrival = (state: RootState) => state.arrivals.arrival
export const selectArrivalWithPopulate = (state: RootState) => state.arrivals.arrivalWithPopulate
export const selectAllArrival = (state: RootState) => state.arrivals.arrivals
export const selectAllArrivals = (state: RootState) => state.arrivals.arrivals
export const selectPopulatedArrivals = (state: RootState) => state.arrivals.arrivalsPopulate
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
        state.error = false
      })
      .addCase(fetchArrivals.fulfilled, (state, { payload: arrivals }) => {
        state.loadingFetch = false
        state.arrivals = arrivals
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
      .addCase(fetchArrivalById.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchArrivalById.fulfilled, (state, { payload: arrival }) => {
        state.loadingFetch = false
        state.arrival = arrival
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

      .addCase(fetchArrivalsByClientId.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchArrivalsByClientId.fulfilled, (state, { payload: arrivals }) => {
        state.loadingFetch = false
        state.arrivals = arrivals
      })
      .addCase(fetchArrivalsByClientId.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })

      .addCase(fetchPopulatedArrivals.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchPopulatedArrivals.fulfilled, (state, { payload: arrivalsPopulate }) => {
        state.loadingFetch = false
        state.arrivalsPopulate = arrivalsPopulate
      })
      .addCase(fetchPopulatedArrivals.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })

      .addCase(addArrival.pending, state => {
        state.loadingAdd = true
        state.createError = null
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

      .addCase(deleteArrival.pending, state => {
        state.loadingDelete = true
        state.error = false
      })
      .addCase(deleteArrival.fulfilled, state => {
        state.loadingDelete = false
        state.error = false
      })
      .addCase(deleteArrival.rejected, state => {
        state.loadingDelete = false
        state.error = true
      })

      .addCase(updateArrival.pending, state => {
        state.loadingUpdate = true
        state.error = false
      })
      .addCase(updateArrival.fulfilled, state => {
        state.loadingUpdate = false
        state.error = false
      })
      .addCase(updateArrival.rejected, state => {
        state.loadingUpdate = false
        state.error = true
      })
  },
})

export const arrivalReducer = arrivalSlice.reducer
