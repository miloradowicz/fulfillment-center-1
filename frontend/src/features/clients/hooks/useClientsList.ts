import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteClient, fetchClients } from '../../../store/thunks/clientThunk.ts'
import { selectAllClients, selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const useClientsList = () => {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const isLoading = useAppSelector(selectLoadingFetchClient)
  const navigate = useNavigate()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const fetchAllClients = useCallback(async () => {
    await dispatch(fetchClients())
  }, [dispatch])

  useEffect(() => {
    void fetchAllClients()
  }, [dispatch, fetchAllClients])

  const handleDeleteClick = (id: string) => {
    setSelectedClientId(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedClientId) {
      try {
        await dispatch(deleteClient(selectedClientId)).unwrap()
        navigate('/clients')
        void fetchAllClients()
        toast.success('Клиент успешно удалён!')
      } catch (e) {
        console.error(e)
        let errorMessage = 'Не удалось удалить клиента'

        if (e instanceof Error) {
          errorMessage = e.message
        } else if (typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string') {
          errorMessage = e.message
        }
        toast.error(errorMessage)
      } finally {
        setDeleteModalOpen(false)
        setSelectedClientId(null)
      }
    }
  }

  return {
    clients,
    isLoading,
    deleteModalOpen,
    handleDeleteClick,
    handleConfirmDelete,
    setDeleteModalOpen,
  }
}
