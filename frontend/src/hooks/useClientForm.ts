import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ClientMutation } from '../types'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import { selectAllClients, selectClientError, selectLoadingAddClient } from '../store/slices/clientSlice.ts'
import { addClient, fetchClients } from '../store/thunks/clientThunk.ts'
import { emailRegex, phoneNumberRegex, initialClientState } from '../constants.ts'

const requiredFields: (keyof ClientMutation)[] = ['name', 'email', 'phone_number', 'inn']

export const useClientForm = () => {
  const [form, setForm] = useState<ClientMutation>(initialClientState)
  const [errors, setErrors] = useState<Partial<ClientMutation>>({})

  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddClient)
  const createError = useAppSelector(selectClientError)
  const clients = useAppSelector(selectAllClients) || []

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

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
    if (name === 'name' && clients.some(client => client.name.toLowerCase() === value.trim().toLowerCase())) {
      return 'Клиент с таким именем уже существует'
    }

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

    await dispatch(addClient(form))
    setForm(initialClientState)
    toast.success('Клиент успешно создан!')
  }

  const getFieldError = (fieldName: keyof ClientMutation) => {
    const fieldErrors = errors[fieldName] ? [errors[fieldName]] : []
    if (createError?.message) fieldErrors.push(createError.message)

    return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
  }

  return { form, errors, loading, inputChangeHandler, onSubmit, getFieldError }
}
