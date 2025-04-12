import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { archiveCounterparty, fetchAllCounterparties } from '@/store/thunks/counterpartyThunk.ts'
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

  const fetchCounterparties = useCallback(async () => {
    await dispatch(fetchAllCounterparties())
  }, [dispatch])

  useEffect(() => {
    void fetchCounterparties()
  }, [dispatch, fetchCounterparties])

  const archiveOneCounterparty = async (id: string) => {
    try {
      await dispatch(archiveCounterparty(id)).unwrap()
      await dispatch(fetchCounterparties)
      navigate('/counterparties')
      void fetchAllCounterparties()
      toast.success('Контрагент успешно архивирован!')
    } catch (e) {
      console.error(e)
      let errorMessage = 'Не удалось архивировать контрагента'

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

  const confirmArchive = () => {
    if (counterpartyToDelete) {
      archiveOneCounterparty(counterpartyToDelete._id)
      handleCloseConfirmationModal()
    }
  }

  return {
    counterparties,
    archiveOneCounterparty,
    isLoading,
    confirmationModalOpen,
    counterpartyToDelete,
    handleOpenConfirmationModal,
    handleCloseConfirmationModal,
    confirmArchive,
  }
}
