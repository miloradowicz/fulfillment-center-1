import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { clearClientError } from '@/store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import { Counterparty } from '@/types'
import {
  selectAllArchivedCounterparties,
  selectCounterpartyError,
  selectLoadingFetchArchive,
  selectOneCounterparty,
} from '@/store/slices/counterpartySlices.ts'
import {
  deleteCounterparty,
  fetchAllArchivedCounterparties,
  unarchiveCounterparty,
} from '@/store/thunks/counterpartyThunk.ts'

export const useArchivedCounterpartiesActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [counterpartyToDeleteId, setCounterpartyToDeleteId] = useState<string | null>(null)

  const [unarchiveConfirmationOpen, setUnarchiveConfirmationOpen] = useState(false)
  const [counterpartyToUnarchiveId, setCounterpartyToUnarchiveId] = useState<string | null>(null)

  const counterparties = useAppSelector(selectAllArchivedCounterparties)
  const { id } = useParams()
  const counterparty = useAppSelector(selectOneCounterparty)
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null)
  const error = useAppSelector(selectCounterpartyError)
  const loading = useAppSelector(selectLoadingFetchArchive)
  const navigate = useNavigate()

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

  const handleUnarchiveCounterparty = async (id: string) => {
    try {
      await dispatch(unarchiveCounterparty(id)).unwrap()
      toast.success('Контрагент успешно восстановлен!')
      await fetchArchivedCounterparties()
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Ошибка при восстановлении контрагента')
      }
    }
  }

  const deleteOneCounterparty = async (id: string) => {
    try {
      await dispatch(deleteCounterparty(id)).unwrap()
      if (fetchOnDelete) {
        await dispatch(fetchAllArchivedCounterparties()).unwrap()
      } else {
        navigate('/counterparties')
      }
      toast.success('Контрагент успешно удалён!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить контрагента')
      }
      console.error(e)
    }
  }

  const handleOpen = (counterparty?: Counterparty) => {
    if (counterparty) {
      setSelectedCounterparty(counterparty)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    clearErrors()
  }

  const handleConfirmationOpen = (id: string) => {
    setCounterpartyToDeleteId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setCounterpartyToDeleteId(null)
  }

  const handleConfirmationDelete = () => {
    if (counterpartyToDeleteId) deleteOneCounterparty(counterpartyToDeleteId)
    handleConfirmationClose()
  }

  const handleUnarchiveConfirmationOpen = (id: string) => {
    setCounterpartyToUnarchiveId(id)
    setUnarchiveConfirmationOpen(true)
  }

  const handleUnarchiveConfirmationClose = () => {
    setUnarchiveConfirmationOpen(false)
    setCounterpartyToUnarchiveId(null)
  }

  const handleUnarchiveConfirm = async () => {
    if (counterpartyToUnarchiveId) {
      await handleUnarchiveCounterparty(counterpartyToUnarchiveId)
    }
    handleUnarchiveConfirmationClose()
  }

  return {
    counterparties,
    counterparty,
    selectedCounterparty,
    open,
    confirmationOpen,
    unarchiveConfirmationOpen,
    error,
    loading,
    id,
    navigate,
    handleUnarchiveCounterparty,
    deleteOneCounterparty,
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
