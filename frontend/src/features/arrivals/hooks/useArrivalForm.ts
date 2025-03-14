import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { ArrivalError, ArrivalMutation, ArrivalWithClient, Defect, ProductArrival } from '../../../types'
import { initialErrorState, initialItemState, initialState } from '../state/arrivalState'
import { toast } from 'react-toastify'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import { fetchProductsByClientId } from '../../../store/thunks/productThunk.ts'
import { addArrival, fetchPopulatedArrivals, updateArrival } from '../../../store/thunks/arrivalThunk.ts'
import { selectAllClients } from '../../../store/slices/clientSlice.ts'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { selectCreateError, selectLoadingAddArrival } from '../../../store/slices/arrivalSlice.ts'
import dayjs from 'dayjs'

export const useArrivalForm = (initialData?: ArrivalWithClient, onSuccess?: () => void) => {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const products = useAppSelector(selectAllProducts)
  const error = useAppSelector(selectCreateError)
  const isLoading = useAppSelector(selectLoadingAddArrival)

  const [form, setForm] = useState<ArrivalMutation>(
    initialData
      ? {
        client: initialData.client._id,
        arrival_date: dayjs(initialData.arrival_date).format('YYYY-MM-DD'),
        arrival_price: initialData.arrival_price,
        sent_amount: initialData.sent_amount,
        products: [],
        defects: [],
        received_amount: [],
      }
      : { ...initialState },
  )

  const [productsForm, setProductsForm] = useState<ProductArrival[]>(initialData?.products || [])
  const [receivedForm, setReceivedForm] = useState<ProductArrival[]>(initialData?.received_amount || [])
  const [defectsForm, setDefectForm] = useState<Defect[]>(initialData?.defects || [])

  const [newItem, setNewItem] = useState<ProductArrival | Defect>({ ...initialItemState })
  const [errors, setErrors] = useState<ArrivalError>({ ...initialErrorState })

  const [productsModalOpen, setProductsModalOpen] = useState(false)
  const [receivedModalOpen, setReceivedModalOpen] = useState(false)
  const [defectsModalOpen, setDefectsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchClients())
    if (form.client) {
      dispatch(fetchProductsByClientId(form.client))
    }
  }, [dispatch, form.client])

  const openModal = (type: 'products' | 'received_amount' | 'defects', initialState: ProductArrival | Defect) => {
    setNewItem(initialState)

    const modalSetters = {
      products: setProductsModalOpen,
      received_amount: setReceivedModalOpen,
      defects: setDefectsModalOpen,
    }

    Object.values(modalSetters).forEach(setter => setter(false))
    modalSetters[type](true)
  }

  const addItem = (type: 'products' | 'received_amount' | 'defects') => {
    const baseItem = {
      product: newItem.product,
      amount: Number(newItem.amount),
      ...(type !== 'defects' && { description: (newItem as ProductArrival).description }),
      ...(type === 'defects' && { defect_description: (newItem as Defect).defect_description }),
    }

    if (!baseItem.product || baseItem.amount <= 0 || (type === 'defects' && !(baseItem as Defect).defect_description)) {
      toast.warn('Заполните все обязательные поля.')
      return
    }

    switch (type) {
    case 'products':
      setProductsForm(prev => [...prev, baseItem as ProductArrival])
      setProductsModalOpen(false)
      break
    case 'received_amount':
      setReceivedForm(prev => [...prev, baseItem as ProductArrival])
      setReceivedModalOpen(false)
      break
    case 'defects':
      setDefectForm(prev => [...prev, baseItem as Defect])
      setDefectsModalOpen(false)
      break
    }

    setNewItem({ ...initialItemState })
  }

  const deleteItem = <T>(index: number, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleBlur = (field: keyof ArrivalError, value: string | number) => {
    type ErrorMessages = {
      [key in keyof ArrivalError]: string
    }

    const errorMessages: ErrorMessages = {
      product: !value ? 'Выберите товар' : '',
      amount: Number(value) <= 0 ? 'Количество должно быть больше 0' : '',
      arrival_price: Number(value) <= 0 ? 'Цена должна быть больше 0' : '',
      defect_description: !value ? 'Заполните описание дефекта' : '',
      client: !value ? 'Выберите клиента' : '',
      arrival_date: !value ? 'Укажите дату прибытия' : '',
      sent_amount: Number(value) <= 0 ? 'Количество должно быть больше 0' : '',
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessages[field] || '',
    }))
  }

  const autoCompleteClients =
    clients?.map(client => ({
      label: client.name,
      id: client._id,
    })) || []

  const getProductNameById = (productId: string): string => {
    const product = products?.find(p => p._id === productId)
    return product ? product.title : 'Неизвестный товар'
  }

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (productsForm.length === 0) {
      toast.error('Добавьте товары.')
      return
    }

    try {
      const updatedForm = {
        ...form,
        products: productsForm,
        received_amount: receivedForm,
        defects: defectsForm,
        arrival_price: Number(form.arrival_price),
      }

      if (initialData) {
        await dispatch(updateArrival({ arrivalId: initialData._id, data: updatedForm })).unwrap()
        onSuccess?.()
        toast.success('Поставка успешно обновлена!')
      } else {
        await dispatch(addArrival(updatedForm)).unwrap()
        toast.success('Поставка успешно создана!')
      }

      setForm({ ...initialState })
      setProductsForm([])
      setReceivedForm([])
      setDefectForm([])
      await dispatch(fetchPopulatedArrivals())
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
    autoCompleteClients,
    getProductNameById,
    error,
    submitFormHandler,
  }
}
