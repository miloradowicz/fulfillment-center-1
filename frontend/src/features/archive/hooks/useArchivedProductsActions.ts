import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import {
  deleteProduct,
  fetchArchivedProducts,
  unarchiveProduct,
} from '@/store/thunks/productThunk.ts'
import { toast } from 'react-toastify'
import {
  clearErrorProduct, selectAllArchivedProducts,
} from '@/store/slices/productSlice.ts'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'

const useArchivedProductActions = () => {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectAllArchivedProducts)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [productToActionId, setProductToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')

  const clearErrors = useCallback(() => {
    dispatch(clearErrorProduct())
  }, [dispatch])

  const fetchAllProducts = useCallback(async () => {
    await dispatch(fetchArchivedProducts())
  }, [dispatch])

  useEffect(() => {
    void clearErrors()
  }, [clearErrors])

  useEffect(() => {
    void fetchAllProducts()
  }, [fetchAllProducts])


  const deleteOneProduct = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap()
      await dispatch(fetchArchivedProducts())
      toast.success('Товар успешно удален!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить товар')
      }
      console.error(e)
    }
  }

  const unarchiveOneProduct = async (id: string) => {
    try {
      await dispatch(unarchiveProduct(id)).unwrap()
      fetchArchivedProducts()
      toast.success('Товар успешно восстановлен!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить товар')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setProductToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setProductToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!productToActionId) return

    if (actionType === 'delete') {
      await deleteOneProduct(productToActionId)
    } else {
      await unarchiveOneProduct(productToActionId)
    }

    handleConfirmationClose()
  }

  return {
    products,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}

export default useArchivedProductActions
