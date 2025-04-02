import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { Counterparty } from '../../../types'
import { useCounterpartyForm } from '../hooks/useCounterpartyForm.ts'
import { getFieldError } from '../../../utils/getFieldError.ts'

const CounterpartyForm = ({ counterparty, onClose }: { counterparty?: Counterparty | null; onClose?: () => void }) => {
  const {
    form,
    loading,
    inputChangeHandler,
    onSubmit,
    errors,
    createError,
    updateError,
  } = useCounterpartyForm(counterparty?._id, onClose)

  return (
    <form onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {counterparty ? 'Редактировать контрагента' : 'Добавить нового контрагента'}
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid>
          <TextField
            id="name"
            name="name"
            label="Название контрагента *"
            value={form.name}
            onChange={inputChangeHandler}
            error={Boolean(errors.name || getFieldError('name', createError || updateError))}
            helperText={errors.name || getFieldError('name', createError || updateError)}
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-error fieldset': {
                  borderColor: 'red',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Grid>

        <Grid>
          <TextField
            id="phone_number"
            name="phone_number"
            label="Номер телефона"
            value={form.phone_number}
            onChange={inputChangeHandler}
            error={Boolean(errors.phone_number || getFieldError('phone_number', createError || updateError))}
            helperText={errors.phone_number || getFieldError('phone_number', createError || updateError)}
            fullWidth
            size="small"
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
            size="small"
          />
        </Grid>

        <Grid>
          <Button type="submit" disabled={loading} variant="contained" sx={{ mt: 2, mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : counterparty ? 'Сохранить' : 'Создать'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default CounterpartyForm
