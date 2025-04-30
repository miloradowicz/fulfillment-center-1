import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import {
  deleteStock,
  fetchArchivedStocks,
  unarchiveStock,
} from '@/store/thunks/stocksThunk.ts'
import {
  clearStockError,
  selectAllArchivedStocks,
} from '@/store/slices/stocksSlice.ts'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import { Stock } from '@/types'

const useArchivedStocksActions = () => {
  const dispatch = useAppDispatch()
  const stocks = useAppSelector(selectAllArchivedStocks)
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [stockToActionId, setStockToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)



  const clearErrors = useCallback(() => {
    dispatch(clearStockError())
  }, [dispatch])

  const fetchAllArchivedStocks = useCallback(async () => {
    await dispatch(fetchArchivedStocks())
  }, [dispatch])

  useEffect(() => {
    void clearErrors()
  }, [clearErrors])

  useEffect(() => {
    if (!stocks) {
      void fetchAllArchivedStocks()
    }
  }, [fetchAllArchivedStocks, stocks])


  const deleteOneStock = async (id: string) => {
    try {
      await dispatch(deleteStock(id)).unwrap()
      await fetchAllArchivedStocks()
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
      await fetchAllArchivedStocks()
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

  const handleOpen = (stock?: Stock) => {
    if (stock) {
      setSelectedStock(stock)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
    selectedStock,
    open,
    handleOpen,
    handleClose,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}

export default useArchivedStocksActions
