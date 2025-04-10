import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import {
  clearErrorOrder,
  clearPopulateOrder,
  selectAllOrdersWithClient,
  selectLoadingFetchOrder,
} from '@/store/slices/orderSlice.ts'
import { deleteOrder, fetchOrderByIdWithPopulate, fetchOrdersWithClient } from '@/store/thunks/orderThunk.ts'
import { toast } from 'react-toastify'
import { OrderWithClient } from '@/types'

const UseOrderPage = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectAllOrdersWithClient)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [open, setOpen] = useState(false)
  const [counterpartyToDelete, setCounterpartyToDelete] = useState<OrderWithClient | null>(null)

  useEffect(() => {
    dispatch(fetchOrdersWithClient())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteOrder(id))
      dispatch(fetchOrdersWithClient())
      toast.success('Заказ успешно удалён!')
    } catch (e) {
      toast.error('Ошибка при удалении заказа.')
      console.error(e)
    }
  }

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    dispatch(clearPopulateOrder())
    dispatch(clearErrorOrder())
  }

  const handleOpenEdit = async (order: OrderWithClient) => {
    await dispatch(fetchOrderByIdWithPopulate(order._id))
    setOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (counterpartyToDelete) {
      await dispatch(deleteOrder(counterpartyToDelete._id))
      dispatch(fetchOrdersWithClient())
      handleClose()
    }
  }

  return {
    orders,
    open,
    handleOpen,
    loading,
    handleClose,
    handleDelete,
    handleOpenEdit,
    setCounterpartyToDelete,
    handleConfirmDelete,
  }
}

export default UseOrderPage
