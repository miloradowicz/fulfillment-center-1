import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllOrdersWithClient, selectLoadingFetchOrder } from '../../../store/slices/orderSlice.ts'
import { deleteOrder, fetchOrderByIdWithPopulate, fetchOrdersWithClient } from '../../../store/thunks/orderThunk.ts'
import { toast } from 'react-toastify'
import { OrderWithClient } from '../../../types'

const UseOrderPage = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectAllOrdersWithClient)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchOrdersWithClient())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        await dispatch(deleteOrder(id))
        dispatch(fetchOrdersWithClient())
      } else {
        toast.info('Вы отменили удаление заказа')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpenEdit = async (order: OrderWithClient) => {
    await dispatch(fetchOrderByIdWithPopulate(order._id))
    setOpen(true)
  }
  const handleOpen = () => setOpen(true)

  const handleClose = async () => {
    await dispatch(fetchOrdersWithClient())
    setOpen(false)
  }

  return {
    orders,
    open,
    handleOpen,
    loading,
    handleClose,
    handleDelete,
    handleOpenEdit,
  }
}

export default UseOrderPage
