import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { clearErrorArrival, selectLoadingFetchArrival } from '../../../store/slices/arrivalSlice.ts'
import { useState, useCallback } from 'react'
import { ArrivalWithClient } from '../../../types'
import { fetchPopulatedArrivals } from '../../../store/thunks/arrivalThunk.ts'

export const useArrivalPage = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const isLoading = useAppSelector(selectLoadingFetchArrival)
  const [arrivalToEdit, setArrivalToEdit] = useState<ArrivalWithClient | undefined>(undefined)

  const fetchAllArrivals = useCallback(async () => {
    await dispatch(fetchPopulatedArrivals())
  }, [dispatch])

  const handleOpen = () => setOpen(true)

  const handleClose = async () => {
    setOpen(false)
    setArrivalToEdit(undefined)
    dispatch(clearErrorArrival())
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
    fetchAllArrivals,
  }
}
