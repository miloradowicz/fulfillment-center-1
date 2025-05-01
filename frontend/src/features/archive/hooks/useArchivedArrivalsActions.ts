import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectAllArchivedArrivals } from '@/store/slices/arrivalSlice.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteArrival, fetchArchivedArrivals, unarchiveArrival } from '@/store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'

export const useArchivedArrivalsActions = () => {
  const dispatch = useAppDispatch()
  const arrivals = useAppSelector(selectAllArchivedArrivals)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [arrivalToActionId, setArrivalToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')

  const fetchAllArchivedArrivals = useCallback(async () => {
    await dispatch(fetchArchivedArrivals())
  }, [dispatch])

  useEffect(() => {
    void dispatch(fetchArchivedArrivals())
  }, [dispatch])

  const deleteOneArrival = async (id: string) => {
    try {
      await dispatch(deleteArrival(id)).unwrap()
      await fetchAllArchivedArrivals()
      toast.success('Поставка успешно удалена!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить поставку')
      }
      console.error(e)
    }
  }

  const unarchiveOneArrival = async (id: string) => {
    try {
      await dispatch(unarchiveArrival(id)).unwrap()
      await fetchAllArchivedArrivals()
      toast.success('Поставка успешно восстановлена!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить поставку')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setArrivalToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setArrivalToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!arrivalToActionId) return

    if (actionType === 'delete') {
      await deleteOneArrival(arrivalToActionId)
    } else {
      await unarchiveOneArrival(arrivalToActionId)
    }

    handleConfirmationClose()
  }


  return {
    arrivals,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}
