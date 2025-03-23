import React, { ChangeEvent, useState } from 'react'
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

interface User {
  id: string;
  name: string;
}

interface Order {
  id: string;
  title: string;
}

interface Arrival {
  id: string;
  title: string;
}

const users: User[] = [
  { id: '1', name: 'User 1' },
  { id: '2', name: 'User 2' },
]

const orders: Order[] = [
  { id: '1', title: 'Order 1' },
  { id: '2', title: 'Order 2' },
]

const arrivals: Arrival[] = [
  { id: '1', title: 'Arrival 1' },
  { id: '2', title: 'Arrival 2' },
]

interface FormState {
  user: User | null;
  type: 'поставка' | 'заказ' | 'другое';
  associatedOrder: Order | null;
  associatedArrival: Arrival | null;
  description: string;
}

const TaskForm = () => {
  const [form, setForm] = useState<FormState>({
    user: null,
    type: 'другое',
    associatedOrder: null,
    associatedArrival: null,
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      user: form.user,
      type: form.type,
      associatedOrder: form.type === 'заказ' ? form.associatedOrder : null,
      associatedArrival: form.type === 'поставка' ? form.associatedArrival : null,
      description: form.description,
    })
  }

  const handleAutocompleteChange = (field: keyof FormState, value: User | Order | Arrival | null) => {
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
      <Autocomplete
        options={users}
        getOptionLabel={option => option.name}
        value={form.user}
        onChange={(_, newValue) => handleAutocompleteChange('user', newValue)}
        renderInput={params => <TextField {...params} label="Пользователь" required />}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Тип задачи</InputLabel>
        <Select
          name="type"
          value={form.type}
          onChange={e => handleInputChange(e)}
          label="Тип задачи"
        >
          <MenuItem value="поставка">Поставка</MenuItem>
          <MenuItem value="заказ">Заказ</MenuItem>
          <MenuItem value="другое">Другое</MenuItem>
        </Select>
      </FormControl>

      {form.type === 'заказ' && (
        <Autocomplete
          options={orders}
          getOptionLabel={option => option.title}
          value={form.associatedOrder}
          onChange={(_, newValue) => handleAutocompleteChange('associatedOrder', newValue)}
          renderInput={params => <TextField {...params} label="Заказ" />}
        />
      )}

      {form.type === 'поставка' && (
        <Autocomplete
          options={arrivals}
          getOptionLabel={option => option.title}
          value={form.associatedArrival}
          onChange={(_, newValue) => handleAutocompleteChange('associatedArrival', newValue)}
          renderInput={params => <TextField {...params} label="Поставка" />}
        />
      )}

      <TextField
        label="Описание"
        multiline
        rows={4}
        value={form.description}
        onChange={e => handleInputChange(e)}
        fullWidth
        margin="normal"
      />

      <Button type="submit" variant="contained" color="primary">
        Создать задачу
      </Button>
    </form>
  )
}

export default TaskForm
