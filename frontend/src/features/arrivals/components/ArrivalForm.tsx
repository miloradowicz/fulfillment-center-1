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
  const [errors, setErrors] = useState<{
    client: string
    product: string
    arrival_price: number
    arrival_date: string
    sent_amount: string
    amount: number
    defect_description: string
    description: string
  }>({
    client: '',
    product: '',
    arrival_price: 0,
    arrival_date: '',
    amount: 0,
    sent_amount: '',
    defect_description: '',
    description: '',
  })

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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (value.trim() === '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: 'Это поле обязательно для заполнения',
      }))
    } else if ((name === 'arrival_price' && Number(value) === 0) || Number(value) < 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: 'Цена доставки должна быть больше 0',
      }))
    } else if ((name === 'amount' && Number(value) === 0) || Number(value) < 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: 'Количество товара должно быть больше 0',
      }))
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
      }))
    }
  }

  const addProduct = (product: ProductArrival, isReceivedProduct: boolean) => {
    if (!product.product || product.amount === 0) {
      toast.warn('Заполните название и количество товара.')
      return
    }

    if (isReceivedProduct) {
      setReceivedForm(prev => {
        const updatedReceivedProducts = [...prev, product]
        setForm(prevForm => ({
          ...prevForm,
          received_amount: updatedReceivedProducts,
        }))
        return updatedReceivedProducts
      })
    } else {
      setProductsForm(prev => {
        const updatedProducts = [...prev, product]
        setForm(prevForm => ({
          ...prevForm,
          products: updatedProducts,
        }))
        return updatedProducts
      })
    }

    setModalOpen(false)
    setReceivedModalOpen(false)
    setNewProduct({ ...initialProductState })
    setNewReceived({ ...initialProductState })
  }

  const deleteProduct = (index: number, setState: React.Dispatch<React.SetStateAction<ProductArrival[]>>) => {
    setState(prev => prev.filter((_, i) => i !== index))
  }

  const addDefect = (defect: Defect) => {
    if (!defect.product || !defect.defect_description || defect.amount === 0) {
      toast.warn('Заполните название, количество и описание дефекта.')
      return
    }

    setDefectForm(prev => {
      const updatedDefects = [...prev, defect]
      setForm(prevForm => ({
        ...prevForm,
        defects: updatedDefects,
      }))
      return updatedDefects
    })

    setDefectModalOpen(false)
    setNewDefect({ ...initialDefectState })
  }

  const deleteDefect = (index: number, setState: React.Dispatch<React.SetStateAction<Defect[]>>) => {
    setState(prev => prev.filter((_, i) => i !== index))
  }

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].messages[0]
    } catch {
      return undefined
    }
  }

  const getProductNameById = (productId: string): string => {
    const product = products?.find(p => p._id === productId)
    return product ? product.title : 'Неизвестный товар'
  }

  const renderProductsList = (products: ProductArrival[], onDelete: (index: number) => void) => (
    <>
      {products.map((product, i) => (
        <Grid container key={i} spacing={2} alignItems="center" sx={{ marginBottom: '15px', marginTop: '15px' }}>
          <Grid container direction="column" spacing={2}>
            <Grid style={{ textTransform: 'capitalize' }}>
              <Typography fontWeight="bold">{getProductNameById(product.product)}</Typography>
            </Grid>

            <Grid>
              <Typography variant="body2">Количество: {product.amount}</Typography>
            </Grid>

            <Grid>
              <Typography variant="body2">
                {product.description ? `Описание: ${ product.description }` : null}
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
            <Grid style={{ textTransform: 'capitalize' }}>
              <Typography fontWeight="bold">{getProductNameById(defect.product)}</Typography>
            </Grid>

            <Grid>
              <Typography variant="body2" color="textPrimary">
                Количество: {defect.amount}
              </Typography>
            </Grid>

            <Grid>
              <Typography variant="body2" color="textSecondary">
                {`Описание: ${ defect.defect_description }`}
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

    if (form.products.length === 0) {
      toast.error('Добавьте товары')
    } else {
      try {
        const updatedForm = { ...form, products: productsForm, received_amount: receivedForm, defects: defectForm, arrival_price: Number(form.arrival_price) }
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
  }

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prevState => ({ ...prevState, [name]: value }))
  }

  const autoCompleteClients =
    clients?.map(client => ({
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
              value={autoCompleteClients.find(option => option.id === form.client) || null}
              onChange={(_, newValue) => setForm(prevState => ({ ...prevState, client: newValue?.id || '' }))}
              size="small"
              fullWidth
              disablePortal
              options={autoCompleteClients}
              sx={{ width: '100%' }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Клиент"
                  error={Boolean(errors.client)}
                  helperText={errors.client || getFieldError('client')}
                  onBlur={() => {
                    if (!form.client) {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        client: 'Выберите клиента',
                      }))
                    } else {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        client: '',
                      }))
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid>
            <Typography fontWeight="bold">Товары</Typography>
            {renderProductsList(productsForm, i => deleteProduct(i, setProductsForm))}
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
                    setNewProduct(prev => ({ ...prev, product: newValue._id }))
                  }
                }}
                getOptionLabel={option => `${ option.title }. Артикул: ${ option.article }`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={params =>
                  <TextField
                    {...params}
                    label="Товар"
                    error={Boolean(errors.product)}
                    helperText={errors.product || getFieldError('product')}
                    onBlur={() => {
                      if (!newProduct.product) {
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          product: 'Выберите товар',
                        }))
                      } else {
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          product: '',
                        }))
                      }
                    }}
                  />}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                type="number"
                fullWidth
                size="small"
                name="amount"
                label="Количество товара"
                value={newProduct.amount}
                onChange={e => setNewProduct(prev => ({ ...prev, amount: +e.target.value }))}
                error={Boolean(errors.amount)}
                helperText={errors.amount || getFieldError('amount')}
                onBlur={handleBlur}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                label="Описание товара"
                fullWidth
                size="small"
                name="description"
                value={newProduct.description}
                onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
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
            {renderProductsList(receivedForm, i => deleteProduct(i, setReceivedForm))}
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
                    setNewReceived(prev => ({ ...prev, product: newValue._id }))
                  }
                }}
                getOptionLabel={option => `${ option.title } артикул: ${ option.article }`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={params =>
                  <TextField
                    {...params}
                    label="Товар"
                    error={Boolean(errors.product)}
                    helperText={errors.product || getFieldError('product')}
                    onBlur={() => {
                      if (!newReceived.product) {
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          product: 'Выберите товар',
                        }))
                      } else {
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          product: '',
                        }))
                      }
                    }}
                  />}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                type="number"
                fullWidth
                size="small"
                name="amount"
                label="Количество товара"
                value={newReceived.amount}
                onChange={e => setNewReceived(prev => ({ ...prev, amount: +e.target.value }))}
                error={Boolean(errors.amount)}
                helperText={errors.amount || getFieldError('amount')}
                onBlur={handleBlur}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                label="Описание товара"
                fullWidth
                size="small"
                name="description"
                value={newReceived.description}
                onChange={e => setNewReceived(prev => ({ ...prev, description: e.target.value }))}
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
            {renderDefectsList(defectForm, i => deleteDefect(i, setDefectForm))}
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
                    setNewDefect(prev => ({ ...prev, product: newValue._id }))
                  }
                }}
                getOptionLabel={option => `${ option.title } артикул: ${ option.article }`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={params =>
                  <TextField
                    {...params}
                    label="Товар"
                    error={Boolean(errors.product)}
                    helperText={errors.product || getFieldError('product')}
                    onBlur={() => {
                      if (!newDefect.product) {
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          product: 'Выберите товар',
                        }))
                      } else {
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          product: '',
                        }))
                      }
                    }}
                  />}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                type="number"
                fullWidth
                size="small"
                label="Количество дефектного товара"
                name="amount"
                value={newDefect.amount}
                onChange={e => setNewDefect(prev => ({ ...prev, amount: +e.target.value }))}
                error={Boolean(errors.amount)}
                helperText={errors.amount || getFieldError('amount')}
                onBlur={handleBlur}
                sx={{ marginBottom: '15px' }}
              />

              <TextField
                label="Описание дефекта"
                fullWidth
                size="small"
                name="defect_description"
                value={newDefect.defect_description}
                onChange={e => setNewDefect(prev => ({ ...prev, defect_description: e.target.value }))}
                error={Boolean(errors.defect_description)}
                helperText={errors.defect_description || getFieldError('defect_description')}
                onBlur={handleBlur}
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
              value={form.arrival_price}
              onChange={inputChangeHandler}
              size="small"
              error={Boolean(errors.arrival_price)}
              helperText={errors.arrival_price || getFieldError('arrival_price')}
              onBlur={handleBlur}
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
              error={Boolean(errors.arrival_date)}
              helperText={errors.arrival_date || getFieldError('arrival_date')}
              onBlur={handleBlur}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              id="sent_amount"
              name="sent_amount"
              label="Количество отправленного товара (шт/мешков/коробов)"
              value={form.sent_amount}
              onChange={inputChangeHandler}
              size="small"
              error={Boolean(errors.sent_amount)}
              helperText={errors.sent_amount || getFieldError('sent_amount')}
              onBlur={handleBlur}
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
