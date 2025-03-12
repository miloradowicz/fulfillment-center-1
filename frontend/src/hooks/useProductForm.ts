import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import { DynamicField, ProductMutation } from '../types'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import { selectAllClients } from '../store/slices/clientSlice.ts'
import { fetchClients } from '../store/thunks/clientThunk.ts'
import { addProduct } from '../store/thunks/productThunk.ts'

const initialState: ProductMutation = {
  client: '',
  title: '',
  amount: 0,
  barcode: '',
  article: '',
  documents: [],
  dynamic_fields: [],
}

const useProductForm = () => {
  const [form, setForm] = useState<ProductMutation>(initialState)
  const [selectedClient, setSelectedClient] = useState('')
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
  const [newField, setNewField] = useState<DynamicField>({ key: '', label: '', value: '' })
  const [showNewFieldInputs, setShowNewFieldInputs] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectAllClients)
  const loading = useAppSelector(state => state.products.loadingAdd)

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    if (selectedFile) {
      const maxFileSize = 10 * 1024 * 1024
      if (selectedFile.size > maxFileSize) {
        toast.warn('Размер файла слишком большой. Максимальный размер: 10MB')
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const addDynamicField = () => {
    if (!newField.key.trim() || !newField.label.trim()) return

    setDynamicFields(prev => [...prev, newField])
    setNewField({ key: '', label: '', value: '' })
    setShowNewFieldInputs(false)
  }

  const onChangeDynamicFieldValue = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value
    setDynamicFields(prev => prev.map((field, i) => (i === index ? { ...field, value } : field)))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!form.client) {
      toast.warn('Поле "Клиент" обязательно для заполнения!')
      return
    }
    if (!form.title.trim() || !form.title) {
      toast.warn('Поле "Название" обязательно для заполнения!')
      return
    }
    if (form.amount === 0) {
      toast.warn('Поле "Количество" обязательно для заполнения!')
      return
    }
    if (!form.barcode.trim() || !form.barcode) {
      toast.warn('Поле "Баркод" обязательно для заполнения!')
      return
    }
    if (!form.article.trim() || !form.article) {
      toast.warn('Поле "Артикул" обязательно для заполнения!')
      return
    }

    try {
      const formData = new FormData()
      formData.append('client', form.client)
      formData.append('title', form.title)
      formData.append('amount', String(form.amount))
      formData.append('barcode', form.barcode)
      formData.append('article', form.article)

      if (dynamicFields.length > 0) {
        formData.append('dynamic_fields', JSON.stringify(dynamicFields))
      }

      if (file) {
        formData.append('documents', file)
      }

      await dispatch(addProduct(formData)).unwrap()
      toast.success('Продукт успешно создан.')

      setForm(initialState)
      setDynamicFields([])
      setSelectedClient('')
      setFile(null)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        console.error('Ошибки валидации:', e.response.data)
      } else {
        console.error('Ошибка сервера:', e)
        toast.error('Не удалось создать продукт.')
      }
    }
  }

  return {
    form,
    selectedClient,
    dynamicFields,
    newField,
    showNewFieldInputs,
    file,
    clients,
    loading,
    inputChangeHandler,
    handleFileChange,
    addDynamicField,
    onChangeDynamicFieldValue,
    onSubmit,
    setForm,
    setDynamicFields,
    setSelectedClient,
    setFile,
    setNewField,
    setShowNewFieldInputs,
  }
}

export default useProductForm
