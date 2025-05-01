import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectLoadingFetchOrder, selectPopulateOrder } from '@/store/slices/orderSlice.ts'
import { archiveOrder, fetchOrderByIdWithPopulate } from '@/store/thunks/orderThunk.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export const useOrderDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const order = useAppSelector(selectPopulateOrder)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [openArchiveModal, setOpenArchiveModal] = useState(false)
  const [tabs, setTabs] = useState(0)

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdWithPopulate(id))
    }
  }, [dispatch, id])

  const handleArchive = async () => {
    try {
      if (order) {
        await dispatch(archiveOrder(order._id))
        navigate('/orders')
        toast.success('Заказ успешно архивирован!')
      }
    } catch (e) {
      console.error(e)
      toast.error('Ошибка при архивации заказа')
    }
    setOpenArchiveModal(false)
  }

  return {
    order,
    loading,
    open,
    openArchiveModal,
    handleArchive,
    setOpen,
    setOpenArchiveModal,
    tabs,
    setTabs,
  }
}
