import { useAppSelector } from '@/app/hooks'
import { useState } from 'react'
import { selectLoadingFetch } from '@/store/slices/invoiceSlice.ts'


export const useInvoicesPage = () => {
  const [open, setOpen] = useState(false)
  const loading = useAppSelector(selectLoadingFetch)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return {
    open,
    loading,
    handleOpen,
    handleClose,
  }
}
