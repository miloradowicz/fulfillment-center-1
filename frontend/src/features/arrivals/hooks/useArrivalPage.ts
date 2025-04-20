import { useAppSelector } from '@/app/hooks.ts'
import { useState } from 'react'
import { clearErrorArrival, selectLoadingFetchArrival } from '@/store/slices/arrivalSlice.ts'
import { ArrivalWithClient } from '@/types'
import { useDispatch } from 'react-redux'
import { FormType } from '@/features/arrivals/state/arrivalState.ts'

export const useArrivalPage = () => {
  const [open, setOpen] = useState(false)
  const [formType, setFormType] = useState<FormType>('arrival')
  const isLoading = useAppSelector(selectLoadingFetchArrival)
  const [arrivalToEdit, setArrivalToEdit] = useState<ArrivalWithClient | undefined>(undefined)
  const dispatch = useDispatch()

  const handleOpen = (type: FormType = 'arrival') => {
    setFormType(type)
    setOpen(true)
  }

  const handleClose = async () => {
    setOpen(false)
    setArrivalToEdit(undefined)
    dispatch(clearErrorArrival())
  }

  const handleOpenEdit = (arrival: ArrivalWithClient) => {
    setArrivalToEdit(arrival)
    handleOpen('arrival')
  }

  return {
    open,
    formType,
    handleOpen,
    isLoading,
    handleClose,
    arrivalToEdit,
    handleOpenEdit,
  }
}
