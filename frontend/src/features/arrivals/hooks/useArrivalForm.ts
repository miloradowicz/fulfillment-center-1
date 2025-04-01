import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  ArrivalMutation,
  ArrivalWithClient,
  ArrivalWithPopulate,
  Defect,
  ErrorsFields,
  Product,
  ProductArrival,
} from '../../../types'
import { initialErrorState, initialItemState, initialState } from '../state/arrivalState'
import { toast } from 'react-toastify'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import { fetchProductsByClientId } from '../../../store/thunks/productThunk.ts'
import {
  addArrival,
  fetchArrivalByIdWithPopulate,
  fetchPopulatedArrivals,
  updateArrival,
} from '../../../store/thunks/arrivalThunk.ts'
import { selectAllClients } from '../../../store/slices/clientSlice.ts'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { selectCreateError, selectLoadingAddArrival } from '../../../store/slices/arrivalSlice.ts'
import dayjs from 'dayjs'
import { fetchStocks } from '../../../store/thunks/stocksThunk.ts'
import { selectAllStocks } from '../../../store/slices/stocksSlice.ts'
import { getAvailableItems } from '../../../utils/getAvailableItems.ts'
import { selectAllCounterparties } from '../../../store/slices/counterpartySlices.ts'
import { fetchCounterparties } from '../../../store/thunks/counterpartyThunk.ts'
import { ErrorMessagesList } from '../../../messages.ts'
import { ItemType } from '../../../constants.ts'

export type ArrivalData = ArrivalWithClient | ArrivalWithPopulate

type ErrorMessages = Pick<
  ErrorsFields,
  'client'
  | 'product'
  | 'arrival_date'
  | 'amount'
  | 'stock'
  | 'defect_description'
  | 'arrival_status'
  | 'arrival_price'
>

export const useArrivalForm = (initialData?: ArrivalData, onSuccess?: () => void) => {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const products = useAppSelector(selectAllProducts)
  const stocks = useAppSelector(selectAllStocks)
  const counterparties = useAppSelector(selectAllCounterparties)
  const error = useAppSelector(selectCreateError)
  const isLoading = useAppSelector(selectLoadingAddArrival)
  const status = ['ожидается доставка', 'получена', 'отсортирована']

  const [form, setForm] = useState<ArrivalMutation>(
    initialData
      ? {
        client: initialData.client._id,
        arrival_date: dayjs(initialData.arrival_date).format('YYYY-MM-DD'),
        arrival_price: initialData.arrival_price,
        sent_amount: initialData.sent_amount,
        stock: initialData.stock._id,
        shipping_agent: initialData.shipping_agent?._id || '',
        pickup_location: initialData.pickup_location,
        products: [],
        defects: [],
        received_amount: [],
        arrival_status: initialData.arrival_status,
        documents: [],
      }
      : { ...initialState },
  )

  const normalizeProductField = <T extends { product: string | { _id: string } }>(items?: T[]): T[] =>
    items?.map(item => ({
      ...item,
      product: typeof item.product === 'string' ? item.product : item.product._id,
    })) || []

  const [productsForm, setProductsForm] = useState<ProductArrival[]>(
    normalizeProductField((initialData?.products as ProductArrival[]) || []),
  )
  const [receivedForm, setReceivedForm] = useState<ProductArrival[]>(
    normalizeProductField((initialData?.received_amount as ProductArrival[]) || []),
  )
  const [defectsForm, setDefectForm] = useState<Defect[]>(
    normalizeProductField((initialData?.defects as Defect[]) || []),
  )

  const [newItem, setNewItem] = useState<ProductArrival | Defect>({ ...initialItemState })
  const [errors, setErrors] = useState<ErrorMessages>({ ...initialErrorState })
  const [availableItem, setAvailableItem] = useState<Product[]>([])
  const [files, setFiles] = useState<File[]>([])

  const [productsModalOpen, setProductsModalOpen] = useState(false)
  const [receivedModalOpen, setReceivedModalOpen] = useState(false)
  const [defectsModalOpen, setDefectsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchStocks())
    dispatch(fetchCounterparties())
    if (form.client) {
      dispatch(fetchProductsByClientId(form.client))
    }
  }, [dispatch, form.client])

  useEffect(() => {
    if (productsForm.length !== 0 && products) {
      const sentProducts = productsForm
        .map(item => products.find(p => p._id === item.product))
        .filter((p): p is Product => p !== undefined)

      getAvailableItems(
        products,
        sentProducts.map(product => ({ product })),
        availableItem,
        setAvailableItem,
        '_id',
      )
    }
  }, [productsForm, products, availableItem])

  const openModal = (type: ItemType, initialState: ProductArrival | Defect) => {
    setNewItem(initialState)

    const modalSetters = {
      products: setProductsModalOpen,
      received_amount: setReceivedModalOpen,
      defects: setDefectsModalOpen,
    }

    Object.values(modalSetters).forEach(setter => setter(false))
    modalSetters[type](true)
  }

  const addItem = (type: ItemType) => {
    const baseItem = {
      product: newItem.product,
      amount: Number(newItem.amount),
      ...(type !== ItemType.DEFECTS && { description: (newItem as ProductArrival).description }),
      ...(type === ItemType.DEFECTS && { defect_description: (newItem as Defect).defect_description }),
    }

    if (!baseItem.product || baseItem.amount <= 0 || (type === 'defects' && !(baseItem as Defect).defect_description)) {
      toast.warn('Заполните все обязательные поля.')
      return
    }

    switch (type) {
    case ItemType.PRODUCTS:
      setProductsForm(prev => [...prev, baseItem as ProductArrival])
      setProductsModalOpen(false)
      break
    case ItemType.RECEIVED_AMOUNT:
      setReceivedForm(prev => [...prev, baseItem as ProductArrival])
      setReceivedModalOpen(false)
      break
    case ItemType.DEFECTS:
      setDefectForm(prev => [...prev, baseItem as Defect])
      setDefectsModalOpen(false)
      break
    }

    setNewItem({ ...initialItemState })
  }

  const deleteItem = <T>(index: number, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleBlur = (field: keyof ErrorMessages, value: string | number) => {
    const errorMessages: ErrorMessages = {
      product: !value ? ErrorMessagesList.ProductErr : ErrorMessagesList.Default,
      amount: Number(value) <= 0 ? ErrorMessagesList.Amount : ErrorMessagesList.Default,
      defect_description: !value ? ErrorMessagesList.DefectDescription : ErrorMessagesList.Default,
      client: !value ? ErrorMessagesList.ClientErr : ErrorMessagesList.Default,
      arrival_date: !value ? ErrorMessagesList.ArrivalDate : ErrorMessagesList.Default,
      stock: !value ? ErrorMessagesList.StockErr : ErrorMessagesList.Default,
      arrival_price: Number(value) <= 0 ? ErrorMessagesList.ArrivalPrice : ErrorMessagesList.Default,
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessages[field] || '',
    }))
  }


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selectedFiles = Array.from(e.target.files)
    const maxFileSize = 10 * 1024 * 1024

    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxFileSize) {
        toast.warn(`Файл "${ file.name }" слишком большой (макс. 10MB)`)
        return false
      }
      return true
    })

    setFiles(prevFiles => [...prevFiles, ...validFiles])
  }

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.values(errors).filter(Boolean).length) {
      toast.error('Заполните все обязательные поля.')
      return
    }

    if (productsForm.length === 0) {
      toast.error('Добавьте отправленные товары.')
      return
    }

    try {
      const updatedForm = {
        ...form,
        products: productsForm,
        received_amount: receivedForm,
        defects: defectsForm,
        files: files || [],
        shipping_agent: form.shipping_agent || null,
      }

      if (initialData) {
        await dispatch(updateArrival({ arrivalId: initialData._id, data: { ...updatedForm, files } })).unwrap()
        onSuccess?.()
        await dispatch(fetchArrivalByIdWithPopulate(initialData._id))
        toast.success('Поставка успешно обновлена!')
      } else {
        await dispatch(addArrival(updatedForm)).unwrap()
        toast.success('Поставка успешно создана!')
        await dispatch(fetchPopulatedArrivals())
      }

      setForm({ ...initialState })
      setProductsForm([])
      setReceivedForm([])
      setDefectForm([])

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
    products,
    isLoading,
    form,
    setForm,
    newItem,
    setNewItem,
    errors,
    productsForm,
    setProductsForm,
    receivedForm,
    setReceivedForm,
    defectsForm,
    setDefectForm,
    productsModalOpen,
    setProductsModalOpen,
    receivedModalOpen,
    setReceivedModalOpen,
    defectsModalOpen,
    setDefectsModalOpen,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    error,
    submitFormHandler,
    status,
    clients,
    stocks,
    counterparties,
    availableItem,
    files,
    handleFileChange,
  }
}
