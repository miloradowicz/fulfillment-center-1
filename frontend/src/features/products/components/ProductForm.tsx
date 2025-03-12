import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, InputLabel, MenuItem, Select, TextField, Typography, Box } from '@mui/material'
import useProductForm from '../../../hooks/useProductForm.ts'

const ProductForm = () => {

  const {
    form,
    selectedClient,
    dynamicFields,
    newField,
    showNewFieldInputs,
    file,
    clients,
    loading,
    inputChangeHandler,
    handleFileChange,
    addDynamicField,
    onChangeDynamicFieldValue,
    onSubmit,
    setForm,
    setSelectedClient,
    setNewField,
    setShowNewFieldInputs,
  } = useProductForm()

  return (
    <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Добавить новый продукт
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid>
          <InputLabel id="client-select-label">Клиент</InputLabel>
          <Select
            labelId="client-select-label"
            id="client-select"
            value={selectedClient}
            onChange={e => {
              const clientId = e.target.value
              setSelectedClient(clientId)
              setForm(prevState => ({ ...prevState, client: clientId }))
            }}
            fullWidth
            size="small"
          >
            {clients?.map(client => (
              <MenuItem key={client._id} value={client._id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid>
          <TextField
            name="title"
            label="Название"
            value={form.title}
            onChange={inputChangeHandler}
            fullWidth
            size="small"
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
              <input type="file" accept=".pdf,.docx" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2">{file.name}</Typography>}
          </Box>
        </Grid>

        <Grid>
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Создать продукт'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ProductForm
