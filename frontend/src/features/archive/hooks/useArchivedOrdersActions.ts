import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { deleteOrder, unarchiveOrder, fetchArchivedOrders } from '@/store/thunks/orderThunk.ts'
import { toast } from 'react-toastify'
import { selectAllArchivedOrders, selectLoadingFetchArchivedOrders } from '@/store/slices/orderSlice.ts'
import { OrderWithClient } from '@/types'

export const useArchivedOrdersActions = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectAllArchivedOrders) as OrderWithClient[] | null
  const isLoading = useAppSelector(selectLoadingFetchArchivedOrders)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [unarchiveModalOpen, setUnarchiveModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!orders && !isLoading) {
      dispatch(fetchArchivedOrders())
    }
  }, [dispatch, orders, isLoading])

  const handleDeleteClick = useCallback((orderId: string) => {
    setSelectedOrderId(orderId)
    setDeleteModalOpen(true)
  }, [])

  const handleUnarchiveClick = useCallback((orderId: string) => {
    setSelectedOrderId(orderId)
    setUnarchiveModalOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedOrderId) return
    try {
      await dispatch(deleteOrder(selectedOrderId)).unwrap()
      await dispatch(fetchArchivedOrders())
      toast.success('Заказ успешно удалён')
    } catch (error) {
      toast.error('Ошибка при удалении заказа')
      console.error(error)
    } finally {
      setDeleteModalOpen(false)
    }
  }, [dispatch, selectedOrderId])

  const handleConfirmUnarchive = useCallback(async () => {
    if (!selectedOrderId) return
    try {
      await dispatch(unarchiveOrder(selectedOrderId)).unwrap()
      await dispatch(fetchArchivedOrders())
      toast.success('Заказ успешно восстановлен')
    } catch (error) {
      toast.error('Ошибка при восстановлении заказа')
      console.error(error)
    } finally {
      setUnarchiveModalOpen(false)
    }
  }, [dispatch, selectedOrderId])

  const handleCloseModals = useCallback(() => {
    setDeleteModalOpen(false)
    setUnarchiveModalOpen(false)
  }, [])

  return {
    orders,
    isLoading,
    deleteModalOpen,
    unarchiveModalOpen,
    handleDeleteClick,
    handleUnarchiveClick,
    handleConfirmDelete,
    handleConfirmUnarchive,
    handleClose: handleCloseModals,
  }
}
