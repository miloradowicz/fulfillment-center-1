import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect } from 'react'
import { fetchClients, deleteClient } from '../../../store/thunks/clientThunk.ts'
import { selectAllClients, selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'
import { toast } from 'react-toastify'

export const useClientsList = () => {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const isLoading = useAppSelector(selectLoadingFetchClient)

  const fetchAllClients = useCallback(async () => {
    await dispatch(fetchClients())
  }, [dispatch])

  useEffect(() => {
    void fetchAllClients()
  }, [dispatch, fetchAllClients])

  const deleteOneClient = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
        await dispatch(deleteClient(id))
        void fetchAllClients()
      } else {
        toast.info('Вы отменили удаление клиента')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    clients,
    deleteOneClient,
    isLoading,
  }
}
