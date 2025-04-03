import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteClient, fetchClientById, fetchClients } from '../../../store/thunks/clientThunk.ts'
import { clearClientError, selectAllClients, selectClient, selectClientError, selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { hasMessage, isGlobalError } from '../../../utils/helpers.ts'
import { Client } from '../../../types'

export const useClientActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [clientToDeleteId, setClientToDeleteId] = useState<string | null>(null)
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

  const deleteOneClient = async (id: string) => {
    try {
      await dispatch(deleteClient(id)).unwrap()
      if (fetchOnDelete) {
        await fetchAllClients()
      } else {
        navigate('/clients')
      }
      toast.success('Клиент успешно удалён!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить клиента')
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
    setClientToDeleteId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setClientToDeleteId(null)
  }

  const handleConfirmationDelete = () => {
    if (clientToDeleteId) deleteOneClient(clientToDeleteId)
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
    deleteOneClient,
    handleOpen,
    handleClose,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
  }
}
