import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import { registerUser, loginUser, fetchUsers, fetchUserById, updateUser, deleteUser } from '../thunks/userThunk.ts'
import { User, ValidationError, GlobalError } from '../../types'

interface UserState {
  user: User | null
  users: User[] | null
  loadingFetch: boolean
  loadingRegister: boolean
  loadingLogin: boolean
  loadingUpdate: boolean
  loadingDelete: boolean
  error: GlobalError | null
  createError: ValidationError | null
}

const initialState: UserState = {
  user: null,
  users: null,
  loadingFetch: false,
  loadingRegister: false,
  loadingLogin: false,
  loadingUpdate: false,
  loadingDelete: false,
  error: null,
  createError: null,
}

export const selectUser = (state: RootState) => state.users.user
export const selectAllUsers = (state: RootState) => state.users.users
export const selectLoadingFetchUser = (state: RootState) => state.users.loadingFetch
export const selectLoadingRegisterUser = (state: RootState) => state.users.loadingRegister
export const selectLoadingLoginUser = (state: RootState) => state.users.loadingLogin
export const selectLoadingUpdateUser = (state: RootState) => state.users.loadingUpdate
export const selectLoadingDeleteUser = (state: RootState) => state.users.loadingDelete
export const selectUserError = (state: RootState) => state.users.error
export const selectCreateError = (state: RootState) => state.users.createError

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCreateError: (state, { payload }: PayloadAction<string | undefined>) => {
      if (state.createError && payload) {
        delete state.createError.errors[payload]

        if (!Object.keys(state.createError.errors).length) {
          state.createError = null
        }
      } else {
        state.error = null
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.users = action.payload
    })
    builder.addCase(fetchUsers.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchUserById.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.user = action.payload
    })
    builder.addCase(fetchUserById.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(registerUser.pending, state => {
      state.loadingRegister = true
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loadingRegister = false
      state.user = action.payload
    })
    builder.addCase(registerUser.rejected, (state, { payload: error }) => {
      state.loadingRegister = false
      state.createError = error || null
    })
    builder.addCase(loginUser.pending, state => {
      state.loadingLogin = true
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loadingLogin = false
      state.user = action.payload
    })
    builder.addCase(loginUser.rejected, (state, { payload: error }) => {
      state.loadingLogin = false
      state.createError = error || null
    })
    builder.addCase(updateUser.pending, state => {
      state.loadingUpdate = true
    })
    builder.addCase(updateUser.fulfilled, state => {
      state.loadingUpdate = false
    })
    builder.addCase(updateUser.rejected, (state, { payload: error }) => {
      state.loadingUpdate = false
      state.error = error || null
    })
    builder.addCase(deleteUser.pending, state => {
      state.loadingDelete = true
    })
    builder.addCase(deleteUser.fulfilled, state => {
      state.loadingDelete = false
    })
    builder.addCase(deleteUser.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.error = error || null
    })
  },
})

export const { clearCreateError } = userSlice.actions

export const userReducer = userSlice.reducer
