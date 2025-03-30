import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectLoadingFetchOrder, selectOrder } from '../../../store/slices/orderSlice.ts'
import { fetchOrderById, fetchOrderByIdWithPopulate } from '../../../store/thunks/orderThunk.ts'
import { useParams } from 'react-router-dom'
import { fetchClientById } from '../../../store/thunks/clientThunk.ts'
import { selectClient } from '../../../store/slices/clientSlice.ts'
import { DefectMutation, OrderWithProducts } from '../../../types'

export const useOrderDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const order = useAppSelector(selectOrder)
  const client = useAppSelector(selectClient)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [defects, setDefects] = useState<DefectMutation[]>([])

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id))
      dispatch(fetchOrderByIdWithPopulate(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (order && order.client) {
      dispatch(fetchClientById(order.client))
      setDefects(mapDefectsWithProductNames(order))
    }
  }, [dispatch, order])

  const mapDefectsWithProductNames = (order: OrderWithProducts): DefectMutation[] => {
    if (!order || !order.defects) return []

    return order.defects.map(defect => {
      const product = order.products.find(p => p.product._id === defect.product)
      return {
        ...defect,
        productName: product ? product.product.title : 'Неизвестный продукт',
      }
    })
  }

  return { order, client, defects, loading }
}
