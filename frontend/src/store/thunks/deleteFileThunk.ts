import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '@/utils/axiosAPI.ts'
import { isAxiosError } from 'axios'
import { GlobalError } from '@/types'

export const deleteFile = createAsyncThunk<
  string,
  string,
  { rejectValue:GlobalError }
>('files/deleteFile', async (filename, { rejectWithValue }) => {
  try {
    await axiosAPI.delete(`/files/${ filename }`)
    return filename
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})
