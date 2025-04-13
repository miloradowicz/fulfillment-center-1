import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectPopulatedArrivals } from '@/store/slices/arrivalSlice.ts'
import { useCallback, useEffect, useState } from 'react'
import { archiveArrival, fetchPopulatedArrivals } from '@/store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'

export const useArrivalsList = () => {
  const dispatch = useAppDispatch()
  const arrivals = useAppSelector(selectPopulatedArrivals)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [archiveModalOpen, setArchiveModalOpen] = useState(false)
  const [selectedArrivalId, setSelectedArrivalId] = useState<string | null>(null)

  const fetchAllArrivals = useCallback(async () => {
    await dispatch(fetchPopulatedArrivals())
  }, [dispatch])

  useEffect(() => {
    void fetchAllArrivals()
  }, [dispatch, fetchAllArrivals])

  const handleClose = () => {
    setIsOpen(false)
    setArchiveModalOpen(false)
  }

  const handleArchiveClick = (arrivalId: string) => {
    setSelectedArrivalId(arrivalId)
    setArchiveModalOpen(true)
  }

  const handleConfirmArchive = async () => {
    try {
      if (selectedArrivalId) {
        await dispatch(archiveArrival(selectedArrivalId))
        await fetchAllArrivals()
        toast.success('Поставка успешно архивирована.')
      }
    } catch (e) {
      toast.error('Ошибка при архивировании поставки.')
      console.error(e)
    } finally {
      handleClose()
    }
  }

  return {
    arrivals,
    handleArchiveClick,
    handleConfirmArchive,
    isOpen,
    archiveModalOpen,
    handleClose,
  }
}
