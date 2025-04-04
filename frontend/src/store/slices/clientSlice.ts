import { Client, GlobalError, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store.ts'
import {
  addClient,
  archiveClient,
  deleteClient,
  fetchArchivedClients,
  fetchClientById,
  fetchClients, unarchiveClient,
  updateClient,
} from '../thunks/clientThunk.ts'

interface ClientState {
  client: Client | null;
  archivedClient: Client | null;
  clients: Client[] | null;
  archivedClients: Client[] | null;
  loadingFetch: boolean;
  loadingArchived: boolean;
  loadingAdd: boolean;
  loadingArchive: boolean;
  loadingUnarchive: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  error: GlobalError | null;
  creationAndModificationError: ValidationError | GlobalError | null;
  deletionError: GlobalError | null;
}

const initialState: ClientState = {
  client: null,
  archivedClient: null,
  clients: null,
  archivedClients: null,
  loadingFetch: false,
  loadingArchived: false,
  loadingAdd: false,
  loadingArchive: false,
  loadingUnarchive: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  creationAndModificationError: null,
  deletionError: null,
}

export const selectClient = (state: RootState) => state.clients.client
export const selectArchivedClient = (state: RootState) => state.clients.archivedClient
export const selectAllClients = (state: RootState) => state.clients.clients
export const selectAllArchivedClients = (state: RootState) => state.clients.archivedClients
export const selectLoadingFetchClient = (state: RootState) => state.clients.loadingFetch
export const selectLoadingArchivedClients = (state: RootState) => state.clients.loadingArchived
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
    clearClientError: state => {
      state.creationAndModificationError = null
      state.deletionError = null
      state.error = null
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
    builder.addCase(fetchArchivedClients.pending, state => {
      state.loadingArchived = true
    })
    builder.addCase(fetchArchivedClients.fulfilled, (state, action) => {
      state.loadingArchived = false
      state.archivedClients = action.payload
    })
    builder.addCase(fetchArchivedClients.rejected, state => {
      state.loadingArchived = false
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
    builder.addCase(unarchiveClient.pending, state => {
      state.loadingUnarchive = true
      state.error = null
    })
    builder.addCase(unarchiveClient.fulfilled, (state, action) => {
      state.loadingUnarchive = false
      state.error = null

      if (state.archivedClients) {
        state.archivedClients = state.archivedClients.filter(client => client._id !== action.payload.id)
      }
    })
    builder.addCase(unarchiveClient.rejected, (state, { payload: error }) => {
      state.loadingUnarchive = false
      state.error = error || null
    })
    builder.addCase(deleteClient.pending, state => {
      state.loadingDelete = true
      state.deletionError = null
    })
    builder.addCase(deleteClient.fulfilled, state => {
      state.loadingDelete = false
      state.deletionError = null
    })
    builder.addCase(deleteClient.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.deletionError = error || null
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

export const { clearCreationAndModificationError, clearClientError } = clientSlice.actions

export const clientReducer = clientSlice.reducer
