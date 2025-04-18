import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { deleteFile } from '@/store/thunks/deleteFileThunk.ts'
import { GlobalError } from '@/types'

interface FilesState {
  existingFiles: string[]
  isLoading: boolean
  error: GlobalError | null | string
}

const initialState: FilesState = {
  existingFiles: [],
  isLoading: false,
  error: null,
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(deleteFile.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.existingFiles = state.existingFiles.filter(name => name !== action.payload)
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Не удалось удалить файл'
      })
  },
})

export const filesReducer = filesSlice.reducer
