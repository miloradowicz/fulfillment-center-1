import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import {
  deleteProduct,
  fetchProductByIdWithPopulate,
  fetchProductsWithPopulate,
} from '../../../store/thunks/productThunk.ts'
import { toast } from 'react-toastify'
import {
  clearErrorProduct,
  selectLoadingFetchProduct, selectProductError,
  selectProductsWithPopulate,
  selectProductWithPopulate,
} from '../../../store/slices/productSlice.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductWithPopulate } from '../../../types'
import { hasMessage, isGlobalError } from '../../../utils/helpers.ts'


const useProductActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null)
  const products = useAppSelector(selectProductsWithPopulate)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithPopulate | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const product = useAppSelector(selectProductWithPopulate)
  const loading = useAppSelector(selectLoadingFetchProduct)
  const error = useAppSelector(selectProductError)

  const clearErrors = useCallback(() => {
    dispatch(clearErrorProduct())
  }, [dispatch])

  const fetchAllProducts = useCallback(async () => {
    await dispatch(fetchProductsWithPopulate())
  }, [dispatch])

  const fetchProduct = useCallback(async (id: string) => {
    await dispatch(fetchProductByIdWithPopulate(id))
  }, [dispatch])

  useEffect(() => {
    void clearErrors()
  }, [clearErrors])

  useEffect(() => {
    void fetchAllProducts()
  }, [fetchAllProducts])

  useEffect(() => {
    if (id) {
      void fetchProduct(id)
    }
  }, [id, fetchProduct])

  const deleteOneProduct = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap()
      if (fetchOnDelete) {
        await fetchAllProducts()
      } else {
        navigate('/products')
      }
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

  return {
    products,
    product,
    selectedProduct,
    deleteOneProduct,
    fetchAllProducts,
    fetchProduct,
    open,
    handleOpen,
    handleClose,
    id,
    navigate,
    loading,
    error,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    productToDeleteId,
  }
}

export default useProductActions
