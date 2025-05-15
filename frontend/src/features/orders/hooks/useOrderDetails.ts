import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectLoadingFetchOrder, selectPopulateOrder } from '@/store/slices/orderSlice.ts'
import { archiveOrder, cancelOrder, fetchOrderByIdWithPopulate } from '@/store/thunks/orderThunk.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'

export const useOrderDetails = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const order = useAppSelector(selectPopulateOrder)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [openArchiveModal, setOpenArchiveModal] = useState(false)
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false)
  const [tabs, setTabs] = useState(0)

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdWithPopulate(id))
    }
  }, [dispatch, id])

  const handleArchive = async () => {
    try {
      if (order) {
        await dispatch(archiveOrder(order._id)).unwrap()
        navigate('/orders')
        toast.success('Заказ успешно архивирован!')
      }
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось архивировать заказ')
      }
      console.error(e)
    }
    setOpenArchiveModal(false)
  }

  const handleCancel = async () => {
    try {
      if (order) {
        await dispatch(cancelOrder(order._id))
        navigate('/orders')
        toast.success('Заказ успешно отменен!')
      }
    } catch (e) {
      console.error(e)
      toast.error('Ошибка при отмене заказа')
    }
    setConfirmCancelModalOpen(false)
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
    handleCancel,
    setConfirmCancelModalOpen,
    confirmCancelModalOpen,
  }
}
