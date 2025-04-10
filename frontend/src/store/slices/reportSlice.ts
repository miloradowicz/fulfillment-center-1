import { ReportTaskResponse } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store.ts'
import { fetchTaskReport } from '../thunks/reportThunk.ts'

interface ReportState {
  taskReport: ReportTaskResponse | null;
  loadingFetch : boolean;
}

const initialState: ReportState = {
  taskReport: null,
  loadingFetch: false,
}

export const selectTaskReport = (state: RootState) => state.reports.taskReport
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
  },
})

export const reportReducer = reportSlice.reducer
