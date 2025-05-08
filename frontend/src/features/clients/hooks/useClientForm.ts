import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import {
  selectClient,
  selectLoadingAddClient,
  selectAllClients,
  selectClientCreationAndModificationError,
  clearCreationAndModificationError,
  selectLoadingUpdateClient,
} from '@/store/slices/clientSlice.ts'
import { addClient, fetchClientById, fetchClients, updateClient } from '@/store/thunks/clientThunk.ts'
import { emailRegex, initialClientState, phoneNumberRegex } from '@/constants.ts'
import { ClientMutation } from '@/types'
import { isValidationError } from '@/utils/helpers.ts'

const requiredFields: (keyof ClientMutation)[] = ['name', 'email', 'phone_number', 'inn']

export const useClientForm = (clientId?: string, onClose?: () => void) => {
  const [form, setForm] = useState<ClientMutation>(initialClientState)
  const [errors, setErrors] = useState<Partial<ClientMutation>>({})

  const dispatch = useAppDispatch()
  const loadingAdd = useAppSelector(selectLoadingAddClient)
  const loadingUpdate = useAppSelector(selectLoadingUpdateClient)
  const creationAndModificationError = useAppSelector(selectClientCreationAndModificationError)
  const client = useAppSelector(selectClient)
  const clients = useAppSelector(selectAllClients) || []

  useEffect(() => {
    if (clientId) {
      dispatch(fetchClientById(clientId))
    }
  }, [dispatch, clientId])

  useEffect(() => {
    if (clientId && client) {
      setForm(client)
    }
  }, [clientId, client])

  useEffect(() => {
    dispatch(clearCreationAndModificationError())
    return () => {
      dispatch(clearCreationAndModificationError())
      setErrors({})
    }
  }, [dispatch])

  const validateField = (name: keyof ClientMutation, value: string): string => {
    if (!value.trim()) {
      switch (name) {
      case 'name': return 'Укажите ФИО или название компании'
      case 'phone_number': return 'Укажите номер телефона'
      case 'email': return 'Укажите email'
      case 'inn': return 'Укажите ИНН'
      default: return 'Поле не может быть пустым'
      }
    }
    if (name === 'email' && !emailRegex.test(value)) return 'Неправильный формат Email'
    if (name === 'phone_number' && !phoneNumberRegex.test(value)) return 'Неправильный формат номера телефона'
    return ''
  }

  const handleBlur = (field: keyof ClientMutation, value: string) => {
    const error = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }))
  }

  const validateFields = () => {
    const newErrors: Partial<ClientMutation> = {}

    requiredFields.forEach(field => {
      newErrors[field] = validateField(field, form[field] || '')
    })

    setErrors(newErrors)
    return Object.values(newErrors).some(error => error)
  }

  const checkClientNameExistence = (name: string) => {
    const existingClient = clients.find(client => client.name.toLowerCase() === name.toLowerCase() && client._id !== clientId)
    if (existingClient) {
      setErrors(prev => ({
        ...prev,
        name: 'Клиент с таким именем уже существует',
      }))
      return true
    }
    setErrors(prev => {
      const { name, ...rest } = prev
      return rest
    })
    return false
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (requiredFields.includes(name as keyof ClientMutation)) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name as keyof ClientMutation, value),
      }))
    }

    if (name === 'name') {
      checkClientNameExistence(value)
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateFields()) return

    const isNameTaken = checkClientNameExistence(form.name)
    if (isNameTaken) return

    try {
      if (clientId) {
        await dispatch(updateClient({ clientId, data: form })).unwrap()
        await dispatch(fetchClientById(clientId))
        await dispatch(fetchClients())
        toast.success('Клиент успешно обновлен')
      } else {
        await dispatch(addClient(form)).unwrap()
        await dispatch(fetchClients())
        toast.success('Клиент успешно создан')
      }

      setForm(initialClientState)
      setErrors({})
      if (onClose) onClose()
    } catch (error) {
      console.error(error)
      toast.error(clientId ? 'Не удалось обновить клиента' : 'Не удалось создать клиента')
    }
  }

  const getFieldError = (fieldName: keyof ClientMutation) => {
    const messages = errors[fieldName] ? [errors[fieldName]] : []

    if (isValidationError(creationAndModificationError) && creationAndModificationError.errors[fieldName]) {
      messages.push(...creationAndModificationError.errors[fieldName].messages)
    }

    return messages.length ? messages.join(', ') : undefined
  }

  return {
    form,
    errors,
    loadingAdd,
    loadingUpdate,
    inputChangeHandler,
    onSubmit,
    getFieldError,
    handleBlur,
  }
}
