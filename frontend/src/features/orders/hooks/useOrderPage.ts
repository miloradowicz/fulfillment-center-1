import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import {
  clearErrorOrder,
  clearPopulateOrder,
  selectAllOrdersWithClient,
  selectLoadingFetchOrder, selectOrderError,
} from '@/store/slices/orderSlice.ts'
import {
  archiveOrder, cancelOrder, fetchArchivedOrders,
  fetchOrderByIdWithPopulate,
  fetchOrdersWithClient,
} from '@/store/thunks/orderThunk.ts'
import { toast } from 'react-toastify'
import { OrderWithClient } from '@/types'
import { FormType } from '@/features/orders/state/orderState.ts'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'

const UseOrderPage = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectAllOrdersWithClient)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [open, setOpen] = useState(false)
  const [formType, setFormType] = useState<FormType>('order')
  const [counterpartyToDelete, setCounterpartyToDelete] = useState<OrderWithClient | null>(null)
  const [orderToEdit, setOrderToEdit] = useState<OrderWithClient | undefined>(undefined)
  const error = useAppSelector(selectOrderError)

  useEffect(() => {
    dispatch(fetchOrdersWithClient())
  }, [dispatch])

  const handleArchive = async (id: string) => {
    try {
      await dispatch(archiveOrder(id)).unwrap()
      dispatch(fetchOrdersWithClient())
      toast.success('Заказ успешно архивирован!')
      dispatch(fetchArchivedOrders())
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось архивировать заказ')
      }
      console.error(e)
    }
  }

  const handleCancelOrder = async (id: string) => {
    try {
      await dispatch(cancelOrder(id))
      dispatch(fetchOrdersWithClient())
      toast.success('Заказ успешно отменен!')
      dispatch(fetchArchivedOrders())
    } catch (e) {
      toast.error('Ошибка при отмене заказа.')
      console.error(e)
    }
  }

  const handleOpen = (type: FormType = 'order') => {
    setFormType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    dispatch(clearPopulateOrder())
    setOrderToEdit(undefined)
    dispatch(clearErrorOrder())
  }

  const handleOpenEdit = async (order: OrderWithClient) => {
    await dispatch(fetchOrderByIdWithPopulate(order._id))
    setOrderToEdit(order)
    handleOpen('order')
  }

  const handleConfirmArchive = async () => {
    if (counterpartyToDelete) {
      await dispatch(archiveOrder(counterpartyToDelete._id))
      dispatch(fetchOrdersWithClient())
      handleClose()
    }
  }

  return {
    orders,
    open,
    formType,
    handleOpen,
    loading,
    handleClose,
    handleArchive,
    handleOpenEdit,
    setCounterpartyToDelete,
    handleConfirmArchive,
    orderToEdit,
    handleCancelOrder,
    error,
  }
}

export default UseOrderPage
