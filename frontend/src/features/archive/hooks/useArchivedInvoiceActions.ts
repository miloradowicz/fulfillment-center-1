import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import {  useEffect, useState } from 'react'
import { Invoice } from '@/types'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import {
  selectAllArchivedInvoices, selectLoadingFetchArchiveInvoice,
} from '@/store/slices/invoiceSlice.ts'
import { deleteInvoice, fetchArchivedInvoices, unarchiveInvoice } from '@/store/thunks/invoiceThunk.ts'

const useArchivedInvoiceActions = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [invoiceToActionId, setInvoiceToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const invoices = useAppSelector(selectAllArchivedInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const loading = useAppSelector(selectLoadingFetchArchiveInvoice)
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')

  useEffect(() => {
    if (tab === 'invoices') {
      const fetchData = async () => {
        await dispatch(fetchArchivedInvoices())
      }
      void fetchData()
    }
  }, [dispatch, tab])

  const deleteOneInvoice = async (id: string) => {
    try {
      await dispatch(deleteInvoice(id)).unwrap()
      await dispatch(fetchArchivedInvoices())
      toast.success('Счет успешно удален!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить счет')
      }
      console.error(e)
    }
  }

  const unarchiveOneInvoice = async (id: string) => {
    try {
      await dispatch(unarchiveInvoice(id)).unwrap()
      await dispatch(fetchArchivedInvoices())
      toast.success('Счет успешно восстановлен!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить счет')
      }
      console.error(e)
    }
  }

  const handleOpen = (invoice?: Invoice) => {
    if (invoice) {
      setSelectedInvoice(invoice)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setInvoiceToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setInvoiceToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!invoiceToActionId) return

    if (actionType === 'delete') {
      await deleteOneInvoice(invoiceToActionId)
    } else {
      await unarchiveOneInvoice(invoiceToActionId)
    }

    handleConfirmationClose()
  }

  return {
    invoices,
    selectedInvoice,
    open,
    handleOpen,
    handleClose,
    id,
    navigate,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
    invoiceToActionId,
    loading,
  }
}

export default useArchivedInvoiceActions
