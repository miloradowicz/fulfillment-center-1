import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchOrder, selectPopulateOrder } from '../../../store/slices/orderSlice.ts'
import { deleteOrder, fetchOrderByIdWithPopulate } from '../../../store/thunks/orderThunk.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { OrderWithProductsAndClients } from '../../../types'
import dayjs from 'dayjs'

export const useOrderDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const order = useAppSelector(selectPopulateOrder)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [tabValue, setTabValue] = useState(0)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdWithPopulate(id))
    }
  }, [dispatch, id])

  const handleDelete = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        await dispatch(deleteOrder(id))
        navigate('/orders')
      } else {
        toast.info('Вы отменили удаление заказа')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpenEdit = () => {
    setOpen(true)
  }

  const navigateBack = () => {
    navigate(-1)
  }

  const getStepDescription = (index: number, order: OrderWithProductsAndClients) => {
    const descriptions = [
      'Товар собирается на складе',
      'Заказ отправлен заказчику',
      order.delivered_at ? `Дата доставки: ${ dayjs(order.delivered_at).format('D MMMM YYYY') }` : 'Ожидается доставка',
    ]
    return descriptions[index] || ''
  }

  return {
    order,
    loading,
    tabValue,
    open,
    setTabValue,
    handleDelete,
    handleOpenEdit,
    setOpen,
    navigateBack,
    getStepDescription,
  }
}
