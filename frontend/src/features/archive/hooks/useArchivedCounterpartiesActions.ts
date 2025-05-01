import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { clearClientError } from '@/store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import {
  selectAllArchivedCounterparties,
} from '@/store/slices/counterpartySlices.ts'
import {
  deleteCounterparty,
  fetchAllArchivedCounterparties,
  unarchiveCounterparty,
} from '@/store/thunks/counterpartyThunk.ts'

export const useArchivedCounterpartiesActions = (fetchOnDelete:boolean) => {
  const dispatch = useAppDispatch()
  const counterparties = useAppSelector(selectAllArchivedCounterparties)
  const navigate = useNavigate()
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [counterpartyToActionId, setCounterpartyToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')

  const clearErrors = useCallback(() => {
    dispatch(clearClientError())
  }, [dispatch])

  const fetchArchivedCounterparties = useCallback(async () => {
    try {
      if (!counterparties) {
        await dispatch(fetchAllArchivedCounterparties()).unwrap()
      }
    } catch (e) {
      console.error(e)
    }
  }, [dispatch, counterparties])

  useEffect(() => {
    void clearErrors()
  }, [clearErrors])

  useEffect(() => {
    void fetchArchivedCounterparties()
  }, [fetchArchivedCounterparties])

  const deleteOneCounterparty = async (id: string) => {
    try {
      await dispatch(deleteCounterparty(id)).unwrap()
      if (fetchOnDelete) {
        await dispatch(fetchAllArchivedCounterparties()).unwrap()
      } else {
        navigate('/counterparties')
      }
      toast.success('Контрагент успешно удален!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить контрагента')
      }
      console.error(e)
    }
  }

  const unarchiveOneCounterparty = async (id: string) => {
    try {
      await dispatch(unarchiveCounterparty(id)).unwrap()
      await fetchArchivedCounterparties()
      toast.success('Контрагент успешно восстановлен!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить контрагента')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setCounterpartyToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setCounterpartyToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!counterpartyToActionId) return

    if (actionType === 'delete') {
      await deleteOneCounterparty(counterpartyToActionId)
    } else {
      await unarchiveOneCounterparty(counterpartyToActionId)
    }

    handleConfirmationClose()
  }

  return {
    counterparties,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}
