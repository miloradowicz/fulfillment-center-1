import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect } from 'react'
import { deleteCounterparty, fetchCounterparties } from '../../../store/thunks/counterpartyThunk.ts'
import { selectAllCounterparties, selectLoadingFetch } from '../../../store/slices/counterpartySlices.ts'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const useCounterpartiesList = () => {
  const dispatch = useAppDispatch()
  const counterparties = useAppSelector(selectAllCounterparties)
  const isLoading = useAppSelector(selectLoadingFetch)
  const navigate = useNavigate()

  const fetchAllCounterparties = useCallback(async () => {
    await dispatch(fetchCounterparties())
  }, [dispatch])

  useEffect(() => {
    void fetchAllCounterparties()
  }, [dispatch, fetchAllCounterparties])

  const deleteOneCounterparty = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этого контрагента?')) {
        await dispatch(deleteCounterparty(id)).unwrap()
        navigate('/counterparties')
        void fetchAllCounterparties()
        toast.success('Контрагент успешно удалён!')
      } else {
        toast.info('Вы отменили удаление контрагента')
      }
    } catch (e) {
      console.error(e)
      let errorMessage = 'Не удалось удалить контрагента'

      if (e instanceof Error) {
        errorMessage = e.message
      } else if (typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string') {
        errorMessage = e.message
      }
      toast.error(errorMessage)
    }
  }

  return {
    counterparties,
    deleteOneCounterparty,
    isLoading,
  }
}
