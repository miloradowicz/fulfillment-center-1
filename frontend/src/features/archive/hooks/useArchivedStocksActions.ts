import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useState } from 'react'
import {
  deleteStock,
  fetchArchivedStocks,
  unarchiveStock,
} from '@/store/thunks/stocksThunk.ts'
import {
  selectAllArchivedStocks, selectLoadingFetchArchivedStocks,
} from '@/store/slices/stocksSlice.ts'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'

const useArchivedStocksActions = () => {
  const dispatch = useAppDispatch()
  const stocks = useAppSelector(selectAllArchivedStocks)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [stockToActionId, setStockToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const loading = useAppSelector(selectLoadingFetchArchivedStocks)

  const deleteOneStock = async (id: string) => {
    try {
      await dispatch(deleteStock(id)).unwrap()
      await dispatch(fetchArchivedStocks())
      toast.success('Склад успешно удален!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить склад')
      }
      console.error(e)
    }
  }

  const unarchiveOneStock = async (id: string) => {
    try {
      await dispatch(unarchiveStock(id)).unwrap()
      await dispatch(fetchArchivedStocks())
      toast.success('Склад успешно восстановлен!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить склад')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setStockToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setStockToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!stockToActionId) return

    if (actionType === 'delete') {
      await deleteOneStock(stockToActionId)
    } else {
      await unarchiveOneStock(stockToActionId)
    }

    handleConfirmationClose()
  }

  return {
    stocks,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}

export default useArchivedStocksActions
