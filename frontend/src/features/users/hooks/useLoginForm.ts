import { ChangeEvent, FormEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { clearLoginError, selectLoginError, selectLoadingLoginUser } from '../../../store/slices/userSlice.ts'
import { loginUser } from '../../../store/thunks/userThunk.ts'
import { useNavigate } from 'react-router-dom'

class UnauthorizedException extends Error {
  constructor(public message: string) {
    super(message)
    this.name = 'UnauthorizedException'
  }
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (error instanceof UnauthorizedException) {
    return error.message
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }

  return undefined
}

export const useLoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const sending = useAppSelector(selectLoadingLoginUser)
  const loginError = useAppSelector(selectLoginError)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) return

    try {
      await dispatch(loginUser(form)).unwrap()
      setForm({ email: '', password: '' })
      setErrors({})
      dispatch(clearLoginError())
      navigate('/clients')
      toast.success('Вы успешно вошли!')
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      if (errorMessage) {
        toast.error(errorMessage)
      } else {
        toast.error('Произошла ошибка при входе')
      }
      setErrors(prev => ({ ...prev, email: '', password: '' }))
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    dispatch(clearLoginError(name))
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!form.email.trim()) {
      newErrors.email = 'Поле "Email" обязательно для заполнения'
    }
    if (!form.password.trim()) {
      newErrors.password = 'Поле "Пароль" обязательно для заполнения'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = form.email.trim() !== '' && form.password.trim() !== ''

  return {
    form,
    handleChange,
    onSubmit,
    isFormValid,
    sending,
    loginError,
    errors,
  }
}
