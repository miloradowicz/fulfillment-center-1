import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Defect, ErrorsFields,
  DefectForOrderForm,
  OrderMutation,
  Product,
  ProductForOrderForm,
  ProductOrder,
} from '../../../types'
import {
  initialStateDefectForOrder,
  initialStateErrorForOrder,
  initialStateOrder,
  initialStateProductForOrder,
} from './initialState.ts'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectCreateOrderError, selectLoadingAddOrder, selectPopulateOrder } from '../../../store/slices/orderSlice.ts'
import { selectAllClients, selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { validationRules } from './ValidationRulesForBlur.ts'
import { toast } from 'react-toastify'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import { fetchProductsByClientId } from '../../../store/thunks/productThunk.ts'
import {
  addOrder,
  fetchOrderById,
  fetchOrderByIdWithPopulate,
  fetchOrdersWithClient,
  updateOrder,
} from '../../../store/thunks/orderThunk.ts'
import { deleteItem } from './deleteItem.ts'
import { addArrayItemInForm } from './addArrayItemInForm.ts'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { getAvailableItems } from '../../../utils/getAvailableItems.ts'
import { ItemType } from '../../../constants.ts'
import { selectAllStocks, selectOneStock } from '../../../store/slices/stocksSlice.ts'
import { fetchStockById, fetchStocks } from '../../../store/thunks/stocksThunk.ts'
import { hasMessage, isGlobalError } from '../../../utils/helpers.ts'

type ErrorForOrder = Pick<ErrorsFields, 'client' | 'product' | 'price' | 'sent_at' | 'amount' | 'defect_description' | 'status' | 'stock'>

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
        status: initialData.status,
        comment: initialData.comment ? initialData.comment : '',
        documents: initialData.documents ? initialData.documents : [],
      }
      : { ...initialStateOrder },
  )

  const [productsForm, setProductsForm] = useState<ProductForOrderForm[]>(initialData ? initialData.products : [])
  const [defectForm, setDefectForm] = useState<DefectForOrderForm[]>(initialData ? initialData.defects : [])
  const [newFieldDefects, setNewFieldDefects] = useState<Defect>(initialStateDefectForOrder)
  const [modalOpenDefects, setModalOpenDefects] = useState(false)
  const [isButtonDefectVisible, setButtonDefectVisible] = useState(true)
  const [newField, setNewField] = useState<ProductOrder>(initialStateProductForOrder)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddOrder)
  const createError = useAppSelector(selectCreateOrderError)
  const clients = useAppSelector(selectAllClients)
  const clientProducts = useAppSelector(selectAllProducts)
  const loadingFetchClient = useAppSelector(selectLoadingFetchClient)
  const [isButtonVisible, setButtonVisible] = useState(true)
  const [errors, setErrors] = useState<ErrorForOrder>(initialStateErrorForOrder)
  const params = useParams()
  const stocks = useAppSelector(selectAllStocks)
  const stock = useAppSelector(selectOneStock)

  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [availableDefects, setAvailableDefects] = useState<Product[]>([])

  useEffect(() => {
    if (availableProducts.length > 0) {
      const availableDefects = availableProducts.filter(x => productsForm.some(y => x._id === y.product._id))
      setAvailableDefects(availableDefects)
    }
  }, [availableProducts, productsForm])

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const errorMessage =
      validationRules[name]?.(value) || (value.trim() === '' ? 'Это поле обязательно для заполнения' : '')
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage,
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

  const handleCloseDefectModal = () => {
    setModalOpenDefects(false)
    setButtonDefectVisible(true)
  }

  const handleButtonDefectClick = () => {
    if (!form.client) {
      toast.warn('Выберите клиента')
    } else if (!form.stock) {
      toast.warn('Выберите склад')
    } else {
      setModalOpenDefects(true)
      setButtonDefectVisible(false)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setButtonVisible(true)
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
    try {
      const transformToOrder = <T, R>(items: T[], mapFn: (item: T) => R): R[] => {
        return items.map(mapFn)
      }

      let updated_delivered_at: string = ''

      if (form.delivered_at) {
        updated_delivered_at = form.delivered_at
      } else if (form.delivered_at === '') {
        updated_delivered_at = ''
      }

      if (initialData) {
        const updatedForm = {
          ...form,
          delivered_at: updated_delivered_at,
          files: files || [],
          products: transformToOrder(productsForm, item => ({
            product: item.product._id,
            description: item.description,
            amount: item.amount,
          })),
          defects: transformToOrder(defectForm, item => ({
            product: item.product._id,
            defect_description: item.defect_description,
            amount: item.amount,
          })),
        }

        if (updatedForm.products.length === 0) {
          toast.error('Добавьте товары')
          return
        }

        if (Object.values(errors).filter(Boolean).length) {
          toast.error('Заполните все обязательные поля.')
          return
        }

        await dispatch(updateOrder({ orderId: initialData._id, data: { ...updatedForm, files } })).unwrap()

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
        if (form.products.length === 0) {
          toast.error('Добавьте товары')
          return
        }
        await dispatch(addOrder({ ...form, delivered_at: updated_delivered_at, files })).unwrap()
        onSuccess?.()
        toast.success('Заказ успешно создан!')
        setForm({ ...initialStateOrder })
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

  const deleteProduct = (index: number) => {
    deleteItem(index, setProductsForm, setForm, ItemType.PRODUCTS)
  }
  const deleteDefect = (index: number) => {
    deleteItem(index, setDefectForm, setForm, ItemType.DEFECTS)
  }

  type FormData = OrderMutation | ProductOrder | Defect

  const handleBlurAutoComplete = (
    field: string,
    setErrors: React.Dispatch<React.SetStateAction<ErrorForOrder>>,
    formData: FormData,
    errorMessage: string,
  ) => {
    if ('client' in formData || ItemType.PRODUCTS in formData || 'product' in formData) {
      const keys = Object.keys(formData) as (keyof FormData)[]
      if (keys.includes(field as keyof FormData)) {
        if (!formData[field as keyof FormData]) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [field]: errorMessage,
          }))
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            [field]: '',
          }))
        }
      }
    }
  }

  const setFormArrayData = () => {
    setForm(prev => ({
      ...prev,
      products: newField.product ? [...prev.products, newField] : prev.products,
      defects: newFieldDefects.product
        ? prev.defects
          ? [...prev.defects, newFieldDefects]
          : [newFieldDefects]
        : prev.defects,
    }))
    setNewField(initialStateProductForOrder)
    setNewFieldDefects(initialStateDefectForOrder)
    setModalOpenDefects(false)
    setModalOpen(false)
    setButtonDefectVisible(true)
    setButtonVisible(true)
  }

  const addArrayProductInForm = () => {
    addArrayItemInForm(newField, setProductsForm, setFormArrayData, clientProducts, 'amount', 'description', 'product')
  }

  const addArrayDefectInForm = () => {
    addArrayItemInForm(
      newFieldDefects,
      setDefectForm,
      setFormArrayData,
      clientProducts,
      'amount',
      'defect_description',
      'product',
    )
  }

  return {
    form,
    setForm,
    productsForm,
    setProductsForm,
    defectForm,
    setDefectForm,
    newField,
    setNewField,
    newFieldDefects,
    setNewFieldDefects,
    modalOpen,
    setModalOpen,
    modalOpenDefects,
    setModalOpenDefects,
    isButtonDefectVisible,
    setButtonDefectVisible,
    isButtonVisible,
    setButtonVisible,
    errors,
    setErrors,
    loading,
    createError,
    clients,
    clientProducts,
    availableProducts,
    loadingFetchClient,
    handleBlur,
    handleBlurAutoComplete,
    handleButtonClick,
    handleButtonDefectClick,
    handleCloseModal,
    handleCloseDefectModal,
    deleteProduct,
    deleteDefect,
    addArrayProductInForm,
    addArrayDefectInForm,
    onSubmit,
    initialData,
    availableDefects,
    files,
    handleFileChange,
    stocks,
  }
}
