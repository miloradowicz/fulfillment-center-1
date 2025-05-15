import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ServiceCategory, ServiceMutation, ValidationError } from '@/types'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { createService, fetchServiceById, fetchServices, updateService } from '@/store/thunks/serviceThunk'
import { selectAllServices, selectLoadingAddService, selectService, selectServiceCreationAndModificationError } from '@/store/slices/serviceSlice'
import { selectAllServiceCateogories, selectLoadingAddServiceCategory, selectLoadingFetchServiceCategory, selectServiceCategoryCreationAndModificationError } from '@/store/slices/serviceCategorySlice'
import { createServiceCategory, deleteServiceCategory, fetchServiceCategories } from '@/store/thunks/serviceCategoryThunk'
import { toast } from 'react-toastify'
import { clearCreationAndModificationError as clearServiceCreateError } from '@/store/slices/serviceSlice'
import { clearCreationAndModificationError as clearServiceCategoryCreateError } from '@/store/slices/serviceCategorySlice'
import { isAxiosError } from 'axios'
import { isGlobalError, isServiceCategory, isValidationError } from '@/utils/helpers'
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
  type: 'внутренняя',
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

  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchServiceCategories())
    if (serviceId) {
      dispatch(fetchServiceById(serviceId))
    }
  }, [dispatch, serviceId])

  useEffect(() => {
    dispatch(clearServiceCreateError())
    dispatch(clearServiceCategoryCreateError())
    dispatch(fetchServices())
  }, [dispatch])

  useEffect(() => {
    if (serviceId && service) {
      const category = serviceCategories.find(x => x._id === service.serviceCategory._id)

      if (category) {
        setForm({
          name: service.name,
          price: service.price.toString(),
          description: service.description || '',
          type: service.type,
          serviceCategory: category,
        })
      }
    }
  }, [serviceId, service, serviceCategories])

  useEffect(() => {
    if (isValidationError(createServiceError)) {
      setErrors(() => (reassemble(createServiceError)))
    }

    if (isValidationError(createServiceCategoryError)) {
      setErrors(() => ( { serviceCategory: createServiceCategoryError.errors.name.messages.join(', ') }))
    }
  }, [createServiceError, createServiceCategoryError])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleAutocompleteChange = async (_: unknown, newValue: ServiceCategory | string | null) => {
    setErrors(prevErrors => ({ ...prevErrors, serviceCategory: '' }))

    if (newValue === null) {
      setForm(prevState => ({ ...prevState, serviceCategory: null }))
      return
    }

    if (isServiceCategory(newValue)) {
      setForm(prevState => ({ ...prevState, serviceCategory: newValue }))
      return
    }

    if (newValue.trim() !== '') {
      try {
        const existingCategory = serviceCategories.find(
          cat => cat.name.toLowerCase() === newValue.toLowerCase(),
        )

        if (existingCategory) {
          setForm(prevState => ({
            ...prevState,
            serviceCategory: existingCategory,
          }))
          return
        }

        const category = await dispatch(createServiceCategory({ name: newValue })).unwrap()
        await dispatch(fetchServiceCategories())

        setForm(prevState => ({
          ...prevState,
          serviceCategory: category,
        }))
      } catch (e) {
        setErrors(prev => ({
          ...prev,
          serviceCategory: 'Не удалось создать категорию',
        }))
        console.error(e)
      }
    } else {
      setForm(prevState => ({ ...prevState, serviceCategory: null }))
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await dispatch(deleteServiceCategory(categoryId)).unwrap()
      await dispatch(fetchServiceCategories())

      if (form.serviceCategory?._id === categoryId) {
        setForm(prev => ({ ...prev, serviceCategory: null }))
      }
      toast.success('Категория успешно удалена')
    } catch (error) {
      toast.error('Не удалось удалить категорию')
      console.error(error)
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

    if (!form.serviceCategory) {
      setErrors(prev => ({
        ...prev,
        serviceCategory: 'Выберите категорию услуги',
      }))
      return
    }

    const serviceData = {
      name: form.name,
      price: Number.parseFloat(form.price),
      description: form.description,
      type: form.type,
      serviceCategory: form.serviceCategory._id,
    }

    try {
      if (serviceId) {
        await dispatch(updateService({ id: serviceId, data: serviceData })).unwrap()
        await dispatch(fetchServices())
        toast.success('Услуга успешно обновлена!')
      } else {
        await dispatch(createService(serviceData)).unwrap()
        await dispatch(fetchServices())
        toast.success('Услуга успешно создана!')
        setForm(initialState)
      }
    } catch (e) {
      if (isAxiosError(e) && e.response?.data) {
        if (isGlobalError(e.response.data)) {
          toast.error(e.response.data.message)
        } else {
          toast.error(serviceId
            ? 'Ошибка при обновлении услуги. Проверьте данные и попробуйте снова.'
            : 'Ошибка при создании услуги. Проверьте данные и попробуйте снова.')
        }
      } else {
        console.error('Ошибка сервера:', e)
      }
    }

    if (onClose) onClose()
  }

  return {
    form,
    loading,
    services,
    serviceCategories,
    addCategoryLoading,
    fetchCategoryLoading,
    handleInputChange,
    handleAutocompleteChange,
    handleDeleteCategory,
    onSubmit,
    errors,
    createServiceError,
    createServiceCategoryError,
    inputValue,
    setInputValue,
    open,
    setOpen,
  }
}

export default useServiceForm
