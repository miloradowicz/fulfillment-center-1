import {
  Autocomplete,
  TextField,
  Button,
  Typography, CircularProgress,
} from '@mui/material'
import { getItemNameById } from '../../../utils/getItemNameById.ts'
import { getFieldError } from '../../../utils/getFieldError.ts'
import Grid from '@mui/material/Grid2'
import { taskStatus, taskType } from '../state/taskState.ts'
import useTaskForm from '../hooks/useTaskForm.ts'

const TaskForm = () => {
  const { users, form, orders, arrivals, error, errors, addLoading, handleInputChange, handleSubmit, handleBlur, setForm } = useTaskForm()

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2} sx={{ maxWidth: '500px', margin: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
          Добавить новую задачу
        </Typography>

        <Grid>
          <Autocomplete
            id="user"
            value={getItemNameById(users, 'displayName', '_id').find(option => option.id === form.user) || null}
            onChange={(_, newValue) => setForm(prevState => ({ ...prevState, user: newValue?.id || '' }))}
            size="small"
            fullWidth
            disablePortal
            options={getItemNameById(users, 'displayName', '_id')}
            getOptionKey={option => option.id}
            renderInput={params => (
              <TextField
                {...params}
                label="Пользователь"
                error={Boolean(errors.user || getFieldError('user', error))}
                helperText={errors.user || getFieldError('user', error)}
                onBlur={e => handleBlur('user', e.target.value)}
              />
            )}
          />
        </Grid>

        <Grid>
          <TextField
            label="Название"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            fullWidth
            size="small"
            error={Boolean(errors.title || getFieldError('title', error))}
            helperText={errors.title || getFieldError('title', error)}
            onBlur={e => handleBlur('title', e.target.value)}
          />
        </Grid>

        <Grid>
          <TextField
            label="Описание задачи"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            multiline
            fullWidth
            size="small"
          />
        </Grid>

        <Grid>
          <Autocomplete
            id="type"
            value={ form.type && taskType.includes(form.type) ? form.type : null}
            onChange={(_, newValue) => setForm(prevState => ({ ...prevState, type: newValue || '' }))}
            size="small"
            fullWidth
            disablePortal
            options={taskType}
            sx={{ width: '100%' }}
            renderInput={params => (
              <TextField
                {...params}
                label="Тип задачи"
                error={Boolean(errors.type || getFieldError('type', error))}
                helperText={errors.type || getFieldError('type', error)}
              />
            )}
          />
        </Grid>

        <Grid>
          {form.type === 'заказ' && (
            <Autocomplete
              id="order"
              value={getItemNameById(orders, 'orderNumber', '_id').find(option => option.id === form.associated_order) || null}
              onChange={(_, newValue) => setForm(prevState => ({ ...prevState, associated_order: newValue?.id || '' }))}
              size="small"
              fullWidth
              disablePortal
              options={getItemNameById(orders, 'orderNumber', '_id')}
              getOptionKey={option => option.id}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Заказ"
                  error={Boolean(errors.associated_order || getFieldError('associated_order', error))}
                  helperText={errors.associated_order || getFieldError('associated_order', error)}
                />
              )}
            />
          )}
        </Grid>

        <Grid>
          {form.type === 'поставка' && (
            <Autocomplete
              id="arrival"
              value={getItemNameById(arrivals, 'arrivalNumber', '_id').find(option => option.id === form.associated_arrival) || null}
              onChange={(_, newValue) => setForm(prevState => ({ ...prevState, associated_arrival: newValue?.id || '' }))}
              size="small"
              fullWidth
              disablePortal
              options={getItemNameById(arrivals, 'arrivalNumber', '_id')}
              getOptionKey={option => option.id}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Поставка"
                  error={Boolean(errors.associated_arrival || getFieldError('associated_arrival', error))}
                  helperText={errors.associated_arrival || getFieldError('associated_arrival', error)}
                />
              )}
            />
          )}
        </Grid>

        <Grid>
          <Autocomplete
            id="status"
            value={ form.status && taskStatus.includes(form.status) ? form.status : null}
            onChange={(_, newValue) => setForm(prevState => ({ ...prevState, status: newValue || '' }))}
            size="small"
            fullWidth
            disablePortal
            options={taskStatus}
            sx={{ width: '100%' }}
            renderInput={params => (
              <TextField
                {...params}
                label="Статус задачи"
                error={Boolean(errors.status || getFieldError('status', error))}
                helperText={errors.status || getFieldError('status', error)}
              />
            )}
          />
        </Grid>
        <Button type="submit" variant="contained" color="primary" disabled={addLoading}>
          {addLoading ? <CircularProgress size={24} /> : ' Создать задачу'}
        </Button>
      </Grid>
    </form>
  )
}

export default TaskForm
