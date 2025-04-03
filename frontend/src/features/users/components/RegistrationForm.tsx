import Grid from '@mui/material/Grid2'
import { Box, Button, MenuItem, TextField, Typography, CircularProgress } from '@mui/material'
import SelectField from '../../../components/SelectField/SelectField.tsx'
import { roles } from '../../../constants.ts'
import { useRegistrationForm } from '../hooks/useRegistrationForm.ts'

const RegistrationForm = () => {
  const {
    sending,
    backendError,
    form,
    confirmPassword,
    onSubmit,
    handleConfirmPasswordChange,
    handleChange,
    validateFields,
    getFieldError,
    isFormValid,
  } = useRegistrationForm()

  return (
    <Box
      noValidate
      component="form"
      onSubmit={onSubmit}
      sx={{
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
        Добавить нового пользователя
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
            error={!!getFieldError('email')}
            helperText={getFieldError('email')}
            onBlur={() => validateFields('email')}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            required
            fullWidth
            size="medium"
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
            size="medium"
            type="password"
            id="password"
            name="password"
            label="Пароль"
            value={form.password}
            onChange={handleChange}
            error={!!getFieldError('password')}
            helperText={getFieldError('password')}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            required
            fullWidth
            size="medium"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Подтвердите пароль"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!getFieldError('confirmPassword')}
            helperText={getFieldError('confirmPassword')}
            onBlur={() => validateFields('confirmPassword')}
          />
        </Grid>

        <Grid size={12}>
          <SelectField
            required
            fullWidth
            size="medium"
            id="role"
            name="role"
            label="Роль"
            defaultValue="default"
            value={form.role}
            onChange={handleChange}
            error={!!getFieldError('role')}
            helperText={getFieldError('role')}
            onBlur={() => validateFields('role')}
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
            variant="contained"
            fullWidth
            color="primary"
            disabled={!!backendError && !!Object.keys(backendError.errors).length || !isFormValid() || sending}
            sx={{ py: 1.5, fontSize: '16px' }}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : 'Создать пользователя'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RegistrationForm
