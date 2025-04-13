import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteClient, fetchArchivedClients, unarchiveClient } from '@/store/thunks/clientThunk.ts'
import {
  clearClientError,
  selectAllArchivedClients,
  selectArchivedClient,
  selectClientError,
  selectLoadingArchivedClients,
} from '@/store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import { Client } from '@/types'

export const useArchivedClientActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [clientToDeleteId, setClientToDeleteId] = useState<string | null>(null)

  const [unarchiveConfirmationOpen, setUnarchiveConfirmationOpen] = useState(false)
  const [clientToUnarchiveId, setClientToUnarchiveId] = useState<string | null>(null)

  const clients = useAppSelector(selectAllArchivedClients)
  const { id } = useParams()
  const client = useAppSelector(selectArchivedClient)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const error = useAppSelector(selectClientError)
  const loading = useAppSelector(selectLoadingArchivedClients)
  const navigate = useNavigate()

  const clearErrors = useCallback(() => {
    dispatch(clearClientError())
  }, [dispatch])

  const fetchAllArchivedClients = useCallback(async () => {
    await dispatch(fetchArchivedClients())
  }, [dispatch])

  useEffect(() => {
    void clearErrors()
  }, [clearErrors])

  useEffect(() => {
    void fetchAllArchivedClients()
  }, [fetchAllArchivedClients])

  const handleUnarchiveClient = async (id: string) => {
    try {
      await dispatch(unarchiveClient(id)).unwrap()
      toast.success('Клиент успешно восстановлен!')
      await fetchAllArchivedClients()
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Ошибка при восстановлении клиента')
      }
    }
  }

  const deleteOneClient = async (id: string) => {
    try {
      await dispatch(deleteClient(id)).unwrap()
      if (fetchOnDelete) {
        await fetchAllArchivedClients()
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

  const handleUnarchiveConfirmationOpen = (id: string) => {
    setClientToUnarchiveId(id)
    setUnarchiveConfirmationOpen(true)
  }

  const handleUnarchiveConfirmationClose = () => {
    setUnarchiveConfirmationOpen(false)
    setClientToUnarchiveId(null)
  }

  const handleUnarchiveConfirm = async () => {
    if (clientToUnarchiveId) {
      await handleUnarchiveClient(clientToUnarchiveId)
    }
    handleUnarchiveConfirmationClose()
  }

  return {
    clients,
    client,
    selectedClient,
    open,
    confirmationOpen,
    unarchiveConfirmationOpen,
    error,
    loading,
    id,
    navigate,
    handleUnarchiveClient,
    deleteOneClient,
    handleOpen,
    handleClose,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    handleUnarchiveConfirmationOpen,
    handleUnarchiveConfirmationClose,
    handleUnarchiveConfirm,
  }
}
