import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useEffect, useState } from 'react'
import { archiveStock, fetchArchivedStocks, fetchStockById, fetchStocks } from '../../../store/thunks/stocksThunk.ts'
import { selectIsStocksLoading, selectOneStock } from '../../../store/slices/stocksSlice.ts'
import { toast } from 'react-toastify'
import { hasMessage } from '../../../utils/helpers.ts'

export const useStockDetails = () => {
  const { stockId } = useParams()
  const dispatch = useAppDispatch()
  const stock = useAppSelector(selectOneStock)
  const isLoading = useAppSelector(selectIsStocksLoading)
  const navigate = useNavigate()

  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  const stockColumns = [
    { field: 'client', headerName: 'Клиент', flex: 1 },
    { field: 'title', headerName: 'Наименование', flex: 1 },
    { field: 'amount', headerName: 'Количество', flex: 1 },
    { field: 'article', headerName: 'Артикул', flex: 1 },
    { field: 'barcode', headerName: 'Штрихкод', flex: 1 },
  ]

  useEffect(() => {
    if (stockId) {
      dispatch(fetchStockById(stockId))
    }
  }, [dispatch, stockId])

  const navigateBack = () => {
    navigate(-1)
  }

  const handleArchive = async () => {
    if (stockId) {
      try {
        await dispatch(archiveStock(stockId)).unwrap()
        await dispatch(fetchStocks())
        await dispatch(fetchArchivedStocks())
        toast.success('Склад успешно архивирован!')
        navigate('/stocks')
      } catch (e) {
        if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка архивирования')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }
    hideDeleteModal()
  }

  const showDeleteModal = () => {
    setArchiveModalOpen(true)
  }

  const hideDeleteModal = () => {
    setArchiveModalOpen(false)
  }

  return {
    stock,
    stockId,
    isLoading,
    stockColumns,
    archiveModalOpen,
    showDeleteModal,
    hideDeleteModal,
    handleArchive,
    navigateBack,
    editModalOpen,
    setEditModalOpen,
  }
}
