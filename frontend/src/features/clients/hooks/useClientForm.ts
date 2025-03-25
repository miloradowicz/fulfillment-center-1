import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectClient, selectClientError, selectLoadingAddClient, selectAllClients } from '../../../store/slices/clientSlice.ts'
import { addClient, fetchClientById, fetchClients, updateClient } from '../../../store/thunks/clientThunk.ts'
import { emailRegex, initialClientState, phoneNumberRegex } from '../../../constants.ts'
import { ClientMutation } from '../../../types'
import { useNavigate } from 'react-router-dom'

const requiredFields: (keyof ClientMutation)[] = ['name', 'email', 'phone_number', 'inn']

export const useClientForm = (clientId?: string, onClose?: () => void) => {
  const [form, setForm] = useState<ClientMutation>(initialClientState)
  const [errors, setErrors] = useState<Partial<ClientMutation>>({})

  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddClient)
  const createError = useAppSelector(selectClientError)
  const client = useAppSelector(selectClient)
  const clients = useAppSelector(selectAllClients) || []
  const navigate = useNavigate()

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
        await dispatch(updateClient({ clientId, data: form }))
        await dispatch(fetchClientById(clientId))
        toast.success('Клиент успешно обновлен!')
      } else {
        await dispatch(addClient(form))
        await dispatch(fetchClients())
        toast.success('Клиент успешно создан!')
        navigate('/clients')
      }

      setForm(initialClientState)
      if (onClose) {
        onClose()
      }
    } catch {
      toast.error('Не удалось создать клиента')
    }
  }

  const getFieldError = (fieldName: keyof ClientMutation) => {
    const fieldErrors = errors[fieldName] ? [errors[fieldName]] : []
    if (createError?.message) fieldErrors.push(createError.message)

    return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
  }

  return { form, errors, loading, inputChangeHandler, onSubmit, getFieldError }
}
