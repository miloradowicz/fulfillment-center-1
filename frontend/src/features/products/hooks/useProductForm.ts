import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { DynamicField, ProductMutation, ProductWithPopulate } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllClients } from '../../../store/slices/clientSlice.ts'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import { addProduct, updateProduct } from '../../../store/thunks/productThunk.ts'
import {
  selectCreateProductError,
  selectLoadingAddProduct,
  selectLoadingUpdateProduct,
} from '../../../store/slices/productSlice.ts'

const initialState: ProductMutation = {
  client: '',
  title: '',
  amount: 0,
  barcode: '',
  article: '',
  dynamic_fields: [],
}

const dynamicFieldState: DynamicField = {
  key: '',
  label: '',
  value: '',
}

const useProductForm = (initialData?: ProductWithPopulate, onSuccess?:() => void) => {
  const [form, setForm] = useState<ProductMutation>(
    initialData? {
      client: initialData.client._id,
      title: initialData.title,
      amount: initialData.amount,
      barcode: initialData.barcode,
      article: initialData.article,
    } : { ...initialState },
  )
  const [selectedClient, setSelectedClient] = useState(
    initialData?  initialData.client._id : '',
  )

  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>(
    initialData?.dynamic_fields
      ? initialData.dynamic_fields.map(field => ({
        key: field.key,
        label: field.label,
        value: field.value,
      }))
      : [],
  )
  const [newField, setNewField] = useState<DynamicField>(dynamicFieldState)
  const [showNewFieldInputs, setShowNewFieldInputs] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const loadingAdd = useAppSelector(selectLoadingAddProduct)
  const loadingUpdate = useAppSelector(selectLoadingUpdateProduct)
  const createError = useAppSelector(selectCreateProductError)

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    if (name === 'amount') {
      const amountValue = value === '' ? 0 : Number(value)
      if (amountValue < 0 || isNaN(amountValue)) return
      setForm(prevState => ({
        ...prevState,
        [name]: amountValue,
      }))
    } else {
      setForm(prevState => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const addDynamicField = () => {
    if (!newField.key.trim() || !newField.label.trim()) return

    setDynamicFields(prev => [...prev, newField])
    setNewField(dynamicFieldState)
    setShowNewFieldInputs(false)
  }

  const onChangeDynamicFieldValue = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value
    setDynamicFields(prev => prev.map((field, i) => (i === index ? { ...field, value } : field)))
    setErrors(prevErrors => ({ ...prevErrors, [`dynamicField_${ index }`]: '' }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const updatedForm = {
        ...form,
        dynamic_fields: dynamicFields,
      }

      if (initialData) {
        await dispatch(updateProduct({ productId: initialData._id, data: updatedForm })).unwrap()
        toast.success('Товар успешно обновлен.')
      } else {
        await dispatch(addProduct(updatedForm)).unwrap()
        toast.success('Товар успешно создан.')
        setForm(initialState)
        setDynamicFields([])
        setSelectedClient('')
      }
      if (onSuccess) onSuccess()
      setErrors({})
    } catch (e) {
      console.error(e)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.client) {
      newErrors.client = 'Поле "Клиент" обязательно для заполнения!'
    }
    if (!form.title.trim()) {
      newErrors.title = 'Поле "Название" обязательно для заполнения!'
    }
    if (form.amount === 0) {
      newErrors.amount = 'Поле "Количество" обязательно для заполнения!'
    }
    if (!form.barcode.trim()) {
      newErrors.barcode = 'Поле "Баркод" обязательно для заполнения!'
    }
    if (!form.article.trim()) {
      newErrors.article = 'Поле "Артикул" обязательно для заполнения!'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return {
    form,
    selectedClient,
    dynamicFields,
    newField,
    showNewFieldInputs,
    clients,
    loadingAdd,
    loadingUpdate,
    inputChangeHandler,
    addDynamicField,
    onChangeDynamicFieldValue,
    onSubmit,
    setForm,
    setDynamicFields,
    setSelectedClient,
    setNewField,
    setShowNewFieldInputs,
    setErrors,
    errors,
    createError,
  }
}

export default useProductForm
