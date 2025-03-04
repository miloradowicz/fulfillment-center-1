import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, InputLabel, MenuItem, Select, TextField, Typography, Box } from '@mui/material'
import { DynamicField, ProductMutation } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { addProduct } from '../../../store/thunks/productThunk.ts'
import { selectLoadingAddProduct } from '../../../store/slices/productSlice.ts'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import { selectAllClients } from '../../../store/slices/clientSlice.ts'
import { isAxiosError } from 'axios'

const initialState: ProductMutation = {
  client: '',
  title: '',
  amount: 0,
  barcode: '',
  article: '',
  documents: [],
  dynamic_fields: [],
}

const ProductForm = () => {
  const [form, setForm] = useState<ProductMutation>(initialState)
  const [selectedClient, setSelectedClient] = useState('')
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
  const [newField, setNewField] = useState<DynamicField>({ key: '', label: '', value: '' })
  const [showNewFieldInputs, setShowNewFieldInputs] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddProduct)
  const clients = useAppSelector(selectAllClients)

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!form.client) {
      toast.warn('Поле "Клиент" обязательно для заполнения!')
      return
    }
    if (!form.title.trim() || !form.title) {
      toast.warn('Поле "Название" обязательно для заполнения!')
      return
    }
    if (!form.amount) {
      toast.warn('Поле "Количество" обязательно для заполнения!')
      return
    }
    if (!form.barcode.trim() || !form.barcode ) {
      toast.warn('Поле "Баркод" обязательно для заполнения!')
      return
    }
    if (!form.article.trim() || !form.article) {
      toast.warn('Поле "Артикул" обязательно для заполнения!')
      return
    }



    try {
      const productData: ProductMutation = {
        ...form,
        dynamic_fields: dynamicFields,
        documents: file ? [{ document: await convertFileToBase64(file) }] : [],
      }

      await dispatch(addProduct(productData)).unwrap()
      toast.success('Продукт успешно создан.')

      setForm(initialState)
      setDynamicFields([])
      setSelectedClient('')
      setFile(null)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        console.error('Ошибки валидации:', e.response.data)
      }
      console.error('Ошибка сервера:', e)
      toast.error('Не удалось создать продукт.')
    }
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'amount') {
      const amountValue = value === '' ? 0 : Number(value)
      if (amountValue < 0 || isNaN(amountValue)) return
      setForm(prevState => ({
        ...prevState,
        [name]: amountValue,
      }))
    } else {
      setForm(prevState => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    if (selectedFile) {
      const maxFileSize = 10 * 1024 * 1024
      if (selectedFile.size > maxFileSize) {
        toast.warn('Размер файла слишком большой. Максимальный размер: 10MB')
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.toString())
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const addDynamicField = () => {
    if (!newField.key.trim() || !newField.label.trim()) return

    setDynamicFields(prev => [...prev, newField])
    setNewField({ key: '', label: '', value: '' })
    setShowNewFieldInputs(false)
  }

  const onChangeDynamicFieldValue = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setDynamicFields(prev => prev.map((field, i) => (i === index ? { ...field, value } : field)))
  }

  return (
    <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
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
                {client.full_name}
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
