import React, { ChangeEvent, useEffect, useState } from 'react'
import { Defect, OrderMutation, Product, ProductOrder, ServiceArrival } from '@/types'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectCreateOrderError, selectLoadingAddOrder } from '@/store/slices/orderSlice.ts'
import { selectAllClients } from '@/store/slices/clientSlice.ts'
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
import { ErrorMessages, ItemInitialStateMap, OrderData } from '../utils/orderTypes.ts'
import { ErrorMessagesList } from '@/messages.ts'
import { fetchServices } from '@/store/thunks/serviceThunk.ts'
import { normalizeField } from '@/utils/normalizeField.ts'
import { ItemType } from '@/constants.ts'
import { getAvailableItems } from '@/utils/getAvailableItems.ts'
import { PopoverType } from '@/components/CustomSelect/CustomSelect.tsx'

export const useOrderForm = (initialData?: OrderData, onSuccess?: () => void) => {
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
        paymentStatus: initialData.paymentStatus ? initialData.paymentStatus : '',
      }
      : { ...initialState },
  )

  const [files, setFiles] = useState<File[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [activePopover, setActivePopover] = useState<PopoverType>(null)
  const [availableItems, setAvailableItems] = useState<Product[]>([])
  const [productsForm, setProductsForm] = useState<ProductOrder[]>(
    normalizeField((initialData?.products as ProductOrder[]) || []),
  )
  const [defectsForm, setDefectForm] = useState<Defect[]>(normalizeField((initialData?.defects as Defect[]) || []))
  const [servicesForm, setServicesForm] = useState<ServiceArrival[]>(
    normalizeField((initialData?.services as ServiceArrival[]) || []),
  )
  const [newItem, setNewItem] = useState<ProductOrder | Defect>({ ...initialItemState })
  const [newService, setNewService] = useState<ServiceArrival>({ ...initialServiceState })
  const [errors, setErrors] = useState<ErrorMessages>({ ...initialErrorState })

  const [productsModalOpen, setProductsModalOpen] = useState(false)
  const [defectsModalOpen, setDefectsModalOpen] = useState(false)
  const [servicesModalOpen, setServicesModalOpen] = useState(false)

  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddOrder)
  const clients = useAppSelector(selectAllClients)
  const clientProducts = useAppSelector(selectAllProducts)
  const [isButtonVisible, setButtonVisible] = useState(true)
  const params = useParams()
  const stocks = useAppSelector(selectAllStocks)
  const stock = useAppSelector(selectOneStock)
  const error = useAppSelector(selectCreateOrderError)
  const services = useAppSelector(selectAllServices)

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchStocks())
    dispatch(fetchServices())

    if (form.client) {
      dispatch(fetchProductsByClientId(form.client))
    }

    if (form.stock) {
      dispatch(fetchStockById(form.stock))
    }
  }, [dispatch, form.client,  form.stock])

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const { existingFiles, openDeleteModal, handleRemoveExistingFile, handleModalConfirm, handleModalCancel } =
    useFileDeleteWithModal(initialData?.documents || [], deleteFile)

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
    if (productsForm.length !== 0 && clientProducts) {
      const availableProducts = productsForm
        .map(item => clientProducts.find(p => p._id === item.product))
        .filter((p): p is Product => p !== undefined)

      getAvailableItems(
        clientProducts,
        availableProducts.map(product => ({ product })),
        availableItems,
        setAvailableItems,
        '_id',
      )
    }
  }, [productsForm, clientProducts, availableItems])

  useEffect(() => {
    if (clientProducts && stock?.products) {
      const stockProducts = stock.products.map(x => ({ ...x, product: { ...x.product, client: x.product._id } }))
      const availableProducts = clientProducts.filter(x => stockProducts.some(y => x._id === y.product._id))
      setAvailableItems(availableProducts)
    }
  }, [clientProducts, stock])

  const openModal = <T extends Extract<ItemType, ItemType.PRODUCTS | ItemType.DEFECTS | ItemType.SERVICES>>(
    type: T,
    initialState: ItemInitialStateMap[T],
  ) => {
    if (type === ItemType.SERVICES) {
      setNewService(initialState as ServiceArrival)
    } else {
      setNewItem(initialState as ProductOrder | Defect)
    }

    const modalSetters: Record<
      Extract<ItemType, ItemType.PRODUCTS | ItemType.DEFECTS | ItemType.SERVICES>,
      React.Dispatch<React.SetStateAction<boolean>>
    > = {
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
      service_type: selectedService?.type,
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

  const handleBlur = (field: keyof ErrorMessages, value: string | number) => {
    const errorMessages: ErrorMessages = {
      product: !value ? ErrorMessagesList.ProductErr : ErrorMessagesList.Default,
      amount: Number(value) <= 0 ? ErrorMessagesList.Amount : ErrorMessagesList.Default,
      defect_description: !value ? ErrorMessagesList.DefectDescription : ErrorMessagesList.Default,
      client: !value ? ErrorMessagesList.ClientErr : ErrorMessagesList.Default,
      sent_at: !value ? ErrorMessagesList.SentAtDate : ErrorMessagesList.Default,
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

  const closeModalProduct = ()=>{
    setErrors(prev => ({
      ...prev,
      product: '',
      amount: '',
    }))
    setProductsModalOpen(false)
  }

  const closeModalDefect = ()=>{
    setErrors(prev => ({
      ...prev,
      product: '',
      amount: '',
      defect_description: '',
    }))
    setDefectsModalOpen(false)
  }

  const closeModalService = ()=>{
    setErrors(prev => ({
      ...prev,
      service: '',
      service_amount: '',
      service_price: '',
    }))
    setServicesModalOpen(false)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.values(errors).filter(Boolean).length) {
      console.log(errors)
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
        onSuccess?.()

        if (params.id) {
          await dispatch(fetchOrderById(params.id))
          await dispatch(fetchOrderByIdWithPopulate(params.id))
        } else {
          await dispatch(fetchOrdersWithClient())
        }
        toast.success('Заказ успешно обновлен!')
      } else {
        await dispatch(addOrder(updatedForm)).unwrap()
        toast.success('Заказ успешно создан!')
        await dispatch(fetchOrdersWithClient())
      }

      setForm({ ...initialState })
      setProductsForm([])
      setDefectForm([])
      onSuccess?.()
    } catch (e) {
      if (isGlobalError(e)) {
        toast.error(e.message)
      } else if (hasMessage(e)) {
        toast.error(e.message)
      }
      console.error(e)
    }
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
    clients,
    clientProducts,
    handleBlur,
    handleButtonClick,
    onSubmit,
    files,
    availableItems,
    handleFileChange,
    stocks,
    handleRemoveFile,
    handleRemoveExistingFile,
    existingFiles,
    handleModalCancel,
    handleModalConfirm,
    openDeleteModal,
    productsModalOpen,
    defectsModalOpen,
    servicesModalOpen,
    setNewService,
    services,
    newService,
    openModal,
    addItem,
    deleteItem,
    setNewItem,
    error,
    newItem,
    activePopover,
    setActivePopover,
    closeModalProduct,
    closeModalDefect,
    closeModalService,
  }
}
