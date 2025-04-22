import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { TaskMutation, TaskWithPopulate } from '@/types'
import { initialErrorState, initialState, TaskError } from '../state/taskState.ts'
import { selectAllUsers } from '@/store/slices/userSlice.ts'
import { selectAllOrders } from '@/store/slices/orderSlice.ts'
import { selectAllArrivals } from '@/store/slices/arrivalSlice.ts'
import { selectCreateError, selectLoadingAddTask, selectLoadingUpdateTask } from '@/store/slices/taskSlice.ts'
import { toast } from 'react-toastify'
import { addTask, fetchTasksWithPopulate, updateTask } from '@/store/thunks/tasksThunk.ts'
import { SelectChangeEvent } from '@mui/material'
import { fetchArrivals } from '@/store/thunks/arrivalThunk.ts'
import { fetchOrders } from '@/store/thunks/orderThunk.ts'
import { fetchUsers } from '@/store/thunks/userThunk.ts'
import { PopoverType } from '@/components/CustomSelect/CustomSelect.tsx'

const userSelectionError = 'Выберите пользователя'
const titleMissingError =  'Введите название задачи'
const taskTypeMissingError =  'Укажите тип задачи'
const missingAssociatedNumber = (value: string) => toast.error(`Укажите номер ${ value }`)

const UseTaskForm = (onSuccess?: () => void, initialData?: TaskWithPopulate) => {
  const dispatch = useAppDispatch()
  const [form, setForm] = useState<TaskMutation>(initialState)
  const [errors, setErrors] = useState<Record<string, string>>(initialErrorState)
  const users = useAppSelector(selectAllUsers)
  const orders = useAppSelector(selectAllOrders)
  const arrivals = useAppSelector(selectAllArrivals)
  const addLoading = useAppSelector(selectLoadingAddTask)
  const updateLoading = useAppSelector(selectLoadingUpdateTask)
  const error = useAppSelector(selectCreateError)

  const [activePopover, setActivePopover] = useState<PopoverType>(null)

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers())
    }
  }, [dispatch, users])

  useEffect(() => {
    if (form.type === 'поставка') {
      dispatch(fetchArrivals())
    } else if (form.type === 'заказ') {
      dispatch(fetchOrders())
    }
  }, [dispatch, form.type])

  useEffect(() => {
    if (initialData) {
      setForm({
        user: initialData.user._id,
        title: initialData.title,
        description: initialData.description || '',
        associated_arrival: initialData.associated_arrival?._id || null,
        associated_order: initialData.associated_order?._id || null,
        type: initialData.type,
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.user) return toast.error(userSelectionError)
    if (!form.title) return toast.error(titleMissingError)
    if (!form.type) return toast.error(taskTypeMissingError)

    if (form.type === 'поставка' && !form.associated_arrival) return missingAssociatedNumber('поставки')
    if (form.type === 'заказ' && !form.associated_order) return missingAssociatedNumber('заказа')

    try {
      if (initialData) {
        await dispatch(updateTask({ taskId: initialData._id, data: form })).unwrap()
        toast.success('Задача успешно обновлена')
      } else {
        await dispatch(addTask(form)).unwrap()
        toast.success('Задача успешно создана')
        setForm(initialState)
      }
      dispatch(fetchTasksWithPopulate())
      onSuccess?.()
      setErrors(initialErrorState)
    } catch (e) {
      console.error(e)
    }
  }

  const handleInputChange = (
    e: SelectChangeEvent | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target

    setForm(prevForm => ({ ...prevForm, [name]: value }))
  }

  const handleBlur = (field: keyof TaskError, value: string) => {
    type ErrorMessages = {
      [key in keyof TaskError]: string
    }

    const errorMessages: ErrorMessages = {
      user: !value ? userSelectionError : '',
      title: !value ? titleMissingError : '',
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessages[field] || '',
    }))
  }

  return {
    form,
    users,
    orders,
    arrivals,
    errors,
    error,
    addLoading,
    updateLoading,
    handleSubmit,
    handleInputChange,
    handleBlur,
    setForm,
    activePopover,
    setActivePopover,
  }
}

export default UseTaskForm
