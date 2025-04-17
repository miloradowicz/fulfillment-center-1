import useServiceForm from '../hooks/useServiceForm'
import {
  Autocomplete as _Autocomplete,
  Box,
  Button,
  createFilterOptions,
  IconButton,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { isServiceCategory } from '@/utils/helpers'
import { ServiceCategory } from '@/types'
import ClearIcon from '@mui/icons-material/Clear'

const ServiceForm = ({ serviceId, onClose }: { serviceId?: string; onClose: () => void }) => {
  const {
    form,
    loading,
    serviceCategories,
    addCategoryLoading,
    fetchCategoryLoading,
    handleInputChange,
    handleAutocompleteChange,
    handleDeleteCategory,
    onSubmit,
    errors,
  } = useServiceForm(serviceId, onClose)

  const Autocomplete = _Autocomplete<ServiceCategory | string, false, false, true>

  const filterOptions = createFilterOptions<ServiceCategory | string>({
    stringify: option => (isServiceCategory(option) ? option.name : option),
  })

  return (
    <form onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {serviceId ? 'Редактировать услугу' : 'Добавить новую услугу'}
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid>
          <Autocomplete
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={serviceCategories}
            getOptionLabel={option =>
              isServiceCategory(option) ? option.name : option
            }
            renderOption={(props, option) => {
              const { key, ...rest } = props
              return (
                <li
                  key={key}
                  {...rest}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
                  <span>
                    {isServiceCategory(option) ? option.name : `Добавить "${ option }"`}
                  </span>
                  {isServiceCategory(option) && (
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteCategory(option._id)
                      }}
                      aria-label="delete"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </li>
              )
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Категория услуги"
                error={!!errors.serviceCategory}
                helperText={errors.serviceCategory}
              />
            )}
            onChange={handleAutocompleteChange}
            value={form.serviceCategory ? form.serviceCategory.name : ''}
            isOptionEqualToValue={(option, value) =>
              isServiceCategory(option)
                ? option._id === (isServiceCategory(value) ? value._id : '')
                : option === value
            }
            filterOptions={(options, params) => {
              const filtered = filterOptions(options, params)

              const { inputValue } = params
              const isExisting = options.some(
                option =>
                  (isServiceCategory(option) && option.name === inputValue) ||
                  option === inputValue,
              )
              if (inputValue !== '' && !isExisting) {
                filtered.push(inputValue)
              }

              return filtered
            }}
          />
          <Box height={6}>
            {(addCategoryLoading || fetchCategoryLoading) && <LinearProgress />}
          </Box>
        </Grid>
        <Grid>
          <TextField
            select
            fullWidth
            label="Тип услуги"
            name="type"
            value={form.type}
            onChange={handleInputChange}
            size="small"
            error={!!errors.type}
            helperText={errors.type}
          >
            <MenuItem value="внутренняя">Внутренняя услуга</MenuItem>
            <MenuItem value="внешняя">Внешняя услуга</MenuItem>
          </TextField>
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
            variant="contained"
            color="primary"
            disabled={loading || addCategoryLoading || fetchCategoryLoading}
          >
            {serviceId ? 'Сохранить изменения' : 'Создать услугу'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ServiceForm
