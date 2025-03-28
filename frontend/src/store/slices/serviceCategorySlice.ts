import { createSlice } from '@reduxjs/toolkit'
import { GlobalError, ServiceCategory, ValidationError } from '../../types'
import { archiveServiceCategory, createServiceCategory, deleteServiceCategory, fetchServiceCategories, fetchServiceCategoryById, updateServiceCategory } from '../thunks/serviceCategoryThunk.ts'
import { RootState } from '../../app/store.ts'

interface ServiceState {
  serviceCategory: ServiceCategory | null;
  serviceCategories: ServiceCategory[];
  loadingFetch: boolean;
  loadingFetchOne: boolean;
  loadingAdd: boolean;
  loadingArchive: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  error: GlobalError | null;
  creationAndModificationError: ValidationError | GlobalError | null;
}

const initialState: ServiceState = {
  serviceCategory: null,
  serviceCategories: [],
  loadingFetch: false,
  loadingFetchOne: false,
  loadingAdd: false,
  loadingArchive: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  creationAndModificationError: null,
}

export const selectServiceCategory = (state: RootState) => state.serviceCategories.serviceCategory
export const selectAllServiceCateogories = (state: RootState) => state.serviceCategories.serviceCategories
export const selectLoadingFetchServiceCategory = (state: RootState) => state.serviceCategories.loadingFetch
export const selectLoadingAddServiceCategory = (state: RootState) => state.serviceCategories.loadingAdd
export const selectLoadingArchiveServiceCategory = (state: RootState) => state.serviceCategories.loadingArchive
export const selectLoadingDeleteServiceCategory = (state: RootState) => state.serviceCategories.loadingDelete
export const selectLoadingUpdateServiceCategory = (state: RootState) => state.serviceCategories.loadingUpdate
export const selectServiceCategoryError = (state: RootState) => state.serviceCategories.error
export const selectServiceCategoryCreationAndModificationError = (state: RootState) => state.serviceCategories.creationAndModificationError

const serviceCategorySlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCreationAndModificationError: state => {
      state.creationAndModificationError = null
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchServiceCategories.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchServiceCategories.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.serviceCategories = action.payload
    })
    builder.addCase(fetchServiceCategories.rejected, state => {
      state.loadingFetch = false
    })

    builder.addCase(fetchServiceCategoryById.pending, state => {
      state.loadingFetchOne = true
    })
    builder.addCase(fetchServiceCategoryById.fulfilled, (state, action) => {
      state.loadingFetchOne = false
      state.serviceCategory = action.payload
    })
    builder.addCase(fetchServiceCategoryById.rejected, state => {
      state.loadingFetchOne = false
    })

    builder.addCase(createServiceCategory.pending, state => {
      state.loadingAdd = true
    })
    builder.addCase(createServiceCategory.fulfilled, state => {
      state.loadingAdd = false
    })
    builder.addCase(createServiceCategory.rejected, (state, { payload: returnedError, error: thrownError }) => {
      state.loadingAdd = false
      state.creationAndModificationError =
        returnedError ?? (thrownError.message ? (thrownError as GlobalError) : { message: 'Неизвестная ошибка' })
    })

    builder.addCase(updateServiceCategory.pending, state => {
      state.loadingUpdate = true
    })
    builder.addCase(updateServiceCategory.fulfilled, state => {
      state.loadingUpdate = false
    })
    builder.addCase(updateServiceCategory.rejected, (state, { payload: returnedError, error: thrownError }) => {
      state.loadingUpdate = false
      state.creationAndModificationError =
        returnedError ?? (thrownError.message ? (thrownError as GlobalError) : { message: 'Неизвестная ошибка' })
    })

    builder.addCase(archiveServiceCategory.pending, state => {
      state.loadingArchive = true
      state.error = null
    })
    builder.addCase(archiveServiceCategory.fulfilled, state => {
      state.loadingArchive = false
      state.error = null
    })
    builder.addCase(archiveServiceCategory.rejected, (state, { payload: error }) => {
      state.loadingArchive = false
      state.error = error || null
    })

    builder.addCase(deleteServiceCategory.pending, state => {
      state.loadingDelete = true
      state.error = null
    })
    builder.addCase(deleteServiceCategory.fulfilled, state => {
      state.loadingDelete = false
      state.error = null
    })
    builder.addCase(deleteServiceCategory.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.error = error || null
    })
  },
})

export const serviceCategoryReducer = serviceCategorySlice.reducer
export const { clearCreationAndModificationError } = serviceCategorySlice.actions
