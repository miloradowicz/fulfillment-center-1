import { Arrival, GlobalError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import { addArrival, deleteArrival, fetchArrivalById, fetchArrivals, updateArrival } from '../thunks/arrivalThunk.ts'

interface ArrivalState {
  arrival: Arrival | null;
  arrivals: Arrival[] | null;
  loadingFetch : boolean;
  loadingAdd: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  error: GlobalError | null;
}

const initialState: ArrivalState = {
  arrival: null,
  arrivals: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
}

export const selectArrival = (state: RootState) => state.arrivals.arrival
export const selectAllArrival = (state: RootState) => state.arrivals.arrivals
export const selectLoadingFetchArrival = (state: RootState) => state.arrivals.loadingFetch
export const selectLoadingAddArrival = (state: RootState) => state.arrivals.loadingAdd
export const selectLoadingDeleteArrival = (state: RootState) => state.arrivals.loadingDelete
export const selectLoadingUpdateArrival = (state: RootState) => state.arrivals.loadingUpdate
export const selectArrivalError = (state: RootState) => state.arrivals.error

const arrivalSlice = createSlice({
  name: 'arrivals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchArrivals.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchArrivals.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.arrivals = action.payload
    })
    builder.addCase(fetchArrivals.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchArrivalById.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchArrivalById.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.arrival = action.payload
    })
    builder.addCase(fetchArrivalById.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(addArrival.pending, state => {
      state.loadingAdd = true
    })
    builder.addCase(addArrival.fulfilled, state => {
      state.loadingAdd = false
    })
    builder.addCase(addArrival.rejected, (state, { payload: error }) => {
      state.loadingAdd = false
      state.error = error || null
    })
    builder.addCase(deleteArrival.pending, state => {
      state.loadingDelete = true
      state.error = null
    })
    builder.addCase(deleteArrival.fulfilled, state => {
      state.loadingDelete = false
      state.error = null
    })
    builder.addCase(deleteArrival.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.error = error || null
    })
    builder.addCase(updateArrival.pending, state => {
      state.loadingUpdate = true
      state.error = null
    })
    builder.addCase(updateArrival.fulfilled, state => {
      state.loadingUpdate = false
      state.error = null
    })
    builder.addCase(updateArrival.rejected, (state, { payload: error }) => {
      state.loadingUpdate = false
      state.error = error || null
    })
  },
})

export const arrivalReducer = arrivalSlice.reducer
