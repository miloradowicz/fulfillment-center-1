import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { createCounterparty, fetchAllCounterparties, fetchCounterpartyById, updateCounterparty } from '@/store/thunks/counterpartyThunk.ts'
import { CounterpartyError, CounterpartyMutation } from '@/types'
import { phoneNumberRegex } from '@/constants.ts'
import { initialState } from '../state/counterpartyState.ts'
import { toast } from 'react-toastify'
import { selectOneCounterparty, selectLoadingAdd, selectLoadingUpdate, selectCounterpartyCreateError, selectCounterpartyUpdateError, clearErrors, selectAllCounterparties } from '@/store/slices/counterpartySlices.ts'

const requiredFields: (keyof CounterpartyMutation)[] = ['name']

export const useCounterpartyForm = (counterpartyId?: string, onClose?: () => void) => {
  const dispatch = useAppDispatch()
  const loadingAdd = useAppSelector(selectLoadingAdd)
  const loadingUpdate = useAppSelector(selectLoadingUpdate)
  const counterparty = useAppSelector(selectOneCounterparty)
  const counterparties = useAppSelector(selectAllCounterparties) || []
  const createError = useAppSelector(selectCounterpartyCreateError)
  const updateError = useAppSelector(selectCounterpartyUpdateError)

  const [form, setForm] = useState<CounterpartyMutation>(initialState)
  const [errors, setErrors] = useState<{ [K in keyof CounterpartyMutation]?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [errorsBlur, setErrorsBlur] = useState<CounterpartyError>({ name:'' })

  const generalError =
    (createError && typeof createError === 'object' && 'message' in createError ? createError.message : '') ||
    (updateError && typeof updateError === 'object' && 'message' in updateError ? updateError.message : '')

  useEffect(() => {
    return () => {
      dispatch(clearErrors())
    }
  }, [dispatch])

  useEffect(() => {
    if (counterpartyId) {
      dispatch(fetchCounterpartyById(counterpartyId))
    }
  }, [dispatch, counterpartyId])

  useEffect(() => {
    if (counterpartyId && counterparty) {
      setForm(counterparty)
    }
  }, [counterpartyId, counterparty])

  useEffect(() => {
    const errors = createError || updateError
    if (errors) {
      const newErrors: { [K in keyof CounterpartyMutation]?: string } = {}

      if ('message' in errors && typeof errors.message === 'string') {
        toast.error(errors.message)
      }

      if ('errors' in errors && typeof errors.errors === 'object') {
        Object.entries(errors.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            newErrors[field as keyof CounterpartyMutation] = messages[0]
          } else if (typeof messages === 'string') {
            newErrors[field as keyof CounterpartyMutation] = messages
          }
        })
      }

      setErrors(prev => ({ ...prev, ...newErrors }))
    }
  }, [createError, updateError])

  const handleBlur = (field: keyof CounterpartyError, value: string | number) => {
    type ErrorMessages = {
      [key in keyof CounterpartyError]: string
    }

    const errorMessages: ErrorMessages = {
      name: !value ? 'Заполните имя контрагента.' : '',
    }

    setErrorsBlur(prev => ({
      ...prev,
      [field]: errorMessages[field] || '',
    }))
  }

  const checkCounterpartyNameExistence = (name: string): boolean => {
    if (!name.trim()) return false

    const existing = counterparties.find(
      counterparty => counterparty.name.toLowerCase() === name.toLowerCase() && counterparty._id !== counterpartyId,
    )

    if (existing) {
      setErrors(prev => ({ ...prev, name: 'Контрагент с таким именем уже существует' }))
      return true
    }

    setErrors(prev => ({ ...prev, name: '' }))
    return false
  }

  const validate = (name: keyof CounterpartyMutation, value?: string): string | undefined => {
    if (name === 'name') {
      if (!value?.trim()) return 'Поле не может быть пустым'
      if (checkCounterpartyNameExistence(value)) return 'Контрагент с таким именем уже существует'
    }
    if (name === 'phone_number' && value && !phoneNumberRegex.test(value)) {
      return 'Неправильный формат номера телефона'
    }
    return undefined
  }

  const validateFields = (): boolean => {
    const newErrors: { [K in keyof CounterpartyMutation]?: string } = {}

    requiredFields.forEach(field => {
      const value = form[field] as string
      const errorMessage = validate(field, value)
      if (errorMessage) newErrors[field] = errorMessage
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length > 0
  }

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value || '',
    }))

    setErrors(prev => ({ ...prev, [name]: '' }))

    if (name === 'phone_number') {
      setErrors(prev => ({
        ...prev,
        phone_number: value && !phoneNumberRegex.test(value)
          ? 'Неправильный формат номера телефона'
          : '',
      }))
    }

    if (name === 'name') checkCounterpartyNameExistence(value)
  }

  const getFieldError = (field: keyof CounterpartyMutation) => errors[field] || ''

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateFields()) return

    setSubmitting(true)

    try {
      const submissionData = {
        ...form,
        phone_number: form.phone_number?.trim() || undefined,
        address: form.address?.trim() || undefined,
      }

      if (counterpartyId) {
        await dispatch(updateCounterparty({ id: counterpartyId, data: submissionData })).unwrap()
        await dispatch(fetchAllCounterparties())
        toast.success('Контрагент успешно обновлен!')
      } else {
        await dispatch(createCounterparty(submissionData)).unwrap()
        await dispatch(fetchAllCounterparties())
        toast.success('Контрагент успешно создан!')
      }

      setForm(initialState)
      setErrorsBlur({ name:'' })
      onClose?.()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    form,
    loading: loadingAdd || loadingUpdate || submitting,
    inputChangeHandler,
    onSubmit,
    getFieldError,
    generalError,
    errors,
    createError,
    updateError,
    hasErrors: Object.keys(errors).length > 0,
    errorsBlur,
    handleBlur,
  }
}
