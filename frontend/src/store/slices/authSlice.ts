import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { loginUser, logoutUser, registerUser } from '../thunks/userThunk'
import { User, ValidationError, GlobalError } from '@/types'

interface AuthState {
  user: User | null
  loadingRegister: boolean
  loadingLogin: boolean
  error: GlobalError | null
  createError: ValidationError | null
  loginError: ValidationError | null
}

const initialState: AuthState = {
  user: null,
  loadingRegister: false,
  loadingLogin: false,
  error: null,
  createError: null,
  loginError: null,
}

export const selectUser = (state: RootState) => state.auth.user
export const selectLoadingRegisterUser = (state: RootState) => state.auth.loadingRegister
export const selectLoadingLoginUser = (state: RootState) => state.auth.loadingLogin
export const selectUserError = (state: RootState) => state.auth.error
export const selectCreateError = (state: RootState) => state.auth.createError
export const selectLoginError = (state: RootState) => state.auth.loginError

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearCreateError: (state, { payload }: PayloadAction<string | undefined>) => {
      if (state.createError && payload) {
        delete state.createError.errors[payload]
        if (!Object.keys(state.createError.errors).length) {
          state.createError = null
        }
      } else {
        state.createError = null
      }
    },
    clearLoginError: (state, { payload }: PayloadAction<string | undefined>) => {
      if (state.loginError && state.loginError.errors && payload) {
        delete state.loginError.errors[payload]
        if (!Object.keys(state.loginError.errors).length) {
          state.loginError = null
        }
      } else {
        state.loginError = null
      }
    },
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
    },
    unsetUser: state => {
      state.user = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loadingRegister = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loadingRegister = false
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, { payload: error }) => {
        state.loadingRegister = false
        state.createError = error || null
      })

      .addCase(loginUser.pending, state => {
        state.loadingLogin = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingLogin = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, { payload: error }) => {
        state.loadingLogin = false
        state.loginError = error || null
      })

      .addCase(logoutUser.pending, state => {
        state.loadingLogin = true
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loadingLogin = false
        state.user = null
      })
      .addCase(logoutUser.rejected, (state, { payload: error }) => {
        state.loadingLogin = false
        state.error = error || null
      })
  },
})

export const {
  clearCreateError,
  clearLoginError,
  setUser,
  unsetUser,
} = authSlice.actions

export const authReducer = authSlice.reducer
