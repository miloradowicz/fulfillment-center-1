import useServiceForm from '../hooks/useServiceForm'
import { Autocomplete as _Autocomplete, Box, Button, createFilterOptions, LinearProgress, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { isServiceCategory } from '../../../utils/helpers'
import { ServiceCategory } from '../../../types'

const ServiceForm = ({ serviceId, onClose }: { serviceId: string, onClose: () => void }) => {
  const {
    form,
    loading,
    serviceCategories,
    addCategoryLoading,
    fetchCategoryLoading,
    handleInputChange,
    handleAutocompleteChange,
    onSubmit,
    errors,
  } = useServiceForm(serviceId, onClose)

  const Autocomplete = _Autocomplete<ServiceCategory | string>

  const defaultFilterOptions = createFilterOptions<ServiceCategory | string>()

  return (
    <form onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Добавить новую услугу
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid>
          <Autocomplete
            options={serviceCategories}
            getOptionKey={option => (isServiceCategory(option) ? option._id : option)}
            getOptionLabel={option => (isServiceCategory(option) ? option.name : `Добавить категорию "${ option }"`)}
            renderInput={params => (
              <TextField
                {...params}
                label="Категория услуги"
                error={!!errors.serviceCategory}
                helperText={errors.serviceCategory}
              />
            )}
            onChange={handleAutocompleteChange}
            value={form.serviceCategory}
            isOptionEqualToValue={(option, value) =>
              isServiceCategory(option) && isServiceCategory(value) ? option._id === value._id : option === value
            }
            filterOptions={(options, state) => {
              const results = defaultFilterOptions(options, state)

              if (
                state.inputValue.trim() !== '' &&
                !results.some(x => (isServiceCategory(x) && x.name === state.inputValue) || x === state.inputValue)
              )
                results.push(state.inputValue)

              return results
            }}
          />
          <Box height={6}>
            {(addCategoryLoading || fetchCategoryLoading) && <LinearProgress />}
          </Box>
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
            type="number"
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
          <Button
            type="submit"
            color="primary"
            loading={loading}
            disabled={addCategoryLoading || fetchCategoryLoading}
          >Создать услугу</Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ServiceForm
