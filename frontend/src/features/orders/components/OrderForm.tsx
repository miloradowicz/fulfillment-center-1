import Grid from '@mui/material/Grid2'
import { Autocomplete, Button, CircularProgress, FormControl, InputLabel, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { selectCreateOrderError, selectLoadingAddOrder } from '../../../store/slices/orderSlice.ts'
import { selectAllClients, selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import { addOrder } from '../../../store/thunks/orderThunk.ts'
import { Defect, OrderMutation, Product, ProductOrder } from '../../../types'
import { fetchProductsByClientId } from '../../../store/thunks/productThunk.ts'
import DeleteIcon from '@mui/icons-material/Delete'

const initialState: OrderMutation = {
  client: '',
  products: [],
  price: 0,
  sent_at: '',
  delivered_at: '',
  comment: '',
  defects: [],
}

const initialStateProduct = {
  product: '',
  description: '',
  amount: 0,
}

const initialStateDefect = {
  product: '',
  defect_description: '',
  amount: 0,
}

const OrderForm = () => {
  const [form, setForm] = useState<OrderMutation>(initialState)
  const [productsForm, setProductsForm] = useState<
    {
      product: Product
      description: string
      amount: number
    }[]
  >([])
  const [defectForm, setDefectForm] = useState<
    {
      product: Product
      defect_description: string
      amount: number
    }[]
  >([])
  const [newFieldDefects, setNewFieldDefects] = useState<Defect>(initialStateDefect)
  const [modalOpenDefects, setModalOpenDefects] = useState(false)
  const [isButtonDefectVisible, setButtonDefectVisible] = useState(true)
  const [currentClient, setCurrentClient] = useState<string>('')
  const [newField, setNewField] = useState<ProductOrder>(initialStateProduct)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddOrder)
  const createError = useAppSelector(selectCreateOrderError)
  const clients = useAppSelector(selectAllClients)
  const clientProducts = useAppSelector(selectAllProducts)
  const loadingFetchClient = useAppSelector(selectLoadingFetchClient)
  const [isButtonVisible, setButtonVisible] = useState(true)
  const [errors, setErrors] = useState<{
    client: string
    product: string
    price: number
    amount: number
    defect_description: string
    sent_at: string
    delivered_at: string
  }>({
    client: '',
    product: '',
    price: 0,
    sent_at: '',
    amount: 0,
    defect_description: '',
    delivered_at: '',
  })

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (value.trim() === '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: 'Это поле обязательно для заполнения',
      }))
    } else if ((name === 'price' && Number(value) === 0) || Number(value) < 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: 'Поле сумма заказа должно быть больше 0',
      }))
    } else if ((name === 'amount' && Number(value) === 0) || Number(value) < 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: 'Поле количество товара должно быть больше 0',
      }))
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
      }))
    }
  }

  const handleButtonClick = () => {
    if (!currentClient) {
      toast.warn('Выберите клиента')
    } else {
      setModalOpen(true)
      setButtonVisible(false)
    }
  }

  const handleCloseDefectModal = () => {
    setModalOpenDefects(false)
    setButtonDefectVisible(true)
  }

  const handleButtonDefectClick = () => {
    if (!currentClient) {
      toast.warn('Выберите клиента')
    } else {
      setModalOpenDefects(true)
      setButtonDefectVisible(false)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setButtonVisible(true)
  }

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  useEffect(() => {
    if (form.client) {
      clients?.map(client => {
        if (form.client === client._id) {
          setCurrentClient(client._id)
        }
      })
      dispatch(fetchProductsByClientId(currentClient))
    }
  }, [clients, currentClient, dispatch, form.client])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.products.length === 0) {
      toast.error('Добавьте товары')
    } else {
      await dispatch(addOrder(form)).unwrap()
      setForm(initialState)
      setProductsForm([])
      toast.success('Заказ успешно создан!')
    }
  }

  const getFieldError = (fieldName: string) => {
    try {
      return createError?.errors[fieldName].messages[0]
    } catch {
      return undefined
    }
  }

  const hndChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newValue = name === 'price' ? parseFloat(value) : value
    setForm(prev => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const deleteProduct = (index: number) => {
    setProductsForm(productsForm.filter((_prod, i) => i !== index))
    setForm(prev => ({
      ...prev,
      products: [...prev.products.filter((_prod, i) => i !== index)],
    }))
  }

  const deleteDefect = (index: number) => {
    setDefectForm(defectForm.filter((_prod, i) => i !== index))
    setForm(prev => ({
      ...prev,
      defects: prev.defects ? prev.defects.filter((_prod, i) => i !== index) : [],
    }))
  }

  const setFormArrayData = () => {
    setForm(prev => ({
      ...prev,
      products: newField.product ? [...prev.products, newField] : prev.products,
      defects: newFieldDefects.product
        ? prev.defects
          ? [...prev.defects, newFieldDefects]
          : [newFieldDefects]
        : prev.defects,
    }))

    setNewField(initialStateProduct)
    setNewFieldDefects(initialStateDefect)
    setModalOpenDefects(false)
    setModalOpen(false)
    setButtonDefectVisible(true)
    setButtonVisible(true)
  }

  const addArrayProductInForm = () => {
    if (clientProducts) {
      for (let i = 0; i < clientProducts.length; i++) {
        if (newField.product === clientProducts[i]._id) {
          setProductsForm(prev => [
            ...prev,
            {
              product: clientProducts[i],
              amount: Number(newField.amount),
              description: newField.description,
            },
          ])
        }
        setFormArrayData()
      }
    }
  }

  const addArrayDefectInForm = () => {
    if (clientProducts) {
      for (let i = 0; i < clientProducts.length; i++) {
        if (newFieldDefects.product === clientProducts[i]._id) {
          setDefectForm(prev => [
            ...prev,
            {
              product: clientProducts[i],
              amount: Number(newFieldDefects.amount),
              defect_description: newFieldDefects.defect_description,
            },
          ])
        }
        setFormArrayData()
      }
    }
  }

  return (
    <>
      {loadingFetchClient ? (
        <CircularProgress />
      ) : (
        <form onSubmit={onSubmit} style={{ width: '60%', margin: '20px auto' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Добавить новый заказ
          </Typography>
          <Grid container direction="column" spacing={2}>
            {clients && clients?.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <Autocomplete
                    size={'small'}
                    fullWidth
                    disablePortal
                    options={clients}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        setForm(prevState => ({ ...prevState, client: newValue._id }))
                        setCurrentClient(newValue._id)
                      }
                    }}
                    getOptionLabel={option => option.full_name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
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
                </FormControl>
              </Grid>
            )}
            <>
              <label className={'fs-4 my-1'}>Товары</label>
              {productsForm.length === 0 ? (
                <Typography>В заказе отсутствуют товары</Typography>
              ) : (
                <>
                  {productsForm.map((product, i) => (
                    <Grid
                      style={{ border: '1px solid lightgrey', borderRadius: '5px' }}
                      padding={'5px'}
                      fontSize={'15px'}
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      key={product.product._id + i}
                    >
                      <Grid style={{ textTransform: 'capitalize' }}>
                        {product.product.title}{' '}
                        <Typography fontSize={'15px'} fontWeight={'bolder'}>
                          aртикул: {product.product.article}
                        </Typography>{' '}
                        {product.amount} шт
                      </Grid>
                      <Button
                        type={'button'}
                        onClick={() => {
                          deleteProduct(i)
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  ))}
                </>
              )}
            </>

            <Grid>
              <Grid>
                {isButtonVisible && (
                  <Button type="button" className={'btn d-block w-50 mx-auto text-center'} onClick={handleButtonClick}>
                    + Добавить товар
                  </Button>
                )}
              </Grid>
            </Grid>

            {modalOpen && clientProducts && (
              <Grid size={{ xs: 12 }}>
                <Typography style={{ marginBottom: '10px' }}>Добавить товар</Typography>
                <Autocomplete
                  style={{ marginBottom: '10px' }}
                  fullWidth
                  size={'small'}
                  disablePortal
                  options={clientProducts}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setNewField(prevState => ({ ...prevState, product: newValue._id }))
                    }
                  }}
                  getOptionLabel={option => `${ option.title }   артикул: ${ option.article }`}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Товар"
                      required={true}
                      error={Boolean(errors.product)}
                      helperText={errors.product || getFieldError('product')}
                      onBlur={() => {
                        if (!newField.product) {
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
                    />
                  )}
                />
                <TextField
                  fullWidth
                  size={'small'}
                  label="количество товара"
                  style={{ marginBottom: '10px' }}
                  type="number"
                  name={'amount'}
                  required={true}
                  value={newField.amount}
                  onChange={e => setNewField({ ...newField, amount: Number(e.target.value) })}
                  error={Boolean(errors.amount)}
                  helperText={errors.amount || getFieldError('amount')}
                  onBlur={handleBlur}
                />
                <TextField
                  label="описание товара"
                  fullWidth
                  size={'small'}
                  style={{ marginBottom: '10px' }}
                  type="text"
                  value={newField.description}
                  onChange={e => setNewField({ ...newField, description: e.target.value })}
                />
                <Button type={'button'} onClick={addArrayProductInForm}>
                  Добавить товар в заказ
                </Button>
                <Button type={'button'} onClick={handleCloseModal}>
                  Закрыть
                </Button>
              </Grid>
            )}

            <Grid>
              <TextField
                id="price"
                name="price"
                size={'small'}
                type={'number'}
                label="Сумма заказа"
                value={form.price}
                onChange={hndChange}
                error={Boolean(errors.price)}
                helperText={errors.price || getFieldError('price')}
                fullWidth
                onBlur={handleBlur}
              />
            </Grid>

            <Grid>
              <InputLabel htmlFor="sent_at" style={{ fontSize: '15px', marginLeft: '12px' }}>
                Дата отправки
              </InputLabel>
              <TextField
                id="sent_at"
                name="sent_at"
                size={'small'}
                type="date"
                value={form.sent_at}
                onChange={hndChange}
                error={Boolean(errors.sent_at)}
                helperText={errors.sent_at || getFieldError('sent_at')}
                onBlur={handleBlur}
                fullWidth
              />
            </Grid>

            <Grid>
              <InputLabel htmlFor="delivered_at" style={{ fontSize: '15px', marginLeft: '12px' }}>
                Дата доставки
              </InputLabel>
              <TextField
                id="delivered_at"
                name="delivered_at"
                size={'small'}
                value={form.delivered_at}
                type="date"
                onChange={hndChange}
                error={Boolean(errors.delivered_at)}
                helperText={errors.delivered_at || getFieldError('delivered_at')}
                fullWidth
                onBlur={handleBlur}
              />
            </Grid>

            <Grid>
              <TextField
                id="comment"
                size={'small'}
                name="comment"
                label="Комментарий"
                value={form.comment}
                onChange={hndChange}
                fullWidth
              />
            </Grid>
            <>
              <label className={'fs-4 my-1'}>Дефекты товаров</label>
              {productsForm.length === 0 ? (
                <Typography>В заказе отсутствуют дефекты</Typography>
              ) : (
                <>
                  {' '}
                  {defectForm.map((defect, i) => (
                    <Grid
                      style={{ border: '1px solid lightgrey', borderRadius: '5px' }}
                      padding={'5px'}
                      fontSize={'15px'}
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      key={defect.product._id + i}
                    >
                      <Grid style={{ textTransform: 'capitalize' }}>
                        {defect.product.title}{' '}
                        <Typography fontSize={'15px'} fontWeight={'bolder'}>
                          aртикул: {defect.product.article}
                        </Typography>
                        <Typography fontSize={'15px'}> {defect.defect_description}</Typography> {defect.amount} шт
                      </Grid>
                      <Button
                        type={'button'}
                        onClick={() => {
                          deleteDefect(i)
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  ))}
                </>
              )}
            </>

            <Grid>
              <Grid>
                {isButtonDefectVisible && (
                  <Button
                    type="button"
                    className={'btn d-block w-50 mx-auto text-center'}
                    onClick={handleButtonDefectClick}
                  >
                    + Добавить дефекты
                  </Button>
                )}
              </Grid>
            </Grid>

            {modalOpenDefects && clientProducts && (
              <Grid size={{ xs: 12 }}>
                <Typography style={{ marginBottom: '10px' }}>Добавить дефекты товаров</Typography>
                <Autocomplete
                  style={{ marginBottom: '10px' }}
                  fullWidth
                  size={'small'}
                  disablePortal
                  options={clientProducts}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setNewFieldDefects(prevState => ({ ...prevState, product: newValue._id }))
                    }
                  }}
                  getOptionLabel={option => `${ option.title }   артикул: ${ option.article }`}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Товар"
                      error={Boolean(errors.product)}
                      helperText={errors.product || getFieldError('product')}
                      onBlur={() => {
                        if (!newFieldDefects.product) {
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
                    />
                  )}
                />
                <TextField
                  fullWidth
                  size={'small'}
                  label="количество дефектного товара"
                  style={{ marginBottom: '10px' }}
                  type="number"
                  error={Boolean(errors.amount)}
                  name={'amount'}
                  helperText={errors.amount || getFieldError('amount')}
                  onBlur={handleBlur}
                  value={newFieldDefects.amount}
                  onChange={e => setNewFieldDefects({ ...newFieldDefects, amount: Number(e.target.value) })}
                />
                <TextField
                  label="описание дефекта товара"
                  fullWidth
                  size={'small'}
                  style={{ marginBottom: '10px' }}
                  type="text"
                  name={'defect_description'}
                  error={Boolean(errors.defect_description)}
                  helperText={errors.defect_description || getFieldError('defect_description')}
                  onBlur={handleBlur}
                  value={newFieldDefects.defect_description}
                  onChange={e => setNewFieldDefects({ ...newFieldDefects, defect_description: e.target.value })}
                />
                <Button type={'button'} onClick={addArrayDefectInForm}>
                  Добавить дефект в заказ
                </Button>
                <Button type={'button'} onClick={handleCloseDefectModal}>
                  Закрыть
                </Button>
              </Grid>
            )}

            <Grid>
              <Button type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Создать заказ'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  )
}
export default OrderForm
