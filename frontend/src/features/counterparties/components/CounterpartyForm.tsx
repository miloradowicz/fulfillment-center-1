import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { Counterparty } from '../../../types'
import { useCounterpartyForm } from '../hooks/useCounterpartyForm.ts'

const CounterpartyForm = ({ counterparty, onClose }: { counterparty?: Counterparty | null; onClose?: () => void }) => {
  const {
    form,
    loading,
    inputChangeHandler,
    onSubmit,
    getFieldError,
  } = useCounterpartyForm(counterparty?._id, onClose)

  return (
    <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
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
            error={Boolean(getFieldError('name'))}
            helperText={getFieldError('name')}
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
            error={Boolean(getFieldError('phone_number'))}
            helperText={getFieldError('phone_number')}
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
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : counterparty ? 'Сохранить' : 'Создать'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default CounterpartyForm
