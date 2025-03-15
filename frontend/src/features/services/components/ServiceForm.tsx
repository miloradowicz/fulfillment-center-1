import useServiceForm from '../hooks/useServiceForm'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

const ServiceForm = ({ onClose }: { onClose: () => void }) => {
  const {
    form,
    dynamicFields,
    newField,
    showNewFieldInputs,
    loading,
    inputChangeHandler,
    addDynamicField,
    onChangeDynamicFieldValue,
    onSubmit,
    setNewField,
    setShowNewFieldInputs,
    errors,
    handleCancel,
  } = useServiceForm(onClose)

  return (
    <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Добавить новую услугу
      </Typography>
      <Grid container direction="column" spacing={2}>
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
        <Typography variant="h6">Дополнительные параметры</Typography>
        {dynamicFields.map((field, i) => (
          <Grid key={i} sx={{ mb: 2 }}>
            <TextField
              name={field.label}
              label={field.label}
              fullWidth
              size="small"
              value={field.value || ''}
              onChange={e => onChangeDynamicFieldValue(i, e)}
              error={!!errors[`dynamicField_${ i }`]}
              helperText={errors[`dynamicField_${ i }`] || ''}
            />
          </Grid>
        ))}

        {showNewFieldInputs && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid>
              <TextField
                label="Ключ"
                value={newField.key}
                onChange={e => setNewField({ ...newField, key: e.target.value })}
                fullWidth
                size="small"
                error={!!errors.newFieldKey}
                helperText={errors.newFieldKey || ''}
              />
            </Grid>
            <Grid>
              <TextField
                label="Название"
                value={newField.label}
                onChange={e => setNewField({ ...newField, label: e.target.value })}
                fullWidth
                size="small"
                error={!!errors.newFieldLabel}
                helperText={errors.newFieldLabel || ''}
              />
            </Grid>
            <Grid>
              <Button variant="contained" onClick={addDynamicField}>
                Добавить
              </Button>
              <Button variant="outlined" color="error" onClick={handleCancel} sx={{ ml: 1 }}>
                Отмена
              </Button>
            </Grid>
          </Grid>
        )}

        <Button type="button" onClick={() => setShowNewFieldInputs(true)}>
          + Добавить дополнительное свойство
        </Button>

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
