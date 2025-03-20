import { useAppSelector } from '../../../app/hooks.ts'
import { useState } from 'react'
import { clearErrorArrival, selectLoadingFetchArrival } from '../../../store/slices/arrivalSlice.ts'
import { ArrivalWithPopulate } from '../../../types'
import { useDispatch } from 'react-redux'

export const useArrivalPage = () => {
  const [open, setOpen] = useState(false)
  const isLoading = useAppSelector(selectLoadingFetchArrival)
  const [arrivalToEdit, setArrivalToEdit] = useState<ArrivalWithPopulate | undefined>(undefined)
  const dispatch = useDispatch()

  const handleOpen = () => setOpen(true)

  const handleClose = async () => {
    setOpen(false)
    setArrivalToEdit(undefined)
    dispatch(clearErrorArrival())
  }

  const handleOpenEdit = (arrival: ArrivalWithPopulate) => {
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
