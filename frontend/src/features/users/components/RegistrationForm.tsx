import Grid from '@mui/material/Grid2'
import { Box, Button, MenuItem, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import {  UserRegistrationMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { clearCreateError, selectCreateError, selectLoadingRegisterUser } from '../../../store/slices/userSlice.ts'
import SelectField from '../../../components/SelectField/SelectField.tsx'
import { emailRegex, roles } from '../../../constants.ts'
import { registerUser } from '../../../store/thunks/userThunk.ts'

type FormType = UserRegistrationMutation | (Omit<UserRegistrationMutation, 'role'> & { role: ''})

const isUserRegistrationMutation = (type: FormType): type is UserRegistrationMutation =>
  roles.map(x => x.name).includes(type.role)

const initialState: UserRegistrationMutation | (Omit<UserRegistrationMutation, 'role'> & { role: ''}) = {
  email: '',
  password: '',
  displayName: '',
  role: '',
}

const RegistrationForm = () => {
  const dispatch = useAppDispatch()

  const sending = useAppSelector(selectLoadingRegisterUser)
  const backendError = useAppSelector(selectCreateError)
  const [frontendError, setFrontendError] = useState<{ [key: string]: string }>({})
  const [form, setForm] = useState(initialState)
  const [confirmPassword, setConfirmPassword] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isUserRegistrationMutation(form)) {
      return void validateField('role')
    } else {
      try {
        setForm(data => ({ ...data, displayName: data.displayName.trim() }))
        await dispatch(registerUser(form)).unwrap()

        setForm(initialState)
        setConfirmPassword('')
        dispatch(clearCreateError())
        setFrontendError({})
        toast.success('Пользователь успешно создан!')
      } catch {
        toast.error('Пользователь не создан')
      }
    }
  }

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const _error = { ...frontendError }
    delete _error.confirmPassword
    setFrontendError(_error)

    setConfirmPassword(e.target.value)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>) => {
    dispatch(clearCreateError(e.target.name))

    let value = e.target.value as string

    if (e.target.name !== 'displayName')
    {
      value = value.trim()
    }

    setForm(data => ({ ...data, [e.target.name]: value }))
  }

  const validateField = (fieldName: string) => {
    const _error = { ...frontendError }
    delete _error[fieldName]
    setFrontendError(_error)

    switch (fieldName) {
    case 'email':
      if(!emailRegex.test(form.email)) {
        setFrontendError(error => ({ ...error, [fieldName]: 'Недействительная почта' }))
      }
      break

    case 'confirmPassword':
      if (form.password !== confirmPassword) {
        setFrontendError(error => ({ ...error, [fieldName]: 'Пароли не совпадают' }))
      }
      break

    case 'role':
      if (!roles.map(x => x.name).includes(form.role)) {
        setFrontendError(error => ({ ...error, [fieldName]: 'Укажите роль' }))
      }
      break
    }
  }

  const getFieldError = (fieldName: string) => {
    try {
      return frontendError[fieldName] || (backendError)?.errors[fieldName].messages.join('; ')
    } catch {
      return undefined
    }
  }

  return (
    <>
      <Box noValidate component="form" onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Добавить нового пользователя
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              required
              fullWidth
              size="small"
              id="email"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              error={!!getFieldError('email')}
              helperText={getFieldError('email')}
              onBlur={() => validateField('email')}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              required
              fullWidth
              size="small"
              id="displayName"
              name="displayName"
              label="Отображаемое имя"
              value={form.displayName}
              onChange={handleChange}
              error={!!getFieldError('displayName')}
              helperText={getFieldError('displayName')}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              required
              fullWidth
              size="small"
              type="password"
              id="password"
              name="password"
              label="Пароль"
              value={form.password}
              onChange={handleChange}
              error={!!getFieldError('password')}
              helperText={getFieldError('password')}
              onBlur={() => validateField('confirmPassword')}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              required
              fullWidth
              size="small"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Подтвердите пароль"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!getFieldError('confirmPassword')}
              helperText={getFieldError('confirmPassword')}
              onBlur={() => validateField('confirmPassword')}
            />
          </Grid>

          <Grid size={12}>
            <SelectField
              required
              fullWidth
              size="small"
              id="role"
              name="role"
              label="Роль"
              defaultValue="default"
              value={form.role}
              onChange={handleChange}
              error={!!getFieldError('role')}
              helperText={getFieldError('role')}
              onBlur={() => validateField('role')}
            >
              {roles.map((x, i) => (
                <MenuItem key={i} value={x.name}>
                  {x.title}
                </MenuItem>
              ))}
            </SelectField>
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              loading={sending}
              variant="outlined"
              disabled={!!backendError && !!Object.keys(backendError.errors).length}
            >
              Создать пользователя
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RegistrationForm
