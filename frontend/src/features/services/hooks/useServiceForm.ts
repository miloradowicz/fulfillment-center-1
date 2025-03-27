import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ServiceMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchServices } from '../../../store/thunks/serviceThunk'
import { selectAllServices, selectLoadingAddService } from '../../../store/slices/serviceSlice'

type Form = Omit<ServiceMutation, 'price'> & {
  price: string,
}

const initialState: Form = {
  name: '',
  price: '',
  description: '',
  serviceCategory: '',
}

interface Errors {
  name?: string;
  [key: `dynamicField_${number}`]: string;
}

const useServiceForm = (onClose: () => void) => {
  const [form, setForm] = useState<Form>(initialState)
  const [errors, setErrors] = useState<Errors>({})

  const services = useAppSelector(selectAllServices) ?? []

  const loading = useAppSelector(selectLoadingAddService)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch])

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // if (!form.name.trim()) {
    //   setErrors(prevErrors => ({ ...prevErrors, name: 'Название обязательно' }))
    //   return
    // }

    // if (dynamicFields.length === 0) {
    //   setErrors(prevErrors => ({ ...prevErrors, dynamicField_: 'Добавьте хотя бы одно дополнительное свойство' }))
    //   toast.warn('Добавьте хотя бы одно дополнительное свойство')
    //   return
    // }

    // const hasEmptyFields = dynamicFields.some(field => !field.key.trim() || !field.label.trim() || !field.value.trim())
    // if (hasEmptyFields) {
    //   setErrors(prevErrors => ({ ...prevErrors, dynamicField_: 'Все дополнительные поля должны быть заполнены' }))
    //   toast.warn('Все дополнительные поля должны быть заполнены')
    //   return
    // }

    // const keys = new Set<string>()
    // const labels = new Set<string>()
    // for (const field of dynamicFields) {
    //   if (keys.has(field.key) || labels.has(field.label)) {
    //     setErrors({ dynamicField_: 'Поле с таким ключом или названием уже существует' })
    //     toast.warn('Поле с таким ключом или названием уже существует')
    //     return
    //   }
    //   keys.add(field.key)
    //   labels.add(field.label)
    // }

    // try {
    //   const serviceData: ServiceMutation = {
    //     name: form.name,
    //     dynamic_fields: dynamicFields,
    //   }

    //   await dispatch(createService(serviceData)).unwrap()
    //   toast.success('Услуга успешно создана!')

    //   onClose()
    //   setForm({ name: '', dynamic_fields: [] })
    //   setDynamicFields([])
    //   setErrors({})
    // } catch (e) {
    //   if (isAxiosError(e) && e.response?.data) {
    //     console.error('Ошибка валидации:', e.response.data)

    //     if (e.response.data.message) {
    //       if (Array.isArray(e.response.data.message)) {
    //         setErrors(prev => ({
    //           ...prev,
    //           dynamicField_: e.response?.data.message.join(', '),
    //         }))
    //         toast.error(e.response.data.message.join(', '))
    //       } else {
    //         toast.error(e.response.data.message)
    //       }
    //     } else {
    //       toast.error('Ошибка при создании услуги. Проверьте данные и попробуйте снова.')
    //     }
    //   } else {
    //     console.error('Ошибка сервера:', e)
    //   }
    // }
  }

  return {
    form,
    loading,
    services,
    inputChangeHandler,
    onSubmit,
    errors,
  }
}

export default useServiceForm
