import React from 'react'
import { Stock } from '../../../types'
import { useStockForm } from '../hooks/useStockForm.ts'
import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { getFieldError } from '../../../utils/getFieldError.ts'
import { inputChangeHandler } from '../../../utils/inputChangeHandler.ts'

interface Props {
  initialData?: Stock | undefined
  onSuccess?: () => void
}

const StockForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const { isLoading, form, setForm, errors, handleBlur, error, submitFormHandler } = useStockForm(
    initialData,
    onSuccess,
  )

  return (
    <form onSubmit={submitFormHandler}>
      <Grid container direction="column" spacing={2} sx={{ maxWidth: '500px', margin: 'auto' }}>
        {isLoading ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : null}

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
          {initialData ? 'Редактировать данные склада' : 'Добавить новый склад'}
        </Typography>

        <Grid>
          <TextField
            id="name"
            name="name"
            label={'Название склада, например: "Склад Бишкек"'}
            value={form.name}
            onChange={e => inputChangeHandler(e, setForm)}
            size="small"
            error={Boolean(errors.name || getFieldError('name', error))}
            helperText={errors.name || getFieldError('name', error)}
            onBlur={e => handleBlur('name', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <TextField
            id="address"
            name="address"
            label="Адрес склада"
            value={form.address}
            onChange={e => inputChangeHandler(e, setForm)}
            size="small"
            error={Boolean(errors.address || getFieldError('address', error))}
            helperText={errors.address || getFieldError('address', error)}
            onBlur={e => handleBlur('address', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : initialData ? (
              'Обновить склад'
            ) : (
              'Создать склад'
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default StockForm
