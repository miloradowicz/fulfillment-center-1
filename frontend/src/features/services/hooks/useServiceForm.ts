import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ServiceCategory, ServiceMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { createService, fetchServices } from '../../../store/thunks/serviceThunk'
import { selectAllServices, selectLoadingAddService } from '../../../store/slices/serviceSlice'
import { selectAllServiceCateogories } from '../../../store/slices/serviceCategorySlice'
import { fetchServiceCategories } from '../../../store/thunks/serviceCategoryThunk'
import { toast } from 'react-toastify'
import { clearCreationAndModificationError } from '../../../store/slices/serviceCategorySlice'
import { isAxiosError } from 'axios'

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
  [key: string]: string;
}

const useServiceForm = (onClose: () => void) => {
  const [form, setForm] = useState<Form>(initialState)
  const [errors, setErrors] = useState<Errors>({})
  const [open, setOpen] = useState(false)
  const [showCreateButton, setShowCreateButton] = useState(false)

  const services = useAppSelector(selectAllServices)
  const serviceCategories = useAppSelector(selectAllServiceCateogories)

  const loading = useAppSelector(selectLoadingAddService)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearCreationAndModificationError())
    dispatch(fetchServices())
    dispatch(fetchServiceCategories())
  }, [dispatch])

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleAutocompleteChange = (_: unknown, newValue: ServiceCategory | string | null) => {
    if (typeof newValue === 'string') {
      setShowCreateButton(true)
    } else {
      setErrors(prevErrors => ({ ...prevErrors, serviceCategory: '' }))
      setForm(prevState => ({ ...prevState, serviceCategory: newValue?._id ?? '' }))
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, name: 'Название обязательно' }))
      return
    }

    try {
      const serviceData: ServiceMutation = { ...form, price: Number.parseFloat(form.price) }

      await dispatch(createService(serviceData)).unwrap()
      toast.success('Услуга успешно создана!')

      onClose()
      setForm(initialState)
      setErrors({})
    } catch (e) {
      if (isAxiosError(e) && e.response?.data) {

        if (e.response.data.message) {
          if (Array.isArray(e.response.data.message)) {
            setErrors(prev => ({
              ...prev,
              dynamicField_: e.response?.data.message.join(', '),
            }))
            toast.error(e.response.data.message.join(', '))
          } else {
            toast.error(e.response.data.message)
          }
        } else {
          toast.error('Ошибка при создании услуги. Проверьте данные и попробуйте снова.')
        }
      } else {
        console.error('Ошибка сервера:', e)
      }
    }
  }

  return {
    form,
    loading,
    services,
    serviceCategories,
    open,
    showCreateButton,
    handleOpen,
    handleClose,
    handleInputChange,
    handleAutocompleteChange,
    onSubmit,
    errors,
  }
}

export default useServiceForm
