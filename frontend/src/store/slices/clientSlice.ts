import { Client, GlobalError, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import { addClient, archiveClient, deleteClient, fetchClientById, fetchClients, updateClient } from '../thunks/clientThunk.ts'

interface ClientState {
  client: Client | null;
  clients: Client[] | null;
  loadingFetch : boolean;
  loadingAdd: boolean;
  loadingArchive: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  error: GlobalError | null;
  creationAndModificationError: ValidationError | GlobalError | null;
}

const initialState: ClientState = {
  client: null,
  clients: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingArchive: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  creationAndModificationError: null,
}

export const selectClient = (state: RootState) => state.clients.client
export const selectAllClients = (state: RootState) => state.clients.clients
export const selectLoadingFetchClient = (state: RootState) => state.clients.loadingFetch
export const selectLoadingAddClient = (state: RootState) => state.clients.loadingAdd
export const selectLoadingArchiveClient = (state: RootState) => state.clients.loadingArchive
export const selectLoadingDeleteClient = (state: RootState) => state.clients.loadingDelete
export const selectLoadingUpdateClient = (state: RootState) => state.clients.loadingUpdate
export const selectClientError = (state: RootState) => state.clients.error
export const selectClientCreationAndModificationError = (state: RootState) => state.clients.creationAndModificationError

export const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearCreationAndModificationError: state => {
      state.creationAndModificationError = null
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchClients.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.clients = action.payload
    })
    builder.addCase(fetchClients.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchClientById.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchClientById.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.client = action.payload
    })
    builder.addCase(fetchClientById.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(addClient.pending, state => {
      state.loadingAdd = true
      state.creationAndModificationError = null
    })
    builder.addCase(addClient.fulfilled, state => {
      state.loadingAdd = false
      state.creationAndModificationError = null
    })
    builder.addCase(addClient.rejected, (state, { payload: returnedError, error: thrownError }) => {
      state.loadingAdd = false
      state.creationAndModificationError =
        returnedError ?? (thrownError.message ? (thrownError as GlobalError) : { message: 'Неизвестная ошибка' })
    })
    builder.addCase(archiveClient.pending, state => {
      state.loadingArchive = true
      state.error = null
    })
    builder.addCase(archiveClient.fulfilled, state => {
      state.loadingArchive = false
      state.error = null
    })
    builder.addCase(archiveClient.rejected, (state, { payload: error }) => {
      state.loadingArchive = false
      state.error = error || null
    })
    builder.addCase(deleteClient.pending, state => {
      state.loadingDelete = true
      state.error = null
    })
    builder.addCase(deleteClient.fulfilled, state => {
      state.loadingDelete = false
      state.error = null
    })
    builder.addCase(deleteClient.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.error = error || null
    })
    builder.addCase(updateClient.pending, state => {
      state.loadingUpdate = true
      state.error = null
    })
    builder.addCase(updateClient.fulfilled, state => {
      state.loadingUpdate = false
      state.error = null
    })
    builder.addCase(updateClient.rejected, (state, { payload: returnedError, error: thrownError }) => {
      state.loadingUpdate = false
      state.creationAndModificationError =
        returnedError ?? (thrownError.message ? (thrownError as GlobalError) : { message: 'Неизвестная ошибка' })
    })
  },
})

export const { clearCreationAndModificationError } = clientSlice.actions

export const clientReducer = clientSlice.reducer
