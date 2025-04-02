import { Autocomplete, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { getItemNameById } from '../../../utils/getItemNameById.ts'
import { getFieldError } from '../../../utils/getFieldError.ts'
import Grid from '@mui/material/Grid2'
import { taskType } from '../state/taskState.ts'
import useTaskForm from '../hooks/useTaskForm.ts'
import React from 'react'
import { TaskWithPopulate } from '../../../types'

interface Props {
  onSuccess?: () => void
  initialData?: TaskWithPopulate
}

const TaskForm:React.FC<Props> = ({ onSuccess, initialData }) => {
  const {
    users,
    form,
    orders,
    arrivals,
    error,
    errors,
    addLoading,
    updateLoading,
    handleInputChange,
    handleSubmit,
    handleBlur,
    setForm,
  } = useTaskForm(onSuccess, initialData)

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
          { initialData? 'Редактировать данные задачи' : 'Добавить новую задачу'}
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

        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} sx={{ mb: 2 }}>
          {initialData?
            updateLoading ? <CircularProgress size={24} /> : ' Обновить задачу'
            : addLoading ? <CircularProgress size={24} /> : ' Создать задачу'
          }
        </Button>
      </Grid>
    </form>
  )
}

export default TaskForm
