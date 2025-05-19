import { useAppSelector } from '@/app/hooks'
import { useState } from 'react'
import { selectLoadingFetch } from '@/store/slices/invoiceSlice.ts'
import { InvoiceData } from '../types/invoiceTypes'
import { Invoice } from '@/types'


export const useInvoicesPage = () => {
  const [open, setOpen] = useState(false)
  const loading = useAppSelector(selectLoadingFetch)
  const [invoiceToEdit, setInvoiceToEdit] = useState<InvoiceData | undefined>(undefined)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenCreate = () => {
    setInvoiceToEdit(undefined)
    handleOpen()
  }

  const handleOpenEdit = (invoice: Invoice) => {
    setInvoiceToEdit({ ...invoice, associatedArrival: invoice.associatedArrival as unknown as string, associatedOrder: invoice.associatedOrder as unknown as string })
    handleOpen()
  }

  return {
    open,
    loading,
    handleOpenCreate,
    handleClose,
    handleOpenEdit,
    invoiceToEdit,
  }
}
