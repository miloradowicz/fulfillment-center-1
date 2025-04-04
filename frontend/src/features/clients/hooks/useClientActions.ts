import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { archiveClient, fetchClientById, fetchClients } from '../../../store/thunks/clientThunk.ts'
import { clearClientError, selectAllClients, selectClient, selectClientError, selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { hasMessage, isGlobalError } from '../../../utils/helpers.ts'
import { Client } from '../../../types'

export const useClientActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [clientToArchiveId, setClientToArchiveId] = useState<string | null>(null)
  const clients = useAppSelector(selectAllClients)
  const { id } = useParams()
  const client = useAppSelector(selectClient)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const error = useAppSelector(selectClientError)
  const loading = useAppSelector(selectLoadingFetchClient)
  const navigate = useNavigate()

  const clearErrors = useCallback(() => {
    dispatch(clearClientError())
  }, [dispatch])

  const fetchAllClients = useCallback(async () => {
    await dispatch(fetchClients())
  }, [dispatch])

  const fetchClient = useCallback(async (id: string) => {
    await dispatch(fetchClientById(id))
  }, [dispatch])

  useEffect(() => {
    void clearErrors()
  }, [clearErrors])

  useEffect(() => {
    void fetchAllClients()
  }, [fetchAllClients])

  useEffect(() => {
    if (id) {
      void fetchClient(id)
    }
  }, [id, fetchClient])

  const archiveOneClient = async (id: string) => {
    try {
      await dispatch(archiveClient(id)).unwrap()
      if (fetchOnDelete) {
        await fetchAllClients()
      } else {
        navigate('/clients')
      }
      toast.success('Клиент успешно архивирован!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось архивировать клиента')
      }
      console.error(e)
    }
  }

  const handleOpen = (client?: Client) => {
    if (client) {
      setSelectedClient(client)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    clearErrors()
  }

  const handleConfirmationOpen = (id: string) => {
    setClientToArchiveId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setClientToArchiveId(null)
  }

  const handleConfirmationArchive = () => {
    if (clientToArchiveId) archiveOneClient(clientToArchiveId)
    handleConfirmationClose()
  }

  return {
    clients,
    client,
    selectedClient,
    open,
    confirmationOpen,
    error,
    loading,
    id,
    navigate,
    archiveOneClient,
    handleOpen,
    handleClose,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationArchive,
  }
}
