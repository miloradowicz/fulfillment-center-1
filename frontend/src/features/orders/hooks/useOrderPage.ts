import  { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllOrdersWithClient, selectLoadingFetchOrder } from '../../../store/slices/orderSlice.ts'
import { deleteOrder, fetchOrdersWithClient } from '../../../store/thunks/orderThunk.ts'
import { fetchProductsWithPopulate } from '../../../store/thunks/productThunk.ts'
import { toast } from 'react-toastify'

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

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    dispatch(fetchProductsWithPopulate())
  }
  return {
    orders,
    open,
    handleOpen,
    loading,
    handleClose,
    handleDelete,
  }
}

export default UseOrderPage
