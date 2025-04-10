import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '@/utils/axiosAPI.ts'
import { ReportClientResponse, ReportTaskResponse } from '@/types'

export const fetchTaskReport = createAsyncThunk<ReportTaskResponse, { startDate: string, endDate: string }>(
  'reports/fetchTaskReport',
  async ({ startDate, endDate }) => {
    const response = await axiosAPI.get(`/reports?tab=tasks&startDate=${ startDate }&endDate=${ endDate }`)
    return response.data
  },
)

export const fetchClientReport = createAsyncThunk<ReportClientResponse, { startDate: string, endDate: string }>(
  'reports/fetchClientReport',
  async ({ startDate, endDate }) => {
    const response = await axiosAPI.get(`/reports?tab=clients&startDate=${ startDate }&endDate=${ endDate }`)
    return response.data
  },
)
