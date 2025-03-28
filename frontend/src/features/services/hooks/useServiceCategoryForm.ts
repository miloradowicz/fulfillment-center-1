import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ServiceCategoryMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectLoadingAddService } from '../../../store/slices/serviceSlice'
import { selectAllServiceCateogories } from '../../../store/slices/serviceCategorySlice'
import { createServiceCategory, fetchServiceCategories } from '../../../store/thunks/serviceCategoryThunk'
import { toast } from 'react-toastify'
import { clearCreationAndModificationError } from '../../../store/slices/serviceCategorySlice'

type Form = ServiceCategoryMutation

const initialState: Form = {
  name: '',
}

interface Errors {
  [key: string]: string;
}

const useServiceCategoryForm = (onClose: (id: string) => void) => {
  const [form, setForm] = useState<Form>(initialState)
  const [errors, setErrors] = useState<Errors>({})

  const serviceCategories = useAppSelector(selectAllServiceCateogories)

  const loading = useAppSelector(selectLoadingAddService)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setErrors({})
    dispatch(clearCreationAndModificationError())
    dispatch(fetchServiceCategories())
  }, [dispatch])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateFields = () => {
    if (!form.name) setErrors({ name: 'Имя обязятельно' })

    if (serviceCategories.find(x => x.name.toLowerCase() === form.name.toLowerCase())) setErrors({ name: 'Категория услуг с таким именем уже существует' })

    return Object.values(errors).some(error => error)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateFields()) return

    try {
      const serviceCategory = await dispatch(createServiceCategory(form)).unwrap()
      await dispatch(fetchServiceCategories())
      toast.success('Категория услуг успешно создана!')
      onClose(serviceCategory._id)
    } catch (e) {
      return void toast.error('Не удалось создать категорию услуг')
    }
  }

  return {
    form,
    loading,
    serviceCategories,
    handleInputChange,
    onSubmit,
    errors,
  }
}

export default useServiceCategoryForm
