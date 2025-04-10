import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteCounterparty, fetchCounterparties } from '@/store/thunks/counterpartyThunk.ts'
import { selectAllCounterparties, selectLoadingFetch } from '@/store/slices/counterpartySlices.ts'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Counterparty } from '@/types'

export const useCounterpartiesList = () => {
  const dispatch = useAppDispatch()
  const counterparties = useAppSelector(selectAllCounterparties)
  const isLoading = useAppSelector(selectLoadingFetch)
  const navigate = useNavigate()

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [counterpartyToDelete, setCounterpartyToDelete] = useState<Counterparty | null>(null)

  const fetchAllCounterparties = useCallback(async () => {
    await dispatch(fetchCounterparties())
  }, [dispatch])

  useEffect(() => {
    void fetchAllCounterparties()
  }, [dispatch, fetchAllCounterparties])

  const deleteOneCounterparty = async (id: string) => {
    try {
      await dispatch(deleteCounterparty(id)).unwrap()
      navigate('/counterparties')
      void fetchAllCounterparties()
      toast.success('Контрагент успешно удалён!')
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

  const handleOpenConfirmationModal = (counterparty: Counterparty) => {
    setCounterpartyToDelete(counterparty)
    setConfirmationModalOpen(true)
  }

  const handleCloseConfirmationModal = () => {
    setConfirmationModalOpen(false)
    setCounterpartyToDelete(null)
  }

  const confirmDelete = () => {
    if (counterpartyToDelete) {
      deleteOneCounterparty(counterpartyToDelete._id)
      handleCloseConfirmationModal()
    }
  }

  return {
    counterparties,
    deleteOneCounterparty,
    isLoading,
    confirmationModalOpen,
    counterpartyToDelete,
    handleOpenConfirmationModal,
    handleCloseConfirmationModal,
    confirmDelete,
  }
}
