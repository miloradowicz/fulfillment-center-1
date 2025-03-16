import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import {
  deleteProduct,
  fetchProductByIdWithPopulate,
  fetchProductsWithPopulate,
} from '../../../store/thunks/productThunk.ts'
import { toast } from 'react-toastify'
import {
  selectLoadingFetchProduct, selectProductError,
  selectProductsWithPopulate,
  selectProductWithPopulate,
} from '../../../store/slices/productSlice.ts'
import { useNavigate, useParams } from 'react-router-dom'


const UseProductActions = ( fetchOnDelete: boolean ) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const products = useAppSelector(selectProductsWithPopulate)
  const { id } = useParams()
  const navigate = useNavigate()
  const product = useAppSelector(selectProductWithPopulate)
  const loading = useAppSelector(selectLoadingFetchProduct)
  const error = useAppSelector(selectProductError)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    dispatch(fetchProductsWithPopulate())
  }

  const fetchAllProducts = useCallback(() => {
    dispatch(fetchProductsWithPopulate())
  }, [dispatch])


  useEffect(() => {
    void fetchAllProducts()
  }, [dispatch, fetchAllProducts])

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdWithPopulate(id))
    }
  }, [dispatch, id])


  const deleteOneProduct = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
        await dispatch(deleteProduct(id))
        toast.success('Продукт успешно удален.')
        if (fetchOnDelete) {
          fetchAllProducts()
        } else {
          navigate('/products')
        }
      } else {
        toast.info('Вы отменили удаление продукта.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return  {
    products,
    product,
    deleteOneProduct,
    open,
    handleOpen,
    handleClose,
    id,
    navigate,
    loading,
    error }
}

export default UseProductActions
