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


const UseProductActions = ( fetchOnDelete: boolean ) => {
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

  const handleOpen = (product?: ProductWithPopulate) => {
    if (product) {
      setSelectedProduct(product)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    dispatch(clearErrorProduct())
  }

  const fetchAllProducts = useCallback(() => {
    dispatch(fetchProductsWithPopulate())
  }, [dispatch])

  const fetchProduct = useCallback((id: string) => {
    dispatch(fetchProductByIdWithPopulate(id))
  }, [dispatch])


  useEffect(() => {
    void fetchAllProducts()
  }, [dispatch, fetchAllProducts])

  useEffect(() => {
    if (id) {
      void fetchProduct(id)
    }
  }, [dispatch, id, fetchProduct])


  const deleteOneProduct = async (id: string) => {
    try {
      await dispatch(deleteProduct(id))
      if (fetchOnDelete) {
        fetchAllProducts()
      } else {
        navigate('/products')
      }
      toast.success('Товар успешно удалён!')
    } catch (e) {
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string) => {
    setProductToDeleteId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setProductToDeleteId(null)
  }

  return  {
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
    productToDeleteId,
  }
}

export default UseProductActions
