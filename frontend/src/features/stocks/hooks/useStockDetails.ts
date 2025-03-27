import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useEffect, useState } from 'react'
import { deleteStock, fetchStockById } from '../../../store/thunks/stocksThunk.ts'
import { selectIsStocksLoading, selectOneStock } from '../../../store/slices/stocksSlice.ts'
import { toast } from 'react-toastify'
import { hasMessage } from '../../../utils/helpers.ts'

export const useStockDetails = () => {
  const { stockId } = useParams()
  const dispatch = useAppDispatch()
  const stock = useAppSelector(selectOneStock)
  const isLoading = useAppSelector(selectIsStocksLoading)
  const navigate = useNavigate()

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
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

  const handleDelete = async () => {
    if (stockId) {
      try {
        await dispatch(deleteStock(stockId)).unwrap()
        navigate('/stocks')
        toast.success('Склад успешно удалён!')
      } catch (e) {
        if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка удаления')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }

    hideDeleteModal()
  }

  const showDeleteModal = () => {
    setDeleteModalOpen(true)
  }

  const hideDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  return {
    stock,
    stockId,
    isLoading,
    stockColumns,
    deleteModalOpen,
    showDeleteModal,
    hideDeleteModal,
    handleDelete,
    navigateBack,
    editModalOpen,
    setEditModalOpen,
  }
}
