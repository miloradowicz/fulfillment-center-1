import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import { deleteService, fetchArchivedServices, unarchiveService } from '@/store/thunks/serviceThunk.ts'
import {
  selectAllArchivedServices, selectLoadingFetchArchiveService,
} from '@/store/slices/serviceSlice.ts'

const useArchivedServiceActions = () => {
  const dispatch = useAppDispatch()
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [serviceToActionId, setServiceToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const services = useAppSelector(selectAllArchivedServices)
  const loading = useAppSelector(selectLoadingFetchArchiveService)


  const deleteOneService = async (id: string) => {
    try {
      await dispatch(deleteService(id)).unwrap()
      await dispatch(fetchArchivedServices())
      toast.success('Услуга успешно удалена!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить услугу')
      }
      console.error(e)
    }
  }

  const unarchiveOneService = async (id: string) => {
    try {
      await dispatch(unarchiveService(id)).unwrap()
      await dispatch(fetchArchivedServices())
      toast.success('Услуга успешно восстановлена!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить услугу')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setServiceToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setServiceToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!serviceToActionId) return

    if (actionType === 'delete') {
      await deleteOneService(serviceToActionId)
    } else {
      await unarchiveOneService(serviceToActionId)
    }

    handleConfirmationClose()
  }

  return {
    services,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}

export default useArchivedServiceActions
