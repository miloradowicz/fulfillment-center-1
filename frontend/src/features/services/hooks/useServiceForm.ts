import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ServiceCategory, ServiceMutation, ValidationError } from '@/types'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { createService, fetchServiceById, fetchServices } from '@/store/thunks/serviceThunk'
import { selectAllServices, selectLoadingAddService, selectService, selectServiceCreationAndModificationError } from '@/store/slices/serviceSlice'
import { selectAllServiceCateogories, selectLoadingAddServiceCategory, selectLoadingFetchServiceCategory, selectServiceCategoryCreationAndModificationError } from '@/store/slices/serviceCategorySlice'
import { createServiceCategory, fetchServiceCategories } from '@/store/thunks/serviceCategoryThunk'
import { toast } from 'react-toastify'
import { clearCreationAndModificationError as clearServiceCreateError } from '@/store/slices/serviceSlice'
import { clearCreationAndModificationError as clearServiceCategoryCreateError } from '@/store/slices/serviceCategorySlice'
import { isAxiosError } from 'axios'
import { isGlobalError, isValidationError } from '@/utils/helpers'
import { positiveDecimalNumber } from '@/constants'


const requiredFields: (keyof Form)[] = ['name', 'serviceCategory', 'price']

type Form = Omit<ServiceMutation, 'serviceCategory' | 'price'> & {
  price: string,
  serviceCategory: ServiceCategory | null
}

const initialState: Form = {
  name: '',
  price: '',
  description: '',
  serviceCategory: null,
}

interface Errors {
  [key: string]: string;
}

const reassemble = (e: ValidationError) => {
  return Object.entries(e.errors)
    .map(([k, v]) => ({ [k]: v.messages.join(', ') }))
    .reduce((a, x) => ({ ...a, ...x }), {})
}

const useServiceForm = (serviceId?: string, onClose?: () => void) => {
  const [form, setForm] = useState<Form>(initialState)
  const [errors, setErrors] = useState<Errors>({})
  const addCategoryLoading = useAppSelector(selectLoadingAddServiceCategory)
  const fetchCategoryLoading = useAppSelector(selectLoadingFetchServiceCategory)

  const service = useAppSelector(selectService)
  const services = useAppSelector(selectAllServices)
  const serviceCategories = useAppSelector(selectAllServiceCateogories)

  const createServiceCategoryError = useAppSelector(selectServiceCategoryCreationAndModificationError)
  const createServiceError = useAppSelector(selectServiceCreationAndModificationError)

  const loading = useAppSelector(selectLoadingAddService)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceById(serviceId))
    }
  }, [dispatch, serviceId])

  useEffect(() => {
    if (serviceId && service) {
      const category = serviceCategories.find(x => x._id === service._id)
      setForm({ ...service, price: service.price.toString(), serviceCategory: category ?? null })
    }
  }, [serviceId, service, serviceCategories])

  useEffect(() => {
    dispatch(clearServiceCreateError())
    dispatch(clearServiceCategoryCreateError())
    dispatch(fetchServices())
    dispatch(fetchServiceCategories())
  }, [dispatch])

  useEffect(() => {
    if (isValidationError(createServiceError)) {
      setErrors(() => (reassemble(createServiceError)))
    }

    if (isValidationError(createServiceCategoryError)) {
      setErrors(() => ( { serviceCategory: createServiceCategoryError.errors.name.messages.join(', ') }))
    }
  }, [createServiceError, createServiceCategoryError])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleAutocompleteChange = async (_: unknown, newValue: ServiceCategory | string | null) => {
    setErrors(prevErrors => ({ ...prevErrors, serviceCategory: '' }))
    if (typeof newValue === 'string') {
      try {
        const category = await dispatch(createServiceCategory({ name: newValue })).unwrap()
        await dispatch(fetchServiceCategories())
        setForm(prevState => ({
          ...prevState,
          serviceCategory: category as ServiceCategory,
        }))
      } catch (e) {
        setForm(prevState => ({
          ...prevState,
          serviceCategory: null,
        }))
        console.error(e)
      }
    } else {
      setForm(prevState => ({ ...prevState, serviceCategory: newValue }))
    }
  }

  const validateField = (name: keyof Form, value: unknown): string => {
    if (typeof value === 'string') {
      if (!value.trim()) return 'Поле не может быть пустым'
      if (name === 'price' && !positiveDecimalNumber.test(value)) return 'Цена должна быть положительным числом'
    } else {
      if (!value) return 'Поле не может быть пустым'
    }
    return ''
  }


  const validateFields = () => {
    const newErrors: Errors = {}

    requiredFields.forEach(field => {
      newErrors[field] = validateField(field, form[field] || '')
    })

    setErrors(newErrors)
    return Object.values(newErrors).some(error => error)
  }

  const checkServiceNameExistence = (name: string) => {
    const existingService = services.find(
      service => service.name.toLowerCase() === name.toLowerCase() && service._id !== serviceId,
    )
    if (existingService) {
      setErrors(prev => ({
        ...prev,
        name: 'Услуга с таким именем уже существует',
      }))
      return true
    }
    setErrors(prev => {
      const { name, ...rest } = prev
      return rest
    })
    return false
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateFields()) return

    if (checkServiceNameExistence(form.name)) return

    const serviceData: ServiceMutation = { ...form, price: Number.parseFloat(form.price), serviceCategory: form.serviceCategory?._id ?? '' }

    try {
      await dispatch(createService(serviceData)).unwrap()
      toast.success('Услуга успешно создана!')

      setForm(initialState)
    } catch (e) {
      if (isAxiosError(e) && e.response?.data) {
        if (isGlobalError(e.response.data)) {
          return void toast.error(e.response.data.message)
        } else {
          return void toast.error('Ошибка при создании услуги. Проверьте данные и попробуйте снова.')
        }
      } else {
        return void console.error('Ошибка сервера:', e)
      }
    }

    if (onClose) onClose()
  }

  return {
    form,
    loading,
    services,
    serviceCategories,
    open,
    addCategoryLoading,
    fetchCategoryLoading,
    handleInputChange,
    handleAutocompleteChange,
    onSubmit,
    errors,
    createServiceError,
    createServiceCategoryError,
  }
}

export default useServiceForm
