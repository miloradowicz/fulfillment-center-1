import { useAppSelector } from '../../../app/hooks.ts'
import { useState } from 'react'
import { selectLoadingFetch } from '../../../store/slices/counterpartySlices.ts'

export const useCounterpartyPage = () => {
  const [open, setOpen] = useState(false)
  const isLoading = useAppSelector(selectLoadingFetch)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  return {
    open,
    handleOpen,
    isLoading,
    handleClose,
  }
}
