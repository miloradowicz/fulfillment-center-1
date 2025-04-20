import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import {
  fetchUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  archiveUser,
  fetchArchivedUsers,
  unarchiveUser,
} from '../thunks/userThunk'
import { UserStripped, GlobalError, User } from '@/types'

interface UsersState {
  users: UserStripped[] | null
  archivedUsers: UserStripped[] | null
  selectedUser: User | null
  loading: boolean
  error: GlobalError | null
}

const initialState: UsersState = {
  users: null,
  archivedUsers: null,
  selectedUser: null,
  loading: false,
  error: null,
}

export const selectAllUsers = (state: RootState) => state.users.users
export const selectAllArchivedUsers = (state: RootState) => state.users.archivedUsers
export const selectSelectedUser = (state: RootState) => state.users.selectedUser
export const selectUsersLoading = (state: RootState) => state.users.loading
export const selectUsersError = (state: RootState) => state.users.error

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload
    },
    clearSelectedUser: state => {
      state.selectedUser = null
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.loading = false
      state.users = payload
    })
    builder.addCase(fetchUsers.rejected, state => {
      state.loading = false
    })

    builder.addCase(fetchArchivedUsers.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchArchivedUsers.fulfilled, (state, { payload }) => {
      state.loading = false
      state.archivedUsers = payload
    })
    builder.addCase(fetchArchivedUsers.rejected, state => {
      state.loading = false
    })

    builder.addCase(fetchUserById.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchUserById.fulfilled, (state, { payload }) => {
      state.loading = false
      state.selectedUser = payload
    })
    builder.addCase(fetchUserById.rejected, state => {
      state.loading = false
    })

    builder.addCase(updateUser.pending, state => {
      state.loading = true
    })
    builder.addCase(updateUser.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(updateUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload || null
    })

    builder.addCase(deleteUser.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteUser.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(deleteUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload || null
    })

    builder.addCase(archiveUser.pending, state => {
      state.loading = true
    })
    builder.addCase(archiveUser.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(archiveUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload || null
    })

    builder.addCase(unarchiveUser.pending, state => {
      state.loading = true
    })
    builder.addCase(unarchiveUser.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(unarchiveUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload || null
    })
  },
})

export const { setSelectedUser, clearSelectedUser } = userSlice.actions
export const userReducer = userSlice.reducer
