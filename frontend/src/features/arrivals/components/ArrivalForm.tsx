import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, Divider, InputLabel, TextField, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import ItemsList from './ItemsList.tsx'
import { useArrivalForm } from '../hooks/useArrivalForm.ts'
import { Defect, ProductArrival } from '../../../types'
import { initialItemState } from '../state/arrivalState.ts'
import { getFieldError } from '../../../utils/getFieldError.ts'
import { inputChangeHandler } from '../../../utils/inputChangeHandler.ts'

const ArrivalForm = () => {
  const {
    products,
    isLoading,
    form,
    setForm,
    newItem,
    setNewItem,
    errors,
    productsForm,
    setProductsForm,
    receivedForm,
    setReceivedForm,
    defectForm,
    setDefectForm,
    productsModalOpen,
    setProductsModalOpen,
    receivedModalOpen,
    setReceivedModalOpen,
    defectsModalOpen,
    setDefectsModalOpen,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    autoCompleteClients,
    getProductNameById,
    error,
    submitFormHandler,
  } = useArrivalForm()

  return (
    <form onSubmit={submitFormHandler} style={{ marginTop: '3rem' }}>
      <Grid container direction="column" spacing={2} sx={{ maxWidth: '500px', margin: 'auto' }}>
        {isLoading ? (
          <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : null}

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
                error={Boolean(errors.client || getFieldError('client', error))}
                helperText={errors.client || getFieldError('client', error)}
                onBlur={e => handleBlur('client', e.target.value)}
              />
            )}
          />
        </Grid>

        <Grid>
          <Typography fontWeight="bold">Товары</Typography>
          <ItemsList
            items={productsForm}
            onDelete={i => deleteItem(i, setProductsForm)}
            getProductNameById={getProductNameById}
          />
          <Button type="button" onClick={() => openModal('products', initialItemState)}>
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
              <Button type="button" variant="outlined" onClick={() => addItem('products')}>
                Добавить
              </Button>

              <Button type="button" variant="outlined" onClick={() => setProductsModalOpen(false)}>
                Закрыть
              </Button>
            </Grid>
          </Grid>
        )}

        <Grid>
          <Divider sx={{ width: '100%', marginBottom: '15px' }} />
          <Typography fontWeight="bold">Полученные товары</Typography>
          <ItemsList
            items={receivedForm}
            onDelete={i => deleteItem(i, setReceivedForm)}
            getProductNameById={getProductNameById}
          />
          <Button type="button" onClick={() => openModal('received_amount', initialItemState)}>
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

            <Button type="button" onClick={() => addItem('received_amount')}>
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
          <ItemsList
            items={defectForm}
            onDelete={i => deleteItem(i, setDefectForm)}
            getProductNameById={getProductNameById}
          />
          <Button type="button" onClick={() => openModal('defects', initialItemState)}>
            + Добавить дефекты
          </Button>
        </Grid>

        {defectsModalOpen && (
          <Grid>
            <Typography sx={{ marginBottom: '15px' }}>Укажите дефекты</Typography>
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
              label="Количество дефектного товара"
              name="amount"
              value={newItem.amount || ''}
              onChange={e => setNewItem(prev => ({ ...prev, amount: +e.target.value }))}
              error={Boolean(errors.amount || getFieldError('amount', error))}
              helperText={errors.amount || getFieldError('amount', error)}
              onBlur={e => handleBlur('amount', e.target.value)}
              sx={{ marginBottom: '15px' }}
            />

            <TextField
              label="Описание дефекта"
              fullWidth
              size="small"
              name="defect_description"
              value={(newItem as Defect).defect_description || ''}
              onChange={e =>
                setNewItem(prev => ({
                  ...prev,
                  defect_description: e.target.value,
                }))
              }
              error={Boolean(errors.defect_description || getFieldError('defect_description', error))}
              helperText={errors.defect_description || getFieldError('defect_description', error)}
              onBlur={e => handleBlur('defect_description', e.target.value)}
              sx={{ marginBottom: '15px' }}
            />

            <Button type="button" onClick={() => addItem('defects')}>
              Добавить
            </Button>

            <Button type="button" onClick={() => setDefectsModalOpen(false)}>
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
            value={form.arrival_price || ''}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                arrival_price: Number(e.target.value),
              }))
            }
            size="small"
            error={Boolean(errors.arrival_price || getFieldError('arrival_price', error))}
            helperText={errors.arrival_price || getFieldError('arrival_price', error)}
            onBlur={e => handleBlur('arrival_price', e.target.value)}
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
            onChange={e => inputChangeHandler(e, setForm)}
            error={Boolean(errors.arrival_date || getFieldError('arrival_date', error))}
            helperText={errors.arrival_date || getFieldError('arrival_date', error)}
            onBlur={e => handleBlur('arrival_date', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <TextField
            id="sent_amount"
            name="sent_amount"
            label="Количество отправленного товара (шт/мешков/коробов)"
            value={form.sent_amount}
            onChange={e => inputChangeHandler(e, setForm)}
            size="small"
            error={Boolean(errors.sent_amount || getFieldError('sent_amount', error))}
            helperText={errors.sent_amount || getFieldError('sent_amount', error)}
            onBlur={e => handleBlur('sent_amount', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Создать поставку'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ArrivalForm
