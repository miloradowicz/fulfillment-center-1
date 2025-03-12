import { useAppSelector } from '../../../app/hooks.ts'
import { useState } from 'react'
import { selectLoadingFetchArrival } from '../../../store/slices/arrivalSlice.ts'

export const useArrivalPage = () => {
  const [open, setOpen] = useState(false)
  const isLoading = useAppSelector(selectLoadingFetchArrival)

  const handleOpen = () => setOpen(true)

  const handleClose = async () => {
    setOpen(false)
  }

  return {
    open,
    handleOpen,
    isLoading,
    handleClose,
  }
}
