import { ReportClientResponse, ReportTaskResponse } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store.ts'
import { fetchClientReport, fetchTaskReport } from '../thunks/reportThunk.ts'

interface ReportState {
  taskReport: ReportTaskResponse | null;
  clientReport: ReportClientResponse | null;
  loadingFetch : boolean;
}

const initialState: ReportState = {
  taskReport: null,
  clientReport:null,
  loadingFetch: false,
}

export const selectTaskReport = (state: RootState) => state.reports.taskReport
export const selectClientReport = (state: RootState) => state.reports.clientReport
export const selectLoadingFetchReport = (state: RootState) => state.reports.loadingFetch

export const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(fetchTaskReport.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchTaskReport.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.taskReport = action.payload
    })
    builder.addCase(fetchTaskReport.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchClientReport.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchClientReport.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.clientReport = action.payload
    })
    builder.addCase(fetchClientReport.rejected, state => {
      state.loadingFetch = false
    })
  },
})

export const reportReducer = reportSlice.reducer
