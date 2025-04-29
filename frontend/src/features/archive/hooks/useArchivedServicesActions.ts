import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { Service } from '@/types'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import { deleteService, fetchArchivedServices, unarchiveService } from '@/store/thunks/serviceThunk.ts'
import {
  selectAllArchivedServices,
  selectLoadingFetchArchiveService,
  selectServiceError,
} from '@/store/slices/serviceSlice.ts'

const useArchivedServiceActions = (isActive: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [serviceToActionId, setServiceToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const services = useAppSelector(selectAllArchivedServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const loading = useAppSelector(selectLoadingFetchArchiveService)
  const error = useAppSelector(selectServiceError)

  const fetchServices = useCallback(() => {
    dispatch(fetchArchivedServices())
  }, [dispatch])

  useEffect(() => {
    if (isActive && !loading && (!services || services.length === 0)) {
      fetchServices()
    }
  }, [isActive, loading, services, fetchServices])

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

  const handleOpen = (service?: Service) => {
    if (service) {
      setSelectedService(service)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
    selectedService,
    open,
    handleOpen,
    handleClose,
    id,
    navigate,
    loading,
    error,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
    serviceToActionId,
  }
}

export default useArchivedServiceActions
