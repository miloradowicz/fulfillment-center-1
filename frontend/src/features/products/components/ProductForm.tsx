import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography, Box, Autocomplete } from '@mui/material'
import useProductForm from '../hooks/useProductForm.ts'
import { ProductWithPopulate } from '../../../types'
import React from 'react'
import { getFieldError } from '../../../utils/getFieldError.ts'

interface Props {
  initialData?: ProductWithPopulate
  onSuccess?: () => void
}

const ProductForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const {
    form,
    selectedClient,
    dynamicFields,
    newField,
    showNewFieldInputs,
    file,
    clients,
    loadingAdd,
    loadingUpdate,
    inputChangeHandler,
    handleFileChange,
    addDynamicField,
    onChangeDynamicFieldValue,
    onSubmit,
    setForm,
    setSelectedClient,
    setNewField,
    setShowNewFieldInputs,
    setErrors,
    errors,
    createError,
  } = useProductForm(initialData, onSuccess)

  return (
    <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        { initialData? 'Редактировать данные товара' : 'Добавить новый товар'}
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid>
          <Autocomplete
            options={clients || []}
            getOptionLabel={option => option.name}
            value={clients?.find(client => client._id === selectedClient) || null}
            onChange={(_event, newValue) => {
              const clientId = newValue ? newValue._id : ''
              setSelectedClient(clientId)
              setErrors(prevErrors => ({ ...prevErrors, client: '' }))
              setForm(prevState => ({ ...prevState, client: clientId }))
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Клиент"
                fullWidth
                size="small"
                error={Boolean(errors.client || getFieldError('client',createError))}
                helperText={errors.client || getFieldError('client',createError)}
              />
            )}
          />
        </Grid>

        <Grid>
          <TextField
            name="title"
            label="Название"
            value={form.title}
            onChange={inputChangeHandler}
            fullWidth
            size="small"
            error={Boolean(errors.title || getFieldError('title',createError))}
            helperText={errors.title || getFieldError('title',createError)}
          />
        </Grid>
        <Grid>
          <TextField
            name="amount"
            label="Количество"
            type="number"
            value={form.amount || ''}
            onChange={inputChangeHandler}
            fullWidth
            size="small"
            error={Boolean(errors.amount || getFieldError('amount',createError))}
            helperText={errors.amount || getFieldError('amount',createError)}
          />
        </Grid>
        <Grid>
          <TextField
            name="barcode"
            label="Баркод"
            value={form.barcode}
            onChange={inputChangeHandler}
            fullWidth
            size="small"
            error={Boolean(errors.barcode || getFieldError('barcode',createError))}
            helperText={errors.barcode || getFieldError('barcode',createError)}
          />
        </Grid>
        <Grid>
          <TextField
            name="article"
            label="Артикул"
            value={form.article}
            onChange={inputChangeHandler}
            fullWidth
            size="small"
            error={Boolean(errors.article || getFieldError('article',createError))}
            helperText={errors.article || getFieldError('article',createError)}
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
              />
            </Grid>
            <Grid>
              <TextField
                label="Название"
                value={newField.label}
                onChange={e => setNewField({ ...newField, label: e.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid>
              <Button variant="contained" onClick={addDynamicField}>
                Добавить
              </Button>
              <Button variant="outlined" color="error" onClick={() => setShowNewFieldInputs(false)} sx={{ ml: 1 }}>
                Отмена
              </Button>
            </Grid>
          </Grid>
        )}

        <Button type="button" onClick={() => setShowNewFieldInputs(true)}>
          + Добавить параметр
        </Button>

        <Typography variant="h6">Загрузить файл</Typography>
        <Grid>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>
              Выбрать файл
              <input type="file" accept=".pdf, .doc, .docx" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2">{file.name}</Typography>}
          </Box>
        </Grid>

        <Grid>
          <Button type="submit" fullWidth variant="contained" disabled={loadingAdd || loadingUpdate}>
            {loadingAdd || loadingUpdate ? <CircularProgress size={24} /> : initialData ? 'Обновить товар' : 'Создать товар'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ProductForm
