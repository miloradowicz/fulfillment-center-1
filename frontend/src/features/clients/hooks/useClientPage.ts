import { useAppSelector } from '../../../app/hooks.ts'
import { useState } from 'react'
import { selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'

export const useClientPage = () => {
  const [open, setOpen] = useState(false)
  const isLoading = useAppSelector(selectLoadingFetchClient)

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
