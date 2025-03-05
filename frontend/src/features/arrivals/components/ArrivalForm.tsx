import React, { useEffect, useState } from 'react'
import { ArrivalMutation, Defect, ProductArrival } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { addArrival } from '../../../store/thunks/arrivalThunk.ts'
import Grid from '@mui/material/Grid2'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, CircularProgress, Divider, InputLabel, TextField, Typography } from '@mui/material'
import { selectCreateError, selectLoadingAddArrival } from '../../../store/slices/arrivalSlice.ts'
import { selectAllClients } from '../../../store/slices/clientSlice.ts'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import Autocomplete from '@mui/material/Autocomplete'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { fetchProductsByClientId } from '../../../store/thunks/productThunk.ts'

const initialState = {
  client: '',
  arrival_price: 0,
  arrival_date: '',
  sent_amount: '',
  products: [],
  defects: [],
  received_amount: [],
}

const initialProductState = {
  product: '',
  description: '',
  amount: 0,
}

const initialDefectState = {
  product: '',
  defect_description: '',
  amount: 0,
}

const ArrivalForm = () => {
  const [form, setForm] = useState<ArrivalMutation>({ ...initialState })

  const [newReceived, setNewReceived] = useState<ProductArrival>({ ...initialProductState })
  const [receivedForm, setReceivedForm] = useState<ProductArrival[]>([])
  const [receivedModalOpen, setReceivedModalOpen] = useState<boolean>(false)

  const [newProduct, setNewProduct] = useState<ProductArrival>({ ...initialProductState })
  const [productsForm, setProductsForm] = useState<ProductArrival[]>([])
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const [newDefect, setNewDefect] = useState<Defect>({ ...initialDefectState })
  const [defectForm, setDefectForm] = useState<Defect[]>([])
  const [defectModalOpen, setDefectModalOpen] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const clients = useAppSelector(selectAllClients)
  const products = useAppSelector(selectAllProducts)
  const error = useAppSelector(selectCreateError)
  const isLoading = useAppSelector(selectLoadingAddArrival)

  useEffect(() => {
    dispatch(fetchClients())
    if (form.client) {
      dispatch(fetchProductsByClientId(form.client))
    }
  }, [dispatch, form.client])

  const addProduct = (product: ProductArrival, isReceivedProduct: boolean) => {
    if (isReceivedProduct) {
      if (!product || product.amount <= 0 || product.description.trim().length === 0) {
        toast.warn('Заполните все поля товара.')
      } else {
        setReceivedForm((prev) => {
          const updatedReceivedProducts = [...prev, product]
          setForm((prevForm) => ({
            ...prevForm,
            received_amount: updatedReceivedProducts,
          }))
          return updatedReceivedProducts
        })
      }
    } else {
      if (!product || product.amount <= 0 || product.description.trim().length === 0) {
        toast.warn('Заполните все поля товара.')
      } else {
        setProductsForm((prev) => {
          const updatedProducts = [...prev, product]
          setForm((prevForm) => ({
            ...prevForm,
            products: updatedProducts,
          }))
          return updatedProducts
        })
      }
    }

    setNewProduct({ ...initialProductState })
    setNewReceived({ ...initialProductState })
  }

  const deleteProduct = (index: number, setState: React.Dispatch<React.SetStateAction<ProductArrival[]>>) => {
    setState((prev) => prev.filter((_, i) => i !== index))
  }

  const addDefect = (defect: Defect) => {
    if (!defect.product || defect.amount <= 0 || defect.defect_description.trim().length === 0) {
      toast.warn('Заполните все поля дефекта')
    } else {
      setDefectForm((prev) => {
        const updatedDefects = [...prev, defect]
        setForm((prevForm) => ({
          ...prevForm,
          defects: updatedDefects,
        }))
        return updatedDefects
      })
      setNewDefect(initialDefectState)
    }
  }

  const deleteDefect = (index: number, setState: React.Dispatch<React.SetStateAction<Defect[]>>) => {
    setState((prev) => prev.filter((_, i) => i !== index))
  }

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].messages[0]
    } catch {
      return undefined
    }
  }

  const getProductNameById = (productId: string): string => {
    const product = products?.find((p) => p._id === productId)
    return product ? product.title : 'Неизвестный товар'
  }

  const renderProductsList = (products: ProductArrival[], onDelete: (index: number) => void) => (
    <>
      {products.map((product, i) => (
        <Grid container key={i} spacing={2} alignItems="center" sx={{ marginBottom: '15px', marginTop: '15px' }}>
          <Grid container direction="column" spacing={2}>
            <Grid>
              <Typography fontWeight="bold">{getProductNameById(product.product)}</Typography>
            </Grid>

            <Grid>
              <Typography variant="body2">Количество: {product.amount}</Typography>
            </Grid>

            <Grid>
              <Typography variant="body2">
                {product.description ? `Описание: ${product.description}` : 'Нет описания'}
              </Typography>
            </Grid>

            <Grid>
              <Button variant="outlined" color="error" onClick={() => onDelete(i)} startIcon={<DeleteIcon />}>
                Удалить
              </Button>
            </Grid>
          </Grid>
          {products.length > 1 ? <Divider sx={{ width: '100%', marginTop: '15px' }} /> : null}
        </Grid>
      ))}
    </>
  )

  const renderDefectsList = (defectForm: Defect[], onDelete: (index: number) => void) => (
    <>
      {defectForm.map((defect, i) => (
        <Grid container key={i} spacing={2} alignItems="center" sx={{ marginBottom: '15px', marginTop: '15px' }}>
          <Grid container direction="column" spacing={2}>
            <Grid>
              <Typography fontWeight="bold">{getProductNameById(defect.product)}</Typography>
            </Grid>

            <Grid>
              <Typography variant="body2" color="textPrimary">
                Количество: {defect.amount}
              </Typography>
            </Grid>

            <Grid>
              <Typography variant="body2" color="textSecondary">
                {defect.defect_description ? `Описание: ${defect.defect_description}` : 'Нет описания'}
              </Typography>
            </Grid>

            <Grid>
              <Button variant="outlined" color="error" onClick={() => onDelete(i)} startIcon={<DeleteIcon />}>
                Удалить
              </Button>
            </Grid>
          </Grid>
          {defectForm.length > 1 ? <Divider sx={{ width: '100%', marginTop: '15px' }} /> : null}
        </Grid>
      ))}
    </>
  )

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedForm = { ...form, products: productsForm, received_amount: receivedForm, defects: defectForm }
      await dispatch(addArrival(updatedForm)).unwrap()
      setForm({ ...initialState })
      setProductsForm([])
      setReceivedForm([])
      setDefectForm([])
      navigate('/')
      toast.success('Поставка успешно создана!')
    } catch (e) {
      console.error(e)
    }
  }

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prevState) => ({ ...prevState, [name]: value }))
  }

  const autoCompleteClients =
    clients?.map((client) => ({
      label: client.full_name,
      id: client._id,
    })) || []

  return (
    <form onSubmit={submitFormHandler} style={{ marginTop: '3rem' }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container direction="column" spacing={2} sx={{ maxWidth: '500px', margin: 'auto' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
            Добавить новую поставку
          </Typography>

          <Grid>
            <Autocomplete
              id="client"
              value={autoCompleteClients.find((option) => option.id === form.client) || null}
              onChange={(_, newValue) => setForm((prevState) => ({ ...prevState, client: newValue?.id || '' }))}
              size="small"
              fullWidth
              disablePortal
              options={autoCompleteClients}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Клиент"
                  error={Boolean(getFieldError('client'))}
                  helperText={getFieldError('client')}
                />
              )}
            />
          </Grid>

          <Grid>
            <Typography fontWeight="bold">Товары</Typography>
            {renderProductsList(productsForm, (i) => deleteProduct(i, setProductsForm))}
            <Button type="button" onClick={() => setModalOpen(true)}>
              + Добавить товары
            </Button>
          </Grid>

          {modalOpen && (
            <Grid>
              <Typography sx={{ marginBottom: '15px' }}>Укажите товары</Typography>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                options={products ?? []}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setNewProduct((prev) => ({ ...prev, product: newValue._id }))
                  }
                }}
                getOptionLabel={(option) => `${option.title}. Артикул: ${option.article}`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => <TextField {...params} label="Товар" />}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                type="number"
                fullWidth
                size="small"
                label="Количество товара"
                value={newProduct.amount}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, amount: +e.target.value }))}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                label="Описание товара"
                fullWidth
                size="small"
                value={newProduct.description}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                sx={{ marginBottom: '15px' }}
              />

              <Grid container spacing={2}>
                <Button type="button" variant="outlined" onClick={() => addProduct(newProduct, false)}>
                  Добавить
                </Button>

                <Button type="button" variant="outlined" onClick={() => setModalOpen(false)}>
                  Закрыть
                </Button>
              </Grid>
            </Grid>
          )}

          <Grid>
            <Divider sx={{ width: '100%', marginBottom: '15px' }} />
            <Typography fontWeight="bold">Полученные товары</Typography>
            {renderProductsList(receivedForm, (i) => deleteProduct(i, setReceivedForm))}
            <Button type="button" onClick={() => setReceivedModalOpen(true)}>
              + Добавить полученные товары
            </Button>
          </Grid>

          {receivedModalOpen && (
            <Grid>
              <Typography sx={{ marginBottom: '15px' }}>Укажите полученные товары</Typography>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                options={products ?? []}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setNewReceived((prev) => ({ ...prev, product: newValue._id }))
                  }
                }}
                getOptionLabel={(option) => `${option.title} артикул: ${option.article}`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => <TextField {...params} label="Товар" />}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                type="number"
                fullWidth
                size="small"
                label="Количество товара"
                value={newReceived.amount}
                onChange={(e) => setNewReceived((prev) => ({ ...prev, amount: +e.target.value }))}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                label="Описание товара"
                fullWidth
                size="small"
                value={newReceived.description}
                onChange={(e) => setNewReceived((prev) => ({ ...prev, description: e.target.value }))}
                sx={{ marginBottom: '15px' }}
              />

              <Button type="button" onClick={() => addProduct(newReceived, true)}>
                Добавить
              </Button>

              <Button type="button" onClick={() => setReceivedModalOpen(false)}>
                Закрыть
              </Button>
            </Grid>
          )}

          <Grid>
            <Divider sx={{ width: '100%', marginBottom: '15px' }} />
            <Typography fontWeight="bold">Дефекты</Typography>
            {renderDefectsList(defectForm, (i) => deleteDefect(i, setDefectForm))}
            <Button type="button" onClick={() => setDefectModalOpen(true)}>
              + Добавить дефекты
            </Button>
          </Grid>

          {defectModalOpen && (
            <Grid>
              <Typography sx={{ marginBottom: '15px' }}>Укажите дефекты</Typography>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                options={products ?? []}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setNewDefect((prev) => ({ ...prev, product: newValue._id }))
                  }
                }}
                getOptionLabel={(option) => `${option.title} артикул: ${option.article}`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => <TextField {...params} label="Товар" />}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                type="number"
                fullWidth
                size="small"
                label="Количество дефектного товара"
                value={newDefect.amount}
                onChange={(e) => setNewDefect((prev) => ({ ...prev, amount: +e.target.value }))}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                label="Описание дефекта"
                fullWidth
                size="small"
                value={newDefect.defect_description}
                onChange={(e) => setNewDefect((prev) => ({ ...prev, defect_description: e.target.value }))}
                sx={{ marginBottom: '15px' }}
              />

              <Button type="button" onClick={() => addDefect(newDefect)}>
                Добавить
              </Button>

              <Button type="button" onClick={() => setDefectModalOpen(false)}>
                Закрыть
              </Button>
            </Grid>
          )}

          <Grid>
            <TextField
              type="number"
              id="arrival_price"
              name="arrival_price"
              label="Цена доставки"
              value={Number(form.arrival_price)}
              onChange={inputChangeHandler}
              size="small"
              error={Boolean(getFieldError('arrival_price'))}
              fullWidth
            />
          </Grid>

          <Grid>
            <InputLabel htmlFor="arrival_date" style={{ fontSize: '15px', marginLeft: '12px' }}>
              Дата прибытия
            </InputLabel>
            <TextField
              id="arrival_date"
              name="arrival_date"
              size={'small'}
              type="date"
              value={form.arrival_date}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('arrival_date'))}
              helperText={getFieldError('arrival_date')}
              fullWidth
            />
          </Grid>

          <Grid></Grid>

          <Grid>
            <TextField
              id="sent_amount"
              name="sent_amount"
              label="Количество отправленного товара (шт/мешков/коробов)"
              value={form.sent_amount}
              onChange={inputChangeHandler}
              size="small"
              error={Boolean(getFieldError('sent_amount'))}
              fullWidth
            />
          </Grid>

          <Grid>
            <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Создать поставку
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  )
}

export default ArrivalForm
