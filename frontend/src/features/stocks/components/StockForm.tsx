import React from 'react'
import { ProductArrival, StockPopulate } from '../../../types'
import { useStockForm } from '../hooks/useStockForm.ts'
import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import ItemsList from '../../arrivals/components/ItemsList.tsx'
import Autocomplete from '@mui/material/Autocomplete'
import { getFieldError } from '../../../utils/getFieldError.ts'
import { inputChangeHandler } from '../../../utils/inputChangeHandler.ts'
import { getProductNameById } from '../../../utils/getProductName.ts'

interface Props {
  initialData?: StockPopulate | undefined
  onSuccess?: () => void
}

const StockForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const {
    products,
    isLoading,
    form,
    setForm,
    newItem,
    setNewItem,
    errors,
    productsForm,
    productsModalOpen,
    setProductsModalOpen,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    error,
    submitFormHandler,
  } = useStockForm(initialData, onSuccess)

  return (
    <form onSubmit={submitFormHandler}>
      <Grid container direction="column" spacing={2} sx={{ maxWidth: '500px', margin: 'auto' }}>
        {isLoading ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : null}

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
          {initialData ? 'Редактировать данные склада' : 'Добавить новый склад'}
        </Typography>

        <Grid>
          <TextField
            id="name"
            name="name"
            label={'Название склада, например: "Склад Бишкек"'}
            value={form.name}
            onChange={e => inputChangeHandler(e, setForm)}
            size="small"
            error={Boolean(errors.name || getFieldError('name', error))}
            helperText={errors.name || getFieldError('name', error)}
            onBlur={e => handleBlur('name', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <TextField
            id="address"
            name="address"
            label="Адрес склада"
            value={form.address}
            onChange={e => inputChangeHandler(e, setForm)}
            size="small"
            error={Boolean(errors.address || getFieldError('address', error))}
            helperText={errors.address || getFieldError('address', error)}
            onBlur={e => handleBlur('address', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <Typography fontWeight="bold">Товары</Typography>
          <ItemsList
            items={productsForm}
            onDelete={i => deleteItem(i)}
            getProductNameById={i => getProductNameById(products, i)}
          />
          <Button type="button" onClick={() => openModal()}>
            + Добавить товары
          </Button>
        </Grid>

        {productsModalOpen && (
          <Grid>
            <Typography sx={{ marginBottom: '15px' }}>Укажите товары</Typography>
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={products ?? []}
              onChange={(_, newValue) => {
                if (newValue) {
                  setNewItem(prev => ({ ...prev, product: newValue._id }))
                }
              }}
              getOptionLabel={option => `${ option.title }. Артикул: ${ option.article }`}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Товар"
                  error={Boolean(errors.product || getFieldError('product', error))}
                  helperText={errors.product || getFieldError('product', error)}
                  onBlur={e => handleBlur('product', e.target.value)}
                />
              )}
              sx={{ marginBottom: '15px' }}
            />

            <TextField
              type="number"
              fullWidth
              size="small"
              name="amount"
              label="Количество товара"
              value={newItem.amount || ''}
              onChange={e => setNewItem(prev => ({ ...prev, amount: +e.target.value }))}
              error={Boolean(errors.amount || getFieldError('amount', error))}
              helperText={errors.amount || getFieldError('amount', error)}
              onBlur={e => handleBlur('amount', e.target.value)}
              sx={{ marginBottom: '15px' }}
            />

            <TextField
              label="Описание товара"
              fullWidth
              size="small"
              name="description"
              value={(newItem as ProductArrival).description || ''}
              onChange={e =>
                setNewItem(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              sx={{ marginBottom: '15px' }}
            />

            <Grid container spacing={2}>
              <Button type="button" variant="outlined" onClick={() => addItem()}>
                Добавить
              </Button>

              <Button type="button" variant="outlined" onClick={() => setProductsModalOpen(false)}>
                Закрыть
              </Button>
            </Grid>
          </Grid>
        )}

        <Grid>
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : initialData ? (
              'Обновить склад'
            ) : (
              'Создать склад'
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default StockForm
