import Grid from '@mui/material/Grid2'
import { Box, Button, TextField, Typography } from '@mui/material'
import { getFieldError } from '../../../utils/getFieldError.ts'
import { useLoginForm } from '../hooks/useLoginForm.ts'

const LoginForm = () => {
  const { form, handleChange, onSubmit, isFormValid, sending, backendError } = useLoginForm()

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
