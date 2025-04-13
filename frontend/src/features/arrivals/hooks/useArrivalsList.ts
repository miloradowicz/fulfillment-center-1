import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectPopulatedArrivals } from '@/store/slices/arrivalSlice.ts'
import { useEffect, useState } from 'react'
import { deleteArrival, fetchPopulatedArrivals } from '@/store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'

export const useArrivalsList = () => {
  const dispatch = useAppDispatch()
  const arrivals = useAppSelector(selectPopulatedArrivals)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedArrivalId, setSelectedArrivalId] = useState<string | null>(null)



  useEffect(() => {
    dispatch(fetchPopulatedArrivals())
  }, [dispatch])

  const handleClose = () => {
    setIsOpen(false)
    setDeleteModalOpen(false)
  }

  const handleDeleteClick = (arrivalId: string) => {
    setSelectedArrivalId(arrivalId)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      if (selectedArrivalId) {
        await dispatch(deleteArrival(selectedArrivalId))
        await dispatch(fetchPopulatedArrivals())
        toast.success('Поставка успешно удалена.')
      }
    } catch (e) {
      toast.error('Ошибка при удалении поставки.')
      console.error(e)
    } finally {
      handleClose()
    }
  }

  return {
    arrivals,
    handleDeleteClick,
    handleConfirmDelete,
    isOpen,
    deleteModalOpen,
    handleClose,
  }
}
