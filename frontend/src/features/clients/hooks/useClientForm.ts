import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ClientMutation } from '../types'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import { selectClient, selectClientError, selectLoadingAddClient } from '../store/slices/clientSlice.ts'
import { addClient, fetchClientById, updateClient } from '../store/thunks/clientThunk.ts'
import { emailRegex, phoneNumberRegex, initialClientState } from '../constants.ts'
import { ClientMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllClients, selectClientError, selectLoadingAddClient } from '../../../store/slices/clientSlice.ts'
import { addClient, fetchClients } from '../../../store/thunks/clientThunk.ts'
import { emailRegex, phoneNumberRegex, initialClientState } from '../../../constants.ts'

const requiredFields: (keyof ClientMutation)[] = ['name', 'email', 'phone_number', 'inn']

export const useClientForm = (clientId?: string, onClose?: () => void) => {
  const [form, setForm] = useState<ClientMutation>(initialClientState)
  const [errors, setErrors] = useState<Partial<ClientMutation>>({})

  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddClient)
  const createError = useAppSelector(selectClientError)
  const client = useAppSelector(selectClient)

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

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (requiredFields.includes(name as keyof ClientMutation)) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name as keyof ClientMutation, value),
      }))
    }
  }

  const validateField = (name: keyof ClientMutation, value: string): string => {
    if (!value.trim()) return 'Поле не может быть пустым'
    if (name === 'email' && !emailRegex.test(value)) return 'Неправильный формат Email'
    if (name === 'phone_number' && !phoneNumberRegex.test(value)) return 'Неправильный формат номера телефона'
    return ''
  }

  const validateFields = () => {
    const newErrors: Partial<ClientMutation> = {}

    requiredFields.forEach(field => {
      newErrors[field] = validateField(field, form[field] || '')
    })

    setErrors(newErrors)
    return Object.values(newErrors).some(error => error)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (validateFields()) return

    if (clientId) {
      await dispatch(updateClient({ clientId: clientId, data: form }))
      await dispatch(fetchClientById(clientId))
      toast.success('Клиент успешно обновлен!')
    } else {
      await dispatch(addClient(form))
      toast.success('Клиент успешно создан!')
    }

    setForm(initialClientState)
    if (onClose) onClose()
  }

  const getFieldError = (fieldName: keyof ClientMutation) => {
    const fieldErrors = errors[fieldName] ? [errors[fieldName]] : []
    if (createError?.message) fieldErrors.push(createError.message)

    return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
  }

  return { form, errors, loading, inputChangeHandler, onSubmit, getFieldError }
}
