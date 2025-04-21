import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Defect,
  OrderMutation,
  Product,
  ProductOrder,
  ServiceArrival,
  ServiceOrder,
} from '@/types'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectCreateOrderError, selectLoadingAddOrder, selectPopulateOrder } from '@/store/slices/orderSlice.ts'
import { selectAllClients, selectLoadingFetchClient } from '@/store/slices/clientSlice.ts'
import { selectAllProducts } from '@/store/slices/productSlice.ts'
import { toast } from 'react-toastify'
import { fetchClients } from '@/store/thunks/clientThunk.ts'
import { fetchProductsByClientId } from '@/store/thunks/productThunk.ts'
import {
  addOrder,
  fetchOrderById,
  fetchOrderByIdWithPopulate,
  fetchOrdersWithClient,
  updateOrder,
} from '@/store/thunks/orderThunk.ts'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { selectAllStocks, selectOneStock } from '@/store/slices/stocksSlice.ts'
import { fetchStockById, fetchStocks } from '@/store/thunks/stocksThunk.ts'
import { hasMessage, isGlobalError } from '@/utils/helpers.ts'
import { deleteFile } from '@/store/thunks/deleteFileThunk.ts'
import { useFileDeleteWithModal } from '@/hooks/UseFileRemoval.ts'
import { selectAllServices } from '@/store/slices/serviceSlice.ts'
import { initialErrorState, initialItemState, initialServiceState, initialState } from '../state/orderState.ts'
import { ErrorMessages, ItemInitialStateMap, ItemType, ProductField, ServiceField } from '../utils/orderTypes.ts'
import { ErrorMessagesList } from '@/messages.ts'
import { fetchServices } from '@/store/thunks/serviceThunk.ts'

export const useOrderForm = (onSuccess?: () => void) => {
  const initialData = useAppSelector(selectPopulateOrder)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState<OrderMutation>(
    initialData
      ? {
        client: initialData.client._id,
        sent_at: dayjs(initialData.sent_at).format('YYYY-MM-DD'),
        delivered_at: initialData.delivered_at ? dayjs(initialData.delivered_at).format('YYYY-MM-DD') : '',
        price: initialData.price,
        stock: initialData.stock._id,
        products: [],
        defects: [],
        services: [],
        status: initialData.status,
        comment: initialData.comment ? initialData.comment : '',
        documents: initialData.documents ? initialData.documents : [],
      }
      : { ...initialState },
  )

  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddOrder)
  const createError = useAppSelector(selectCreateOrderError)
  const clients = useAppSelector(selectAllClients)
  const clientProducts = useAppSelector(selectAllProducts)
  const loadingFetchClient = useAppSelector(selectLoadingFetchClient)
  const [isButtonVisible, setButtonVisible] = useState(true)
  const params = useParams()
  const stocks = useAppSelector(selectAllStocks)
  const stock = useAppSelector(selectOneStock)

  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [availableDefects, setAvailableDefects] = useState<Product[]>([])
  const handleRemoveFile = (indexToRemove:number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const normalizeField = <T extends Partial<ProductField & ServiceField>>(items?: T[]): T[] =>
    items?.map(item => ({
      ...item,
      ...(item.product !== undefined && {
        product: typeof item.product === 'string' ? item.product : item.product._id,
      }),
      ...(item.service !== undefined && {
        service: typeof item.service === 'string' ? item.service : item.service._id,
      }),
    })) || []

  const [productsForm, setProductsForm] = useState<ProductOrder[]>(
    normalizeField((initialData?.products as ProductOrder[]) || []),
  )
  const [defectsForm, setDefectForm] = useState<Defect[]>(normalizeField((initialData?.defects as Defect[]) || []))
  const [servicesForm, setServicesForm] = useState<ServiceOrder[]>(
    normalizeField((initialData?.services as ServiceOrder[]) || []),
  )

  const error = useAppSelector(selectCreateOrderError)
  const services = useAppSelector(selectAllServices)
  const [newItem, setNewItem] = useState<ProductOrder | Defect>({ ...initialItemState })
  const [newService, setNewService] = useState<ServiceArrival>({ ...initialServiceState })
  const [errors, setErrors] = useState<ErrorMessages>({ ...initialErrorState })

  const [productsModalOpen, setProductsModalOpen] = useState(false)
  const [defectsModalOpen, setDefectsModalOpen] = useState(false)
  const [servicesModalOpen, setServicesModalOpen] = useState(false)

  const {
    existingFiles,
    openDeleteModal,
    handleRemoveExistingFile,
    handleModalConfirm,
    handleModalCancel,
  } = useFileDeleteWithModal(initialData?.documents || [], deleteFile)

  useEffect(() => {
    if (availableProducts.length > 0) {
      const availableDefects = availableProducts.filter(x => productsForm.some(y => x._id === y.product))
      setAvailableDefects(availableDefects)
    }
  }, [availableProducts, productsForm])

  const handleBlur = (field: keyof ErrorMessages, value: string | number) => {
    const errorMessages: ErrorMessages = {
      product: !value ? ErrorMessagesList.ProductErr : ErrorMessagesList.Default,
      amount: Number(value) <= 0 ? ErrorMessagesList.Amount : ErrorMessagesList.Default,
      defect_description: !value ? ErrorMessagesList.DefectDescription : ErrorMessagesList.Default,
      client: !value ? ErrorMessagesList.ClientErr : ErrorMessagesList.Default,
      sent_at: !value ? ErrorMessagesList.SentAtDate : ErrorMessagesList.Default,
      delivered_at: !value ? ErrorMessagesList.DeliveredAtDate : ErrorMessagesList.Default,
      stock: !value ? ErrorMessagesList.StockErr : ErrorMessagesList.Default,
      price: Number(value) <= 0 ? ErrorMessagesList.OrderPrice : ErrorMessagesList.Default,
      service: !value ? ErrorMessagesList.ServiceName : ErrorMessagesList.Default,
      service_amount: Number(value) <= 0 ? ErrorMessagesList.ServiceAmount : ErrorMessagesList.Default,
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessages[field] || '',
    }))
  }

  const handleButtonClick = () => {
    if (!form.client) {
      toast.warn('Выберите клиента')
    } else if (!form.stock) {
      toast.warn('Выберите склад')
    } else {
      setModalOpen(true)
      setButtonVisible(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const maxFileSize = 10 * 1024 * 1024
    const selectedFiles = Array.from(e.target.files)

    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxFileSize) {
        toast.warn(`Файл "${ file.name }" слишком большой (макс. 10MB)`)
        return false
      }
      return true
    })

    setFiles(prevFiles => [...prevFiles, ...validFiles])
  }

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchStocks())
    dispatch(fetchServices())
  }, [dispatch])

  useEffect(() => {
    if (form.client) {
      dispatch(fetchProductsByClientId(form.client))
    }
  }, [dispatch, form.client])

  useEffect(() => {
    if (form.stock) {
      dispatch(fetchStockById(form.stock))
    }
  }, [dispatch, form.stock])

  useEffect(() => {
    if (clientProducts && stock?.products) {
      const stockProducts = stock.products.map(x => ({ ...x, product: { ...x.product, client: x.product._id } }))
      const availableProducts = clientProducts.filter(x => stockProducts.some(y => x._id === y.product._id))
      setAvailableProducts(availableProducts)
    }
  }, [clientProducts, stock])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.values(errors).filter(Boolean).length) {
      toast.error('Заполните все обязательные поля.')
      return
    }

    if (productsForm.length === 0) {
      toast.error('Добавьте товары в заказ.')
      return
    }

    try {
      let updated_delivered_at: string = ''

      if (form.delivered_at) {
        updated_delivered_at = form.delivered_at
      } else if (form.delivered_at === '') {
        updated_delivered_at = ''
      }

      const updatedForm = {
        ...form,
        delivered_at: updated_delivered_at,
        documents: [...existingFiles],
        files,
        products: productsForm,
        defects: defectsForm,
        services: servicesForm,
      }

      if (initialData) {

        await dispatch(updateOrder({ orderId: initialData._id, data: { ...updatedForm } })).unwrap()
        if (params.id) {
          onSuccess?.()
          await dispatch(fetchOrderById(params.id))
          await dispatch(fetchOrderByIdWithPopulate(params.id))
        } else {
          onSuccess?.()
          await dispatch(fetchOrdersWithClient())
        }
        toast.success('Заказ успешно обновлен!')
        return
      } else {
        await dispatch(addOrder(updatedForm)).unwrap()
        onSuccess?.()
        toast.success('Заказ успешно создан!')
        setForm({ ...initialState })
        setProductsForm([])
        setDefectForm([])
        await dispatch(fetchOrdersWithClient())
      }
    } catch (e) {
      if (isGlobalError(e)) {
        toast.error(e.message)
      } else if (hasMessage(e)) {
        toast.error(e.message)
      }
      console.error(e)
    }
  }

  const openModal = <T extends ItemType>(type: T, initialState: ItemInitialStateMap[T]) => {
    if (type === ItemType.SERVICES) {
      setNewService(initialState as ServiceOrder)
    } else {
      setNewItem(initialState as ProductOrder | Defect)
    }

    const modalSetters: Record<ItemType, React.Dispatch<React.SetStateAction<boolean>>> = {
      [ItemType.PRODUCTS]: setProductsModalOpen,
      [ItemType.DEFECTS]: setDefectsModalOpen,
      [ItemType.SERVICES]: setServicesModalOpen,
    }

    Object.values(modalSetters).forEach(setter => setter(false))
    modalSetters[type](true)
  }

  const addItem = (type: ItemType) => {
    const baseItem = {
      product: newItem.product,
      amount: Number(newItem.amount),
      ...(type !== ItemType.DEFECTS && { description: (newItem as ProductOrder).description }),
      ...(type === ItemType.DEFECTS && { defect_description: (newItem as Defect).defect_description }),
    }

    const selectedService = services.find(s => s._id === newService.service)

    const baseService = {
      service: newService.service,
      service_amount: Number(newService.service_amount),
      service_price: Number(newService.service_price) || Number(selectedService?.price) || 0,
    }

    if (
      type !== ItemType.SERVICES &&
      (!baseItem.product ||
        baseItem.amount <= 0 ||
        (type === ItemType.DEFECTS && !(baseItem as Defect).defect_description))
    ) {
      toast.warn('Заполните все обязательные поля.')
      return
    }

    if (type === ItemType.SERVICES && (!baseService.service || baseService.service_amount <= 0)) {
      toast.warn('Заполните обязательные поля услуги.')
      return
    }

    switch (type) {
    case ItemType.PRODUCTS:
      setProductsForm(prev => [...prev, baseItem as ProductOrder])
      setProductsModalOpen(false)
      break
    case ItemType.DEFECTS:
      setDefectForm(prev => [...prev, baseItem as Defect])
      setDefectsModalOpen(false)
      break
    case ItemType.SERVICES:
      setServicesForm(prev => [...prev, baseService as ServiceArrival])
      setServicesModalOpen(false)
      break
    }

    setNewItem({ ...initialItemState })
    setNewService({ ...initialServiceState })
  }

  const deleteItem = <T>(index: number, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }


  return {
    form,
    setForm,
    errors,
    setErrors,
    productsForm,
    setProductsForm,
    defectsForm,
    setDefectForm,
    servicesForm,
    setServicesForm,
    modalOpen,
    setModalOpen,
    isButtonVisible,
    setButtonVisible,
    loading,
    createError,
    clients,
    clientProducts,
    availableProducts,
    loadingFetchClient,
    handleBlur,
    handleButtonClick,
    onSubmit,
    initialData,
    availableDefects,
    files,
    handleFileChange,
    stocks,
    handleRemoveFile,
    handleRemoveExistingFile,
    existingFiles,
    handleModalCancel,
    handleModalConfirm,
    openDeleteModal,
    productsModalOpen,
    setProductsModalOpen,
    defectsModalOpen,
    setDefectsModalOpen,
    servicesModalOpen,
    setServicesModalOpen,
    setNewService,
    services,
    newService,
    openModal,
    addItem,
    deleteItem,
    setNewItem,
    error,
    newItem,
  }
}
