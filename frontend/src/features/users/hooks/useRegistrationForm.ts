import { passwordStrength, DiversityType } from 'check-password-strength'
import React, { useEffect, useState, ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { passwordStrengthOptions, emailRegex, roles } from '@/constants.ts'
import { selectCreateError, selectLoadingRegisterUser, clearCreateError } from '@/store/slices/authSlice.ts'
import { fetchUsers, registerUser, updateUser } from '@/store/thunks/userThunk.ts'
import { UserRegistrationMutation, UserUpdateMutation } from '@/types'

type UserMutation = Omit<UserUpdateMutation, '_id'>
type FormType = UserRegistrationMutation | (Omit<UserRegistrationMutation, 'role'> & { role: '' })

const isUserRegistrationMutation = (type: FormType): type is UserRegistrationMutation =>
  roles.map(x => x.name).includes(type.role)

const initialState: FormType = {
  email: '',
  password: '',
  displayName: '',
  role: '',
}

export const useRegistrationForm = (
  onSuccess?: () => void,
  initialFormData?: Partial<UserUpdateMutation>,
) => {
  const dispatch = useAppDispatch()
  const sending = useAppSelector(selectLoadingRegisterUser)
  const backendError = useAppSelector(selectCreateError)

  const [frontendError, setFrontendError] = useState<{ [key: string]: string }>({})
  const [form, setForm] = useState<FormType>({ ...initialState, ...initialFormData })
  const [confirmPassword, setConfirmPassword] = useState('')

  const isEditMode = !!initialFormData?._id

  useEffect(() => {
    dispatch(clearCreateError())
  }, [dispatch])

  useEffect(() => {
    if (initialFormData) {
      setForm(prev => ({ ...prev, ...initialFormData }))
    }
  }, [initialFormData])

  const checkStrength = (password: string) => {
    const strength = passwordStrength(password, passwordStrengthOptions)
    return (
      strength.id > 0 &&
      ['number', 'uppercase', 'lowercase'].every(x =>
        strength.contains.includes(x as DiversityType),
      )
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isUserRegistrationMutation(form)) {
      return void validateFields('role')
    }

    try {
      setForm(data => ({ ...data, displayName: data.displayName.trim() }))

      if (form.password || confirmPassword) {
        if (form.password !== confirmPassword) {
          return void toast.error('Пароли не совпадают')
        }

        if (!checkStrength(form.password)) {
          return void toast.error(
            'Слишком слабый пароль. Пароль должен быть не короче 8 символов и содержать одну заглавную и одну строчную латинские буквы, одну цифру',
          )
        }
      }

      if (isEditMode && initialFormData?._id) {
        const { _id, ...rest } = form as UserUpdateMutation

        const updatedUser: UserMutation = { ...rest }
        if (!form.password) {
          delete updatedUser.password
        }

        await dispatch(updateUser({
          userId: initialFormData._id,
          data: updatedUser,
        })).unwrap()

        toast.success('Пользователь обновлён!')
        await dispatch(fetchUsers())
      } else {
        await dispatch(registerUser(form)).unwrap()
        toast.success('Пользователь создан!')
      }

      setForm(initialState)
      setConfirmPassword('')
      dispatch(clearCreateError())
      setFrontendError({})
      onSuccess?.()
    } catch {
      toast.error('Произошла ошибка при сохранении пользователя.')
    }
  }

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const _error = { ...frontendError }
    delete _error.confirmPassword
    setFrontendError(_error)
    setConfirmPassword(e.target.value)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch(clearCreateError(e.target.name))
    let value = e.target.value as string
    if (e.target.name !== 'displayName') {
      value = value.trim()
    }
    setForm(data => ({ ...data, [e.target.name]: value }))
  }

  const validateFields = (...fieldNames: string[]) => {
    fieldNames.forEach(x => {
      const value = x === 'confirmPassword' ? confirmPassword : form[x as keyof typeof form]

      if (!value?.trim()) return

      setFrontendError(prev => {
        const updated = { ...prev }
        delete updated[x]
        return updated
      })

      switch (x) {
      case 'email':
        if (!emailRegex.test(form.email)) {
          setFrontendError(error => ({ ...error, [x]: 'Недействительная почта.' }))
        }
        break

      case 'confirmPassword':
        if (form.password && confirmPassword && form.password !== confirmPassword) {
          setFrontendError(error => ({ ...error, [x]: 'Пароли не совпадают.' }))
        }
        break

      case 'role':
        if (!roles.map(x => x.name).includes(form.role)) {
          setFrontendError(error => ({ ...error, [x]: 'Укажите роль.' }))
        }
        break
      }
    })
  }

  const handleBlur = (field: keyof FormType | 'confirmPassword', value: string) => {
    type ErrorMessages = {
      [key in keyof FormType | 'confirmPassword']: string
    }

    const errorMessages: ErrorMessages = {
      email: !value.trim() ? 'Введите email.' : '',
      displayName: !value.trim() ? 'Введите отображаемое имя.' : '',
      password: !value.trim() ? 'Введите пароль.' : '',
      role: !value.trim() ? 'Выберите роль.' : '',
      confirmPassword: !value.trim() ? 'Повторите пароль.' : '',
    }

    setFrontendError(prev => ({
      ...prev,
      [field]: errorMessages[field],
    }))
  }

  const getFieldError = (fieldName: string) => {
    try {
      return frontendError[fieldName] || backendError?.errors[fieldName].messages.join('; ')
    } catch {
      return undefined
    }
  }

  const isFormValid = () => {
    const requiredFields = ['email', 'displayName', 'role']
    const filled = requiredFields.every(field => form[field as keyof typeof form].trim() !== '')
    const passwordValid = form.password ? confirmPassword.trim() !== '' : true
    return filled && passwordValid
  }

  return {
    sending,
    backendError,
    frontendError,
    setFrontendError,
    form,
    setForm,
    confirmPassword,
    setConfirmPassword,
    checkStrength,
    onSubmit,
    handleConfirmPasswordChange,
    handleChange,
    validateFields,
    getFieldError,
    isFormValid,
    isEditMode,
    handleBlur,
  }
}
