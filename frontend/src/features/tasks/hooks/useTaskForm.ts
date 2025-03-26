import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { TaskMutation } from '../../../types'
import { initialErrorState, initialState, TaskError } from '../state/taskState.ts'
import { selectAllUsers } from '../../../store/slices/userSlice.ts'
import { selectAllOrders } from '../../../store/slices/orderSlice.ts'
import { selectAllArrivals } from '../../../store/slices/arrivalSlice.ts'
import { selectCreateError, selectLoadingAddTask } from '../../../store/slices/taskSlice.ts'
import { fetchUsers } from '../../../store/thunks/userThunk.ts'
import { fetchOrders } from '../../../store/thunks/orderThunk.ts'
import { fetchArrivals } from '../../../store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'
import { addTask } from '../../../store/thunks/tasksThunk.ts'
import { SelectChangeEvent } from '@mui/material'

const userSelectionError = 'Выберите пользователя'
const titleMissingError =  'Введите название задачи'
const taskTypeMissingError =  'Укажите тип задачи'

const UseTaskForm = () => {
  const dispatch = useAppDispatch()
  const [form, setForm] = useState<TaskMutation>(initialState)
  const [errors, setErrors] = useState<Record<string, string>>(initialErrorState)
  const users = useAppSelector(selectAllUsers)
  const orders = useAppSelector(selectAllOrders)
  const arrivals = useAppSelector(selectAllArrivals)
  const addLoading = useAppSelector(selectLoadingAddTask)
  const error = useAppSelector(selectCreateError)

  useEffect(() => {
    dispatch(fetchUsers())
    if (form.type === 'заказ') {
      dispatch(fetchOrders())
    } else if (form.type === 'поставка') {
      dispatch(fetchArrivals())
    }
  }, [dispatch, form.type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.user) return toast.error(userSelectionError)
    if (!form.title) return toast.error(titleMissingError)
    if (!form.type) return toast.error(taskTypeMissingError)

    try {
      await dispatch(addTask(form))
      setForm(initialState)
      setErrors(initialErrorState)
      toast.success('Задача успешно создна')
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
    handleSubmit,
    handleInputChange,
    handleBlur,
    setForm,
  }
}

export default UseTaskForm
