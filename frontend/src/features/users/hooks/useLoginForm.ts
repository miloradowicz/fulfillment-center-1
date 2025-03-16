import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { clearLoginError, selectLoginError, selectLoadingLoginUser } from '../../../store/slices/userSlice.ts'
import { loginUser } from '../../../store/thunks/userThunk.ts'

export const useLoginForm = () => {
  const dispatch = useAppDispatch()

  const sending = useAppSelector(selectLoadingLoginUser)
  const backendError = useAppSelector(selectLoginError)
  const [form, setForm] = useState({ email: '', password: '' })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(loginUser(form)).unwrap()
      setForm({ email: '', password: '' })
      dispatch(clearLoginError())
      toast.success('Вы успешно вошли!')
    } catch (error) {
      if (Array.isArray(error)) {
        const errorMessages = error.join('; ')
        toast.error(errorMessages)
      } else {
        toast.error('Ошибка входа')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(clearLoginError(e.target.name))
    setForm(data => ({ ...data, [e.target.name]: e.target.value.trim() }))
  }

  const isFormValid = form.email.trim() !== '' && form.password.trim() !== ''

  return {
    form,
    handleChange,
    onSubmit,
    isFormValid,
    sending,
    backendError,
  }
}
