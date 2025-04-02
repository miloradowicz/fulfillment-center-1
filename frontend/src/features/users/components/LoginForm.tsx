import Grid from '@mui/material/Grid2'
import { Box, Button, TextField, Typography } from '@mui/material'
import { getFieldError } from '../../../utils/getFieldError.ts'
import { useLoginForm } from '../hooks/useLoginForm.ts'

const LoginForm = () => {
  const { form, handleChange, onSubmit, isFormValid, sending, loginError, errors } = useLoginForm()

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
            error={Boolean(errors.email || getFieldError('email', loginError))}
            helperText={errors.email || getFieldError('email', loginError)}
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
            error={Boolean(errors.password || getFieldError('password', loginError))}
            helperText={errors.password || getFieldError('password', loginError)}
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
