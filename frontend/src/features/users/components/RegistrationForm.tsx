import Grid from '@mui/material/Grid2'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import SelectField from '../../../components/SelectField/SelectField.tsx'
import {  roles } from '../../../constants.ts'
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
  } = useRegistrationForm()

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
              onBlur={() => validateFields('email')}
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
              onBlur={() => validateFields('confirmPassword')}
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
              onBlur={() => validateFields('confirmPassword')}
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
