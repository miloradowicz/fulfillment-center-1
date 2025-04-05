import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllArchivedArrivals } from '../../../store/slices/arrivalSlice.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteArrival, fetchArchivedArrivals, unarchiveArrival } from '../../../store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'

export const useArchivedArrivalsActions = () => {
  const dispatch = useAppDispatch()
  const arrivals = useAppSelector(selectAllArchivedArrivals)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [unarchiveModalOpen, setUnarchiveModalOpen] = useState(false)
  const [selectedArrivalId, setSelectedArrivalId] = useState<string | null>(null)

  const fetchAllArchivedArrivals = useCallback(async () => {
    await dispatch(fetchArchivedArrivals())
  }, [dispatch])

  useEffect(() => {
    void dispatch(fetchArchivedArrivals())
  }, [dispatch])

  const handleClose = () => {
    setIsOpen(false)
    setDeleteModalOpen(false)
    setUnarchiveModalOpen(false)
  }

  const handleDeleteClick = (arrivalId: string) => {
    setSelectedArrivalId(arrivalId)
    setDeleteModalOpen(true)
  }

  const handleUnarchiveClick = (arrivalId: string) => {
    setSelectedArrivalId(arrivalId)
    setUnarchiveModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      if (selectedArrivalId) {
        await dispatch(deleteArrival(selectedArrivalId))
        await fetchAllArchivedArrivals()
        toast.success('Поставка успешно удалена.')
      }
    } catch (e) {
      toast.error('Ошибка при удалении поставки.')
      console.error(e)
    } finally {
      handleClose()
    }
  }

  const handleConfirmUnarchive = async () => {
    try {
      if (selectedArrivalId) {
        await dispatch(unarchiveArrival(selectedArrivalId))
        await fetchAllArchivedArrivals()
        toast.success('Поставка успешно восстановлена!')
      }
    } catch (e) {
      toast.error('Ошибка при восстановлении поставки.')
      console.error(e)
    } finally {
      handleClose()
    }
  }

  return {
    arrivals,
    handleDeleteClick,
    handleConfirmDelete,
    handleUnarchiveClick,
    handleConfirmUnarchive,
    isOpen,
    deleteModalOpen,
    unarchiveModalOpen,
    handleClose,
  }
}
