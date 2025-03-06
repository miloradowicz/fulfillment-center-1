import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { ClientMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectClientError, selectLoadingAddClient, selectAllClients } from '../../../store/slices/clientSlice.ts'
import { addClient, fetchClients } from '../../../store/thunks/clientThunk.ts'
import { toast } from 'react-toastify'

const initialState: ClientMutation = {
  name: '',
  phone_number: '',
  email: '',
  inn: '',
  address: '',
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
  const clients = useAppSelector(selectAllClients)
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone_number?: string;
    inn?: string;
  }>({})

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])


  const validateFields = useCallback(() => {
    const newErrors: typeof errors = {}

    if (!form.name.trim()) newErrors.name = 'Поле не может быть пустым'
    if (!form.phone_number.trim()) newErrors.phone_number = 'Поле не может быть пустым'
    if (!form.email.trim()) newErrors.email = 'Поле не может быть пустым'
    if (!form.inn.trim()) newErrors.inn = 'Поле не может быть пустым'

    if (JSON.stringify(newErrors) !== JSON.stringify(errors)) {
      setErrors(newErrors)
    }
  }, [form, errors])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.values(errors).some(error => error) ||
      !form.name.trim() ||
      !form.phone_number.trim() ||
      !form.email.trim() ||
      !form.inn.trim()) {
      validateFields()
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
      if (!value.trim()) {
        setErrors(prevState => ({ ...prevState, email: 'Поле не может быть пустым' }))
      } else if (regEmail.test(value)) {
        setErrors(prevState => ({ ...prevState, email: '' }))
      } else {
        setErrors(prevState => ({ ...prevState, email: 'Неправильный формат Email' }))
      }
    }

    if (name === 'phone_number') {
      if (!value.trim()) {
        setErrors(prevState => ({ ...prevState, phone_number: 'Поле не может быть пустым' }))
      } else if (regPhoneNumber.test(value)) {
        setErrors(prevState => ({ ...prevState, phone_number: '' }))
      } else {
        setErrors(prevState => ({ ...prevState, phone_number: 'Неправильный формат номера телефона' }))
      }
    }

    if (name === 'inn') {
      if (!value.trim()) {
        setErrors(prevState => ({ ...prevState, inn: 'Поле не может быть пустым' }))
      } else {
        setErrors(prevState => ({ ...prevState, inn: '' }))
      }
    }

    if (name === 'name' && clients) {
      if (!value.trim()) {
        setErrors(prevState => ({ ...prevState, name: 'Поле не может быть пустым' }))
      } else {
        const trimmedValue = value.trim()
        const nameExists = clients.some(client =>
          client.name.toLowerCase() === trimmedValue.toLowerCase(),
        )

        if (nameExists) {
          setErrors(prevState => ({ ...prevState, name: 'Клиент с таким именем уже существует' }))
        } else {
          setErrors(prevState => ({ ...prevState, name: '' }))
        }
      }
    }
  }

  const getFieldError = (fieldName: string) => {
    try {
      if (fieldName === 'email' && errors.email) return errors.email
      if (fieldName === 'phone_number' && errors.phone_number) return errors.phone_number
      if (fieldName === 'name' && errors.name) return errors.name
      if (fieldName === 'inn' && errors.inn) return errors.inn
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
              id="name"
              name="name"
              label="ФИО / Название комании *"
              value={form.name}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="phone_number"
              name="phone_number"
              label="Номер телефона *"
              value={form.phone_number}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('phone_number'))}
              helperText={getFieldError('phone_number')}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="email"
              name="email"
              label="Эл. почта *"
              value={form.email}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('email'))}
              helperText={getFieldError('email')}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="inn"
              name="inn"
              label="ИНН *"
              value={form.inn}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('inn'))}
              helperText={getFieldError('inn')}
              fullWidth
              size='small'
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
              size='small'
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
              size='small'
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
              size='small'
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
