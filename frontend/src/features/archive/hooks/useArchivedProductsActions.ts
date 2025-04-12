import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import {
  deleteProduct,
  fetchArchivedProducts,
  unarchiveProduct,
} from '../../../store/thunks/productThunk.ts'
import { toast } from 'react-toastify'
import {
  clearErrorProduct, selectAllArchivedProducts, selectArchivedProduct, selectLoadingFetchArchivedProduct,
  selectProductError,
} from '../../../store/slices/productSlice.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductWithPopulate } from '../../../types'
import { hasMessage, isGlobalError } from '../../../utils/helpers.ts'


const useArchivedProductActions = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null)
  const products = useAppSelector(selectAllArchivedProducts)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithPopulate | null>(null)
  const [unarchiveConfirmationOpen, setUnarchiveConfirmationOpen] = useState(false)
  const [productToUnarchiveId, setProductToUnarchiveId] = useState<string | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const product = useAppSelector(selectArchivedProduct)
  const loading = useAppSelector(selectLoadingFetchArchivedProduct)
  const error = useAppSelector(selectProductError)

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

  const handleUnarchiveProduct = async (id: string) => {
    try {
      await dispatch(unarchiveProduct(id)).unwrap()
      toast.success('Продукт успешно восстановлен!')
      fetchArchivedProducts()
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Ошибка при восстановлении продукта')
      }
    }
  }

  const deleteOneProduct = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap()
      await dispatch(fetchArchivedProducts())
      toast.success('Товар успешно удалён!')
    } catch (e) {
      if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить товар')
      }
      console.error(e)
    }
  }

  const handleOpen = (product?: ProductWithPopulate) => {
    if (product) {
      setSelectedProduct(product)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    clearErrors()
  }

  const handleConfirmationOpen = (id: string) => {
    setProductToDeleteId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setProductToDeleteId(null)
  }

  const handleConfirmationDelete = async () => {
    if (productToDeleteId) await deleteOneProduct(productToDeleteId)
    handleConfirmationClose()
  }

  const handleUnarchiveConfirmationOpen = (id: string) => {
    setProductToUnarchiveId(id)
    setUnarchiveConfirmationOpen(true)
  }

  const handleUnarchiveConfirmationClose = () => {
    setUnarchiveConfirmationOpen(false)
    setProductToUnarchiveId(null)
  }

  const handleUnarchiveConfirm = async () => {
    if (productToUnarchiveId) {
      await handleUnarchiveProduct(productToUnarchiveId)
    }
    handleUnarchiveConfirmationClose()
  }

  return {
    products,
    product,
    selectedProduct,
    deleteOneProduct,
    fetchAllProducts,
    open,
    handleOpen,
    handleClose,
    id,
    navigate,
    loading,
    error,
    confirmationOpen,
    unarchiveConfirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    handleUnarchiveProduct,
    handleUnarchiveConfirmationOpen,
    handleUnarchiveConfirmationClose,
    handleUnarchiveConfirm,
    productToDeleteId,
  }
}

export default useArchivedProductActions
