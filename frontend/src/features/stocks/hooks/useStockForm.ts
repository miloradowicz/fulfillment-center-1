import { initialErrorState, initialProductState, initialState } from '../state/stockState.ts'
import React, { useEffect, useState } from 'react'
import { ProductStock, ProductWithPopulate, StockError, StockMutation, StockPopulate } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { selectIsStockCreating, selectStockCreateError } from '../../../store/slices/stocksSlice.ts'
import { fetchProducts } from '../../../store/thunks/productThunk.ts'
import { toast } from 'react-toastify'
import { addStock, fetchStockById, fetchStocks, updateStock } from '../../../store/thunks/stocksThunk.ts'

export const useStockForm = (initialData?: StockPopulate, onSuccess?: () => void) => {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectAllProducts)
  const error = useAppSelector(selectStockCreateError)
  const isLoading = useAppSelector(selectIsStockCreating)

  const [form, setForm] = useState<StockMutation>(
    initialData
      ? {
        ...initialData,
        products: [],
      }
      : { ...initialState },
  )

  const [productsForm, setProductsForm] = useState<ProductStock[]>(
    initialData?.products
      ? initialData.products.map(p => ({
        product: (p.product as ProductWithPopulate)._id,
        description: p.description,
        amount: p.amount,
      }))
      : [],
  )

  const [newItem, setNewItem] = useState<ProductStock>({ ...initialProductState })
  const [errors, setErrors] = useState<StockError>({ ...initialErrorState })
  const [productsModalOpen, setProductsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const openModal = () => {
    setNewItem({ ...initialProductState })
    setProductsModalOpen(true)
  }

  const addItem = () => {
    if (!newItem.product || newItem.amount <= 0) {
      toast.warn('Заполните все обязательные поля.')
      return
    }

    setProductsForm(prev => [...prev, newItem])
    setProductsModalOpen(false)
    setNewItem({ ...initialProductState })
  }

  const deleteItem = (index: number) => {
    setProductsForm(prev => prev.filter((_, i) => i !== index))
  }

  const handleBlur = (field: keyof StockError, value: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: !value ? 'Это поле обязательно для заполнения' : '',
    }))
  }

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.address) {
      toast.error('Заполните обязательные поля.')
      return
    }

    const payload = {
      ...form,
      products: productsForm.map(p => ({
        product: p.product,
        description: p.description,
        amount: p.amount,
      })),
    }

    try {
      if (initialData) {
        await dispatch(updateStock({ stockId: initialData._id, stock: payload })).unwrap()
        onSuccess?.()
        toast.success('Склад успешно обновлен!')
        await dispatch(fetchStockById(initialData._id))
      } else {
        await dispatch(addStock(payload)).unwrap()
        await dispatch(fetchStocks())
        toast.success('Склад успешно создан!')
      }

      setForm({ ...initialState })
      setProductsForm([])
    } catch (e) {
      console.error(e)
    }
  }

  return {
    products,
    isLoading,
    form,
    setForm,
    newItem,
    setNewItem,
    errors,
    productsForm,
    productsModalOpen,
    setProductsModalOpen,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    error,
    submitFormHandler,
  }
}
