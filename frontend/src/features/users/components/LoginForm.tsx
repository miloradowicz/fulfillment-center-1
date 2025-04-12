import Grid from '@mui/material/Grid2'
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material'
import { getFieldError } from '@/utils/getFieldError.ts'
import { useLoginForm } from '../hooks/useLoginForm.ts'

const LoginForm = () => {
  const { form, handleChange, onSubmit, isFormValid, sending, loginError, errors } = useLoginForm()

  return (
    <Box
      noValidate
      component="form"
      onSubmit={onSubmit}
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
        Вход в систему
      </Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            size="medium"
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
            size="medium"
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
            variant="contained"
            fullWidth
            color="primary"
            disabled={!isFormValid || sending}
            sx={{ py: 1.5, fontSize: '16px' }}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LoginForm
