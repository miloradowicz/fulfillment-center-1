import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import {
  deleteStock,
  fetchArchivedStocks,
  unarchiveStock,
} from '../../../store/thunks/stocksThunk.ts'
import {
  clearStockError,
  selectAllArchivedStocks,
  selectOneArchivedStock,
  selectStockError,
  selectLoadingFetchArchivedStocks,
} from '../../../store/slices/stocksSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { hasMessage, isGlobalError } from '../../../utils/helpers.ts'
import { Stock } from '../../../types'

const useArchivedStocksActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [stockToDeleteId, setStockToDeleteId] = useState<string | null>(null)

  const [unarchiveConfirmationOpen, setUnarchiveConfirmationOpen] = useState(false)
  const [stockToUnarchiveId, setStockToUnarchiveId] = useState<string | null>(null)

  const stocks = useAppSelector(selectAllArchivedStocks)
  const { id } = useParams()
  const stock = useAppSelector(selectOneArchivedStock)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const error = useAppSelector(selectStockError)
  const loading = useAppSelector(selectLoadingFetchArchivedStocks)
  const navigate = useNavigate()

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

  const handleUnarchiveStock = async (id: string) => {
    try {
      await dispatch(unarchiveStock(id)).unwrap()
      toast.success('Склад успешно восстановлен!')
      await fetchAllArchivedStocks()
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Ошибка при восстановлении склада')
      }
    }
  }

  const deleteOneStock = async (id: string) => {
    try {
      await dispatch(deleteStock(id)).unwrap()
      if (fetchOnDelete) {
        await fetchAllArchivedStocks()
      } else {
        navigate('/stocks')
      }
      toast.success('Склад успешно удалён!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить склад')
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
    clearErrors()
  }

  const handleConfirmationOpen = (id: string) => {
    setStockToDeleteId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setStockToDeleteId(null)
  }

  const handleConfirmationDelete = () => {
    if (stockToDeleteId) deleteOneStock(stockToDeleteId)
    handleConfirmationClose()
  }

  const handleUnarchiveConfirmationOpen = (id: string) => {
    setStockToUnarchiveId(id)
    setUnarchiveConfirmationOpen(true)
  }

  const handleUnarchiveConfirmationClose = () => {
    setUnarchiveConfirmationOpen(false)
    setStockToUnarchiveId(null)
  }

  const handleUnarchiveConfirm = async () => {
    if (stockToUnarchiveId) {
      await handleUnarchiveStock(stockToUnarchiveId)
    }
    handleUnarchiveConfirmationClose()
  }

  return {
    stocks,
    stock,
    selectedStock,
    open,
    confirmationOpen,
    unarchiveConfirmationOpen,
    error,
    loading,
    id,
    navigate,
    handleUnarchiveStock,
    deleteOneStock,
    handleOpen,
    handleClose,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    handleUnarchiveConfirmationOpen,
    handleUnarchiveConfirmationClose,
    handleUnarchiveConfirm,
  }
}

export default useArchivedStocksActions
