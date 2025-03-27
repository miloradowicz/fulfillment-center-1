import useServiceForm from '../hooks/useServiceForm'
import { Autocomplete, Button, CircularProgress, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

const ServiceForm = ({ onClose }: { onClose: () => void }) => {
  const {
    form,
    loading,
    services,
    inputChangeHandler,
    onSubmit,
    errors,
  } = useServiceForm(onClose)

  return (
    <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Добавить новую услугу
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid>
          <Autocomplete
            options={services}
            groupBy={option => option.serviceCategory.name}
            getOptionKey={option => option._id}
            getOptionLabel={option => option.name}
            renderInput={params => <TextField {...params} label='Услуги' />}
          />
        </Grid>
        <Grid>
          <TextField
            name="name"
            label="Название"
            value={form.name}
            onChange={inputChangeHandler}
            fullWidth
            size="small"
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid>
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Создать услугу'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ServiceForm
