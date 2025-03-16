import Grid from '@mui/material/Grid2'
import { Box, Button, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { clearLoginError, selectLoginError, selectLoadingLoginUser } from '../../../store/slices/userSlice.ts'
import { loginUser } from '../../../store/thunks/userThunk.ts'
import { getFieldError } from '../../../utils/getFieldError.ts'

const LoginForm = () => {
  const dispatch = useAppDispatch()

  const sending = useAppSelector(selectLoadingLoginUser)
  const backendError = useAppSelector(selectLoginError)
  const [form, setForm] = useState({ email: '', password: '' })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(loginUser(form)).unwrap()
      setForm({ email: '', password: '' })
      dispatch(clearLoginError())
      toast.success('Вы успешно вошли!')
    } catch (error) {
      if (error && Array.isArray(error)) {
        const errorMessages = error.join('; ')
        toast.error(errorMessages)
      } else {
        toast.error('Ошибка входа')
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(clearLoginError(e.target.name))
    setForm(data => ({ ...data, [e.target.name]: e.target.value.trim() }))
  }

  const isFormValid = form.email.trim() !== '' && form.password.trim() !== ''

  return (
    <Box noValidate component="form" onSubmit={onSubmit} style={{ maxWidth: '20%', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
          Вход в систему
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
            error={!!getFieldError('email', backendError)}
            helperText={getFieldError('email', backendError)}
          />
        </Grid>

        <Grid size={12}>
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
            error={!!getFieldError('password', backendError)}
            helperText={getFieldError('password', backendError)}
          />
        </Grid>

        <Grid size={12}>
          <Button
            type="submit"
            loading={sending}
            variant="outlined"
            disabled={!isFormValid}
          >
              Войти
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LoginForm
