import { Arrival, ArrivalWithClient, ArrivalWithPopulate, GlobalError, ValidationError } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store.ts'
import {
  addArrival,
  archiveArrival,
  cancelArrival,
  deleteArrival,
  fetchArchivedArrivals,
  fetchArrivalById,
  fetchArrivalByIdWithPopulate,
  fetchArrivals,
  fetchArrivalsByClientId,
  fetchPopulatedArrivals,
  unarchiveArrival,
  updateArrival,
} from '../thunks/arrivalThunk.ts'

interface ArrivalState {
  arrival: Arrival | null;
  arrivalsPopulate: ArrivalWithClient[] | null;
  arrivalWithPopulate: ArrivalWithPopulate | null;
  arrivals: Arrival[] | null;
  archivedArrivals: ArrivalWithClient[] | null;
  loadingFetch: boolean;
  loadingFetchArchive: boolean;
  loadingAdd: boolean;
  loadingArchive: boolean;
  loadingUnarchive: boolean;
  loadingCancel: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  error: GlobalError | boolean;
  createAndUpdateError: ValidationError | null;
}

const initialState: ArrivalState = {
  arrival: null,
  arrivalWithPopulate: null,
  arrivalsPopulate: null,
  arrivals: null,
  archivedArrivals: null,
  loadingFetch: false,
  loadingFetchArchive: false,
  loadingAdd: false,
  loadingArchive: false,
  loadingUnarchive: false,
  loadingCancel: false,
  loadingUpdate: false,
  loadingDelete: false,
  error: false,
  createAndUpdateError: null,
}

export const selectArrival = (state: RootState) => state.arrivals.arrival
export const selectArrivalWithPopulate = (state: RootState) => state.arrivals.arrivalWithPopulate
export const selectAllArrivals = (state: RootState) => state.arrivals.arrivals
export const selectAllArchivedArrivals = (state: RootState) => state.arrivals.archivedArrivals
export const selectPopulatedArrivals = (state: RootState) => state.arrivals.arrivalsPopulate
export const selectLoadingFetchArrival = (state: RootState) => state.arrivals.loadingFetch
export const selectLoadingFetchArchivedArrivals = (state: RootState) => state.arrivals.loadingFetchArchive
export const selectLoadingAddArrival = (state: RootState) => state.arrivals.loadingAdd
export const selectLoadingArchiveArrival = (state: RootState) => state.arrivals.loadingArchive
export const selectLoadingCancelArrival = (state: RootState) => state.arrivals.loadingCancel
export const selectLoadingUpdateArrival = (state: RootState) => state.arrivals.loadingUpdate
export const selectLoadingDeleteArrival = (state: RootState) => state.arrivals.loadingDelete
export const selectArrivalError = (state: RootState) => state.arrivals.error
export const selectCreateError = (state: RootState) => state.arrivals.createAndUpdateError

const arrivalSlice = createSlice({
  name: 'arrivals',
  initialState,
  reducers: {
    clearErrorArrival: state => {
      state.createAndUpdateError = null
    },
    clearAll: state => {
      state.arrival = null
      state.arrivalWithPopulate = null
      state.arrivalsPopulate = null
      state.arrivals = null
      state.archivedArrivals = null
      state.loadingFetch = false
      state.loadingFetchArchive = false
      state.loadingAdd = false
      state.loadingArchive = false
      state.loadingUnarchive = false
      state.loadingCancel = false
      state.loadingUpdate = false
      state.error = false
      state.createAndUpdateError = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArrivals.pending, state => {
        state.loadingFetch = true
      })
      .addCase(fetchArrivals.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.arrivals = payload
        state.error = false
      })
      .addCase(fetchArrivals.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })
      .addCase(fetchArchivedArrivals.pending, state => {
        state.loadingFetchArchive = true
      })
      .addCase(fetchArchivedArrivals.fulfilled, (state, action) => {
        state.loadingFetchArchive = false
        state.archivedArrivals = action.payload
      })
      .addCase(fetchArchivedArrivals.rejected, state => {
        state.loadingFetchArchive = false
      })
      .addCase(fetchArrivalById.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchArrivalById.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.arrival = payload
      })
      .addCase(fetchArrivalById.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })
      .addCase(fetchArrivalByIdWithPopulate.pending, state => {
        state.loadingFetch = true
      })
      .addCase(fetchArrivalByIdWithPopulate.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.arrivalWithPopulate = payload
      })
      .addCase(fetchArrivalByIdWithPopulate.rejected, state => {
        state.loadingFetch = false
      })
      .addCase(fetchArrivalsByClientId.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchArrivalsByClientId.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.arrivals = payload
      })
      .addCase(fetchArrivalsByClientId.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })
      .addCase(fetchPopulatedArrivals.pending, state => {
        state.loadingFetch = true
        state.error = false
      })
      .addCase(fetchPopulatedArrivals.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.arrivalsPopulate = payload
      })
      .addCase(fetchPopulatedArrivals.rejected, state => {
        state.loadingFetch = false
        state.error = true
      })
      .addCase(addArrival.pending, state => {
        state.loadingAdd = true
        state.createAndUpdateError = null
      })
      .addCase(addArrival.fulfilled, state => {
        state.loadingAdd = false
      })
      .addCase(addArrival.rejected, (state, { payload }) => {
        state.loadingAdd = false
        state.createAndUpdateError = payload || null
      })
      .addCase(archiveArrival.pending, state => {
        state.loadingArchive = true
        state.error = false
      })
      .addCase(archiveArrival.fulfilled, state => {
        state.loadingArchive = false
      })
      .addCase(archiveArrival.rejected, state => {
        state.loadingArchive = false
        state.error = true
      })
      .addCase(deleteArrival.pending, state => {
        state.loadingDelete = true
        state.error = false
      })
      .addCase(deleteArrival.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(deleteArrival.rejected, state => {
        state.loadingDelete = false
        state.error = true
      })
      .addCase(unarchiveArrival.pending, state => {
        state.loadingUnarchive = true
        state.error = false
      })
      .addCase(unarchiveArrival.fulfilled, (state, action) => {
        state.loadingUnarchive = false
        state.error = false
        if (state.archivedArrivals) {
          state.archivedArrivals = state.archivedArrivals.filter(arrival => arrival._id !== action.payload.id)
        }
      })
      .addCase(unarchiveArrival.rejected, (state, { payload: error }) => {
        state.loadingUnarchive = false
        state.error = error || false
      })
      .addCase(cancelArrival.pending, state => {
        state.loadingCancel = true
        state.error = false
      })
      .addCase(cancelArrival.fulfilled, state => {
        state.loadingCancel = false
      })
      .addCase(cancelArrival.rejected, state => {
        state.loadingCancel = false
        state.error = true
      })
      .addCase(updateArrival.pending, state => {
        state.loadingUpdate = true
        state.error = false
        state.createAndUpdateError = null
      })
      .addCase(updateArrival.fulfilled, state => {
        state.loadingUpdate = false
      })
      .addCase(updateArrival.rejected, (state, { payload }) => {
        state.loadingUpdate = false
        state.createAndUpdateError = payload || null
      })
  },
})

export const arrivalReducer = arrivalSlice.reducer
export const { clearErrorArrival, clearAll } = arrivalSlice.actions
