import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchOrder, selectPopulateOrder } from '../../../store/slices/orderSlice.ts'
import { deleteOrder, fetchOrderByIdWithPopulate } from '../../../store/thunks/orderThunk.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { DefectMutation, OrderWithProductsAndClients } from '../../../types'
import { toast } from 'react-toastify'

export const useOrderDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const order = useAppSelector(selectPopulateOrder)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [defects, setDefects] = useState<DefectMutation[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdWithPopulate(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (order && order.client) {
      setDefects(mapDefectsWithProductNames(order))
    }
  }, [dispatch, order])

  const mapDefectsWithProductNames = (order: OrderWithProductsAndClients): DefectMutation[] => {
    if (!order || !order.defects) return []

    return order.defects.map(defect => {
      const product = order.products.find(p => p.product._id === defect.product)
      return {
        ...defect,
        productName: product ? product.product.title : 'Неизвестный продукт',
      }
    })
  }

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

  return {
    order,
    defects,
    loading,
    tabValue,
    open,
    setTabValue,
    handleDelete,
    handleOpenEdit,
    setOpen,
    navigate,
  }
}
