import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { ClientMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectClientError, selectLoadingAddClient } from '../../../store/slices/clientSlice.ts'
import { addClient } from '../../../store/thunks/clientThunk.ts'
import { toast } from 'react-toastify'

const initialState: ClientMutation = {
  full_name: '',
  phone_number: '',
  email: '',
  inn: '',
  address: '',
  company_name: '',
  banking_data: '',
  ogrn: '',
}

const regPhoneNumber = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4})$/
const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/

const ClientForm = () => {
  const [form, setForm] = useState<ClientMutation>(initialState)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddClient)
  const createError = useAppSelector(selectClientError)
  const [errors, setErrors] = useState<{ email?: string; phone_number?: string }>({})

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.full_name.trim()) {
      toast.warn('Поле "ФИО" должно быть заполнено!')
      return
    }

    if (!form.phone_number.trim()) {
      toast.warn('Поле "Номер телефона" должно быть заполнено!')
      return
    }

    if (!form.email.trim()) {
      toast.warn('Поле "Эл. почта" должно быть заполнено!')
      return
    }

    if (!form.inn.trim()) {
      toast.warn('Поле "ИНН" должно быть заполнено!')
      return
    }

    await dispatch(addClient(form))
    setForm(initialState)
    toast.success('Клиент успешно создан!')
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prevState => ({ ...prevState, [name]: value }))

    if (name === 'email') {
      if (regEmail.test(value)) {
        setErrors(prevState => ({ ...prevState, email: '' }))
      } else {
        setErrors(prevState => ({ ...prevState, email: 'Неправильный формат Email' }))
      }
    }

    if (name === 'phone_number') {
      if (regPhoneNumber.test(value)) {
        setErrors(prevState => ({ ...prevState, phone_number: '' }))
      } else {
        setErrors(prevState => ({ ...prevState, phone_number: 'Неправильный формат номера телефона' }))
      }
    }
  }

  const getFieldError = (fieldName: string) => {
    try {
      if (fieldName === 'email' && errors.email) return errors.email
      if (fieldName === 'phone_number' && errors.phone_number) return errors.phone_number
      return createError ? createError.message : undefined
    } catch {
      return undefined
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
        <Typography variant='h4' sx={{ mb: 2 }}>Добавить нового клиента</Typography>
        <Grid container direction="column" spacing={2}>
          <Grid>
            <TextField
              id="full_name"
              name="full_name"
              label="ФИО"
              value={form.full_name}
              onChange={inputChangeHandler}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="phone_number"
              name="phone_number"
              label="Номер телефона"
              value={form.phone_number}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('phone_number'))}
              helperText={getFieldError('phone_number')}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="email"
              name="email"
              label="Эл. почта"
              value={form.email}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('email'))}
              helperText={getFieldError('email')}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="inn"
              name="inn"
              label="ИНН"
              value={form.inn}
              onChange={inputChangeHandler}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="address"
              name="address"
              label="Адрес"
              value={form.address}
              onChange={inputChangeHandler}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="company_name"
              name="company_name"
              label="Название компании"
              value={form.company_name}
              onChange={inputChangeHandler}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="banking_data"
              name="banking_data"
              label="Банковские реквизиты"
              value={form.banking_data}
              onChange={inputChangeHandler}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="ogrn"
              name="ogrn"
              label="ОГРН"
              value={form.ogrn}
              onChange={inputChangeHandler}
              fullWidth
            />
          </Grid>

          <Grid>
            <Button type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24}/> : 'Создать клиента'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ClientForm
