import { useAppSelector } from '../../../app/hooks.ts'
import { useState } from 'react'
import { selectLoadingFetchArrival } from '../../../store/slices/arrivalSlice.ts'
import { ArrivalWithClient } from '../../../types'

export const useArrivalPage = () => {
  const [open, setOpen] = useState(false)
  const isLoading = useAppSelector(selectLoadingFetchArrival)
  const [arrivalToEdit, setArrivalToEdit] = useState<ArrivalWithClient | undefined | null>(undefined)

  const handleOpen = () => setOpen(true)

  const handleClose = async () => {
    setOpen(false)
    setArrivalToEdit(undefined)
  }

  const handleOpenEdit = (arrival: ArrivalWithClient) => {
    setArrivalToEdit(arrival)
    handleOpen()
  }

  return {
    open,
    handleOpen,
    isLoading,
    handleClose,
    arrivalToEdit,
    handleOpenEdit,
  }
}
