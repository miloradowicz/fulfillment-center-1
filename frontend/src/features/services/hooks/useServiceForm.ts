import { ChangeEvent, FormEvent, useState } from 'react'
import { DynamicField, ServiceMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { createService } from '../../../store/thunks/serviceThunk'
import { selectLoadingAddService } from '../../../store/slices/serviceSlice'

interface Errors {
  name?: string;
  dynamicField_?: string;
  newFieldValue?: string;
  newFieldKey?: string;
  newFieldLabel?: string;
  [key: `dynamicField_${ number }`]: string;
}

const useServiceForm = (onClose: () => void) => {
  const [form, setForm] = useState<ServiceMutation>({ name: '', dynamic_fields: [] })
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
  const [newField, setNewField] = useState<DynamicField>({ key: '', label: '', value: '' })
  const [showNewFieldInputs, setShowNewFieldInputs] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const loading = useAppSelector(selectLoadingAddService)
  const dispatch = useAppDispatch()

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const addDynamicField = () => {
    const newErrors: Errors = {}

    if (!newField.label.trim()) {
      newErrors.newFieldValue = 'Значение обязательно!'
    }

    if (!newField.key.trim()) {
      newErrors.newFieldKey = 'Ключ обязателен!'
    }

    if (!newField.label.trim()) {
      newErrors.newFieldLabel = 'Название обязательно!'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const isDuplicate = dynamicFields.some(
      field => field.key === newField.key || field.label === newField.label,
    )

    if (isDuplicate) {
      setErrors({ dynamicField_: 'Поле с таким ключом или названием уже существует' })
      return
    }

    setDynamicFields(prev => [...prev, newField])
    setNewField({ key: '', label: '', value: '' })
    setShowNewFieldInputs(false)
    setErrors({})
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

    if (!form.name.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, name: 'Название обязательно' }))
      return
    }

    if (dynamicFields.length === 0) {
      setErrors(prevErrors => ({ ...prevErrors, dynamicField_: 'Добавьте хотя бы одно дополнительное свойство' }))
      toast.warn('Добавьте хотя бы одно дополнительное свойство')
      return
    }

    const hasEmptyFields = dynamicFields.some(field => !field.key.trim() || !field.label.trim() || !field.value.trim())
    if (hasEmptyFields) {
      setErrors(prevErrors => ({ ...prevErrors, dynamicField_: 'Все дополнительные поля должны быть заполнены' }))
      toast.warn('Все дополнительные поля должны быть заполнены')
      return
    }

    const keys = new Set<string>()
    const labels = new Set<string>()
    for (const field of dynamicFields) {
      if (keys.has(field.key) || labels.has(field.label)) {
        setErrors({ dynamicField_: 'Поле с таким ключом или названием уже существует' })
        toast.warn('Поле с таким ключом или названием уже существует')
        return
      }
      keys.add(field.key)
      labels.add(field.label)
    }

    try {
      const serviceData: ServiceMutation = {
        name: form.name,
        dynamic_fields: dynamicFields,
      }

      await dispatch(createService(serviceData)).unwrap()
      toast.success('Услуга успешно создана!')

      onClose()
      setForm({ name: '', dynamic_fields: [] })
      setDynamicFields([])
      setErrors({})
    } catch (e) {
      if (isAxiosError(e) && e.response?.data) {
        console.error('Ошибка валидации:', e.response.data)

        if (e.response.data.message) {
          if (Array.isArray(e.response.data.message)) {
            setErrors(prev => ({
              ...prev,
              dynamicField_: e.response?.data.message.join(', '),
            }))
            toast.error(e.response.data.message.join(', '))
          } else {
            toast.error(e.response.data.message)
          }
        } else {
          toast.error('Ошибка при создании услуги. Проверьте данные и попробуйте снова.')
        }
      } else {
        console.error('Ошибка сервера:', e)
      }
    }
  }


  const handleCancel = () => {
    setShowNewFieldInputs(false)
    setErrors(prevErrors => ({
      ...prevErrors,
      newFieldKey: '',
      newFieldLabel: '',
    }))
  }

  return {
    form,
    dynamicFields,
    newField,
    showNewFieldInputs,
    loading,
    inputChangeHandler,
    addDynamicField,
    onChangeDynamicFieldValue,
    onSubmit,
    setNewField,
    setShowNewFieldInputs,
    errors,
    handleCancel,
  }
}

export default useServiceForm
