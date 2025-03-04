import Grid from '@mui/material/Grid2'
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  TextField,
  Autocomplete,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { toast } from 'react-toastify'
import { selectCreateOrderError, selectLoadingAddOrder } from '../../../store/slices/orderSlice.ts'
import { selectAllClients } from '../../../store/slices/clientSlice.ts'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { fetchClients } from '../../../store/thunks/clientThunk.ts'
import { addOrder } from '../../../store/thunks/orderThunk.ts'
import { OrderMutation, Product, ProductOrder } from '../../../types'
import { fetchProductsOneClient } from '../../../store/thunks/productThunk.ts'


const initialState: OrderMutation = {
  client: '',
  products: [],
  price: 0,
  sent_at: '',
  delivered_at: '',
  comment: '',
  defects:[],
}

const initialStateProduct = {
  product: '',
  description: '',
  amount:0,
}

const OrderForm = () => {
  const [form, setForm] = useState<OrderMutation>(initialState)
  const [productsForm, setProductsForm] = useState<{ product: Product,
    description: string,
    amount:number,}[]>([])
  const [currentClient, setCurrentClient] = useState<string>('')
  const [newField, setNewField] = useState<ProductOrder>(initialStateProduct)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingAddOrder)
  const createError = useAppSelector(selectCreateOrderError)
  const clients = useAppSelector(selectAllClients)
  const clientProducts = useAppSelector(selectAllProducts)

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  useEffect(() => {
    if (form.client) {
      clients?.map(client => {
        if (form.client === client._id) {
          setCurrentClient((client._id))
        }
      })
      dispatch(fetchProductsOneClient(currentClient))
    }
  }, [clients, currentClient, dispatch, form.client])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
    console.log(productsForm)
    await dispatch(addOrder(form)).unwrap()
    setForm(initialState)
    setProductsForm([])
    toast.success('Заказ успешно создан!')
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

  const addArrayProductInForm = ()=>{
    if(clientProducts)
      for(let i=0; i<clientProducts.length; i++) {
        if(newField.product === clientProducts[i]._id){
          setProductsForm(prev => ([
            ...prev,
            { product: clientProducts[i],
              amount: Number(newField.amount),
              description: newField.description,
            },
          ]))
        }
      }
    setForm(prev => ({
      ...prev,
      products: [...prev.products, newField],
    }))
    setNewField(initialStateProduct)
  }

  return (
    <>
      <form onSubmit={onSubmit} style={{ width: '50%', margin: '20px auto' }}>
        <Typography variant='h5' sx={{ mb: 2 }}>Добавить новый заказ</Typography>
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
                  renderInput={params => <TextField {...params} label="Клиент"/>
                  }
                />
              </FormControl>
            </Grid>
          )}
          <>
            <label className={'fs-4 my-2'}>Товары</label>
            {productsForm.map((product,i) => (
              <div key={product.product._id}><p
              >{product.product.title} Артикул: {product.product.article} {product.amount} шт</p>
              <button type={'button'} onClick={()=>{deleteProduct(i)}}>удалить</button>
              </div>


            ))}
          </>

          <Grid>
            <Button
              type="button"
              className={'btn d-block w-50 mx-auto text-center'}
              onClick={() => setModalOpen(true)}
            >
                + Добавить товар
            </Button>
          </Grid>

          {modalOpen && clientProducts && (

            <Grid size={{ xs: 12 }}>
              <Typography  style={{ marginBottom: '10px' }}>Добавить товар</Typography>
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
                getOptionLabel={option => `${ option.title } артикул: ${ option.article }`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={params => <TextField {...params} label="Товар"/>
                }
              />
              <TextField
                fullWidth
                size={'small'}
                label="количество товара"
                style={{ marginBottom: '10px' }}
                type="number"
                value={newField.amount}
                onChange={e => setNewField({ ...newField, amount: Number( e.target.value) })}
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
              <Button type={'button'} onClick={addArrayProductInForm}>Сохранить это товар</Button>
              <Button type={'button'} onClick={() => setModalOpen(false)}>Закрыть</Button>
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
              error={Boolean(getFieldError('price'))}
              helperText={getFieldError('price')}
              fullWidth
            />
          </Grid>

          <Grid>
            <InputLabel htmlFor="sent_at" style={{ fontSize:'15px', marginLeft:'12px' }}>Дата отправки</InputLabel>
            <TextField
              id="sent_at"
              name="sent_at"
              size={'small'}
              type="date"
              value={form.sent_at}
              onChange={hndChange}
              error={Boolean(getFieldError('sent_at'))}
              helperText={getFieldError('sent_at')}
              fullWidth
            />
          </Grid>

          <Grid>
            <InputLabel htmlFor="delivered_at" style={{ fontSize:'15px', marginLeft:'12px' }}>Дата доставки</InputLabel>
            <TextField
              id="delivered_at"
              name="delivered_at"
              size={'small'}
              value={form.delivered_at}
              type="date"
              onChange={hndChange}
              error={Boolean(getFieldError('delivered_at'))}
              helperText={getFieldError('delivered_at')}
              fullWidth
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

          <Grid>
            <Button type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24}/> : 'Создать заказ'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}
export default OrderForm
