import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import { Arrival, Order, UserStripped } from '../../../types'
import { selectAllUsers } from '../../../store/slices/userSlice.ts'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllOrders } from '../../../store/slices/orderSlice.ts'
import { selectAllArrivals } from '../../../store/slices/arrivalSlice.ts'
import { fetchUsers } from '../../../store/thunks/userThunk.ts'
import { fetchOrders } from '../../../store/thunks/orderThunk.ts'
import { fetchArrivals } from '../../../store/thunks/arrivalThunk.ts'

interface TaskInterface {
  user: UserStripped | null;
  title: string;
  type: string;
  associatedOrder: Order | null;
  associatedArrival: Arrival | null;
}

const initialState = {
  user: null,
  title: '',
  type: 'другое',
  associatedOrder: null,
  associatedArrival: null,
}

const TaskForm = () => {
  const [form, setForm] = useState<TaskInterface>(initialState)
  const users = useAppSelector(selectAllUsers)
  const orders = useAppSelector(selectAllOrders)
  const arrivals = useAppSelector(selectAllArrivals)

  const dispatch = useAppDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
  }

  useEffect(() => {
    dispatch(fetchUsers())
    if (form.type === 'заказ'){
      dispatch(fetchOrders())
    }  else if (form.type === 'поставка'){
      dispatch(fetchArrivals())
    }
  }, [dispatch, form.type])

  const handleAutocompleteChange = (field: keyof TaskInterface, value: UserStripped | Order | Arrival | null) => {
    setForm(prevForm => ({
      ...prevForm,
      [field]: value,
    }))
  }

  const handleInputChange = (
    e:
      | SelectChangeEvent
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target

    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      {users &&
        <Autocomplete
          options={users}
          getOptionLabel={option => option.displayName}
          value={users.find(user => user._id === form.user?._id) || null}
          onChange={(_, newValue) => handleAutocompleteChange('user', newValue)}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={params => <TextField {...params} label="Пользователь" required />}
          size="small"
        />
      }

      <TextField
        label="Название"
        name="title"
        value={form.title}
        onChange={e => handleInputChange(e)}
        fullWidth
        size="small"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Тип задачи</InputLabel>
        <Select
          name="type"
          value={form.type}
          onChange={e => handleInputChange(e)}
          label="Тип задачи"
          size="small"
        >
          <MenuItem value="поставка">Поставка</MenuItem>
          <MenuItem value="заказ">Заказ</MenuItem>
          <MenuItem value="другое">Другое</MenuItem>
        </Select>
      </FormControl>

      {orders && form.type === 'заказ' && (
        <Autocomplete
          options={orders}
          getOptionLabel={option => option.orderNumber}
          value={form.associatedOrder}
          onChange={(_, newValue) => handleAutocompleteChange('associatedOrder', newValue)}
          renderInput={params => <TextField {...params} label="Заказ" />}
          size="small"
        />
      )}

      {arrivals && form.type === 'поставка' && (
        <Autocomplete
          options={arrivals}
          getOptionLabel={option => option.arrivalNumber}
          value={form.associatedArrival}
          onChange={(_, newValue) => handleAutocompleteChange('associatedArrival', newValue)}
          renderInput={params => <TextField {...params} label="Поставка" />}
          size="small"
        />
      )}

      <Button type="submit" variant="contained" color="primary">
        Создать задачу
      </Button>
    </form>
  )
}

export default TaskForm
