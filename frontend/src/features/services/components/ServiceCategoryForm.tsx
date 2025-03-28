import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import useServiceCategoryForm from '../hooks/useServiceCategoryForm'

const ServiceForm = ({ onClose }: { onClose: (id: string) => void }) => {
  const {
    form,
    loading,
    handleInputChange,
    onSubmit,
    errors,
  } = useServiceCategoryForm(onClose)

  return (
    <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Добавить новую категорию услуги
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid>
          <TextField
            name="name"
            label="Название"
            value={form.name}
            onChange={handleInputChange}
            fullWidth
            size="small"
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid>
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Создать категорию услуги'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ServiceForm
