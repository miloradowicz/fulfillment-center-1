import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { Product, StockWriteOffMutation, WriteOff } from '@/types'
import { toast } from 'react-toastify'
import { fetchClients } from '@/store/thunks/clientThunk.ts'
import { fetchProductsByClientId } from '@/store/thunks/productThunk.ts'
import { selectAllClients } from '@/store/slices/clientSlice.ts'
import { selectAllProducts } from '@/store/slices/productSlice.ts'
import { selectCreateError, selectLoadingAddArrival } from '@/store/slices/arrivalSlice.ts'
import { addWriteOff, fetchStockById, fetchStocks } from '@/store/thunks/stocksThunk.ts'
import { selectAllStocks, selectOneStock } from '@/store/slices/stocksSlice.ts'
import { ErrorMessagesList } from '@/messages.ts'
import { PopoverType } from '@/components/CustomSelect/CustomSelect.tsx'
import { ErrorMessages, StockWriteOffData } from '../utils/writeOffTypes'
import { initialErrorState, initialItemState, initialState } from '../state/writeOffState'

export const useWriteOffForm = (initialData?: Partial<StockWriteOffData>, onSuccess?: () => void) => {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const clientProducts = useAppSelector(selectAllProducts)
  const stocks = useAppSelector(selectAllStocks)
  const error = useAppSelector(selectCreateError)
  const isLoading = useAppSelector(selectLoadingAddArrival)
  const stock = useAppSelector(selectOneStock)

  const [form, setForm] = useState<StockWriteOffMutation>(
    {
      client: initialData?.client?._id ?? initialState.client,
      stock: initialData?.stock?._id ?? initialState.stock,
      write_offs: initialData?.write_offs ?? initialState.write_offs,
    },
  )

  const [writeOffsForm, setWriteOffsForm] = useState<WriteOff[]>((initialData?.write_offs as WriteOff[]) || [])

  const [newItem, setNewItem] = useState<WriteOff>({ ...initialItemState })
  const [errors, setErrors] = useState<ErrorMessages>({ ...initialErrorState })
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [activePopover, setActivePopover] = useState<PopoverType>(null)

  const [writeOffsModalOpen, setWriteOffsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchStocks())

    if (form.client) {
      dispatch(fetchProductsByClientId(form.client))
    }
  }, [dispatch, form.client])

  useEffect(() => {
    if (clientProducts && stock?.products) {
      const stockProducts = stock.products.map(x => ({ ...x, product: { ...x.product, client: x.product._id } }))
      const availableProducts = clientProducts.filter(x => stockProducts.some(y => x._id === y.product._id))
      setAvailableProducts(availableProducts)
    }
  }, [clientProducts, stock])

  const openModal = () => {
    setWriteOffsModalOpen(true)
  }

  const addItem = () => {
    const baseItem = {
      product: newItem.product,
      amount: Number(newItem.amount),
      reason: (newItem as WriteOff).reason,
    }

    if (baseItem.amount <= 0 || !(baseItem as WriteOff).reason) {
      toast.warn('Заполните все обязательные поля.')
      return
    }

    setWriteOffsForm(prev => [...prev, baseItem as WriteOff])
    setWriteOffsModalOpen(false)

    setNewItem({ ...initialItemState })
  }

  const deleteItem = <T>(index: number, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleBlur = (field: keyof ErrorMessages, value: string | number) => {
    const errorMessages: ErrorMessages = {
      product: !value ? ErrorMessagesList.ProductErr : ErrorMessagesList.Default,
      amount: Number(value) <= 0 ? ErrorMessagesList.Amount : ErrorMessagesList.Default,
      reason: !value ? ErrorMessagesList.WriteOffReason : ErrorMessagesList.Default,
      client: !value ? ErrorMessagesList.ClientErr : ErrorMessagesList.Default,
      stock: !value ? ErrorMessagesList.StockErr : ErrorMessagesList.Default,
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessages[field] || '',
    }))
  }

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.values(errors).filter(Boolean).length) {
      toast.error('Заполните все обязательные поля.')
      return
    }

    if (writeOffsForm.length === 0) {
      toast.error('Добавьте списанные товары.')
      return
    }

    try {
      const updatedForm = {
        ...form,
        write_offs: writeOffsForm,
      }

      await dispatch(addWriteOff(updatedForm)).unwrap()
      toast.success('Списание успешно добавлено!')
      await dispatch(fetchStocks())
      await dispatch(fetchStockById(updatedForm.stock))

      setForm({ ...initialState })
      setWriteOffsForm([])

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        return error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error((error as { message: string }).message)
      } else if (typeof error === 'string') {
        toast.error(error)
      }
    }
  }

  return {
    products: clientProducts,
    isLoading,
    form,
    setForm,
    newItem,
    setNewItem,
    errors,
    defectsForm: writeOffsForm,
    setDefectForm: setWriteOffsForm,
    writeOffsModalOpen,
    setDefectsModalOpen: setWriteOffsModalOpen,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    error,
    submitFormHandler,
    clients,
    stocks,
    availableItem: availableProducts,
    activePopover,
    setActivePopover,
  }
}
