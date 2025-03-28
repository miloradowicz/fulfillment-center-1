import useServiceForm from '../hooks/useServiceForm'
import { Autocomplete, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ServiceCategoryForm from './ServiceCategoryForm'
import Modal from '../../../components/UI/Modal/Modal'
import { isServiceCategory } from '../../../utils/helpers'

const ServiceForm = ({ onClose }: { onClose: () => void }) => {
  const {
    form,
    loading,
    serviceCategories,
    open,
    showCreateButton,
    handleOpen,
    handleClose,
    handleInputChange,
    handleAutocompleteChange,
    onSubmit,
    errors,
  } = useServiceForm(onClose)

  return (
    <>
      <Modal handleClose={handleClose} open={open}><ServiceCategoryForm onClose={handleClose} /></Modal>
      <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Добавить новую услугу
        </Typography>
        <Grid container direction="column" spacing={2}>
          <Grid>
            <Autocomplete
              freeSolo
              options={serviceCategories}
              getOptionKey={option => isServiceCategory(option) ? option._id : option}
              getOptionLabel={option => isServiceCategory(option) ? option.name : option}
              renderInput={params =>
                <TextField
                  {...params}
                  label='Категория услуги'
                  error={!!errors.serviceCategory}
                  helperText={errors.serviceCategory}
                />}
              onChange={handleAutocompleteChange}
              slots={{
                paper: ({ children }) => <Paper>
                  {children}
                  <Button onClick={handleOpen}>Создать новую</Button>
                </Paper>
              }}
            />
            {showCreateButton && < Button > Создать категорию</Button>}
          </Grid>
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
            <TextField
              name="price"
              label="Цена"
              type='number'
              value={form.price}
              onChange={handleInputChange}
              fullWidth
              size="small"
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>

          <Grid>
            <TextField
              name="description"
              label="Описание"
              value={form.description}
              onChange={handleInputChange}
              fullWidth
              size="small"
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Создать услугу'}
            </Button>
          </Grid>
        </Grid>
      </form >
    </>
  )
}

export default ServiceForm
