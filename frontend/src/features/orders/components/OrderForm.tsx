import Grid from '@mui/material/Grid2'
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material'
import { inputChangeHandler } from '@/utils/inputChangeHandler.ts'
import { getFieldError } from '@/utils/getFieldError.ts'
import { useOrderForm } from '../hooks/useOrderForm.ts'
import React from 'react'
import { ErrorMessagesList } from '@/messages.ts'
import { OrderStatus } from '@/constants.ts'
import { getAutocompleteItemName } from '@/utils/getAutocompleteItemName.ts'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import FileAttachments from '@/components/FileAttachment/FileAttachment.tsx'
import ItemsList from '@/features/arrivals/components/ItemsList.tsx'
import { initialItemState, initialServiceState } from '@/features/arrivals/state/arrivalState.ts'
import { Defect, ProductOrder } from '@/types.js'
import { getArrayItemNameById } from '@/utils/getArrayItemName.ts'
import { ItemType } from '../utils/orderTypes.ts'

interface Props {
  onSuccess?: () => void
  handleClose?: () => void
}

const OrderForm: React.FC<Props> = ({ onSuccess }) => {
  const {
    form,
    setForm,
    errors,
    productsForm,
    setProductsForm,
    defectsForm,
    setDefectForm,
    servicesForm,
    setServicesForm,
    loading,
    createError,
    clients,
    loadingFetchClient,
    handleBlur,
    onSubmit,
    initialData,
    availableDefects,
    files,
    handleFileChange,
    stocks,
    handleRemoveFile,
    handleRemoveExistingFile,
    existingFiles,
    handleModalCancel,
    handleModalConfirm,
    openDeleteModal,
    productsModalOpen,
    setProductsModalOpen,
    defectsModalOpen,
    setDefectsModalOpen,
    servicesModalOpen,
    setServicesModalOpen,
    setNewService,
    services,
    newService,
    openModal,
    addItem,
    deleteItem,
    setNewItem,
    availableProducts,
    error,
    newItem,
  } = useOrderForm(onSuccess)

  return (
    <>
      {loadingFetchClient ? (
        <CircularProgress />
      ) : (
        <form onSubmit={onSubmit}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {initialData ? 'Редактировать данные заказа' : 'Добавить новый заказ'}
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
                    getOptionKey={option => option._id}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        setForm(prevState => ({ ...prevState, client: newValue._id }))
                      }
                    }}
                    value={clients.find(option => option._id === form.client) || null}
                    getOptionLabel={option => option.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Клиент"
                        error={Boolean(errors.client || getFieldError('client', createError))}
                        helperText={errors.client || getFieldError('client', createError)}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid>
              <Autocomplete
                id="stock"
                value={
                  getAutocompleteItemName(stocks, 'name', '_id').find(option => option.id === form.stock) || null
                }
                onChange={(_, newValue) => setForm(prevState => ({ ...prevState, stock: newValue?.id || '' }))}
                size="small"
                fullWidth
                disablePortal
                options={getAutocompleteItemName(stocks, 'name', '_id')}
                getOptionKey={option => option.id}
                sx={{ width: '100%' }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Склад, с которого будет отправлен товар"
                    error={Boolean(errors.stock || getFieldError(ErrorMessagesList.StockErr, createError))}
                    helperText={errors.stock || getFieldError(ErrorMessagesList.StockErr, createError)}
                  />
                )}
              />
            </Grid>

            <Grid>
              <Typography fontWeight="bold">Товары</Typography>
              <ItemsList<ProductOrder>
                items={productsForm}
                onDelete={i => deleteItem(i, setProductsForm)}
                getNameById={i => getArrayItemNameById(availableProducts, i)}
              />
              <Button type="button" onClick={() => openModal(ItemType.PRODUCTS, initialItemState)}>
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
                  options={availableProducts ?? []}
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
                  value={(newItem as ProductOrder).description || ''}
                  onChange={e =>
                    setNewItem(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  sx={{ marginBottom: '15px' }}
                />

                <Grid container spacing={2}>
                  <Button type="button" variant="outlined" onClick={() => addItem(ItemType.PRODUCTS)}>
                    Добавить
                  </Button>

                  <Button type="button" variant="outlined" onClick={() => setProductsModalOpen(false)}>
                    Закрыть
                  </Button>
                </Grid>
              </Grid>
            )}

            <Grid>
              <TextField
                id="price"
                name="price"
                size={'small'}
                type={'number'}
                label="Сумма заказа"
                value={form.price || ''}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                error={Boolean(errors.price || getFieldError('price', createError))}
                helperText={errors.price || getFieldError('price', createError)}
                fullWidth
                onBlur={e => handleBlur('price', e.target.value)}
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
                onChange={e => inputChangeHandler(e, setForm)}
                error={Boolean(errors.sent_at || getFieldError('sent_at', createError))}
                helperText={errors.sent_at || getFieldError('sent_at', createError)}
                onBlur={e => handleBlur('sent_at', e.target.value)}
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
                onChange={e => inputChangeHandler(e, setForm)}
                fullWidth
              />
            </Grid>
            <Grid container direction="column" spacing={2}>
              {OrderStatus && OrderStatus?.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      size={'small'}
                      fullWidth
                      disablePortal
                      options={OrderStatus}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setForm(prevState => ({ ...prevState, status: newValue || '' }))
                        }
                      }}
                      value={OrderStatus.find(option => option === form.status) || null}
                      getOptionLabel={option => option || ''}
                      isOptionEqualToValue={(option, value) => option === value}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Статус заказа"
                          error={Boolean(errors.status || getFieldError('status', createError))}
                          helperText={errors.status || getFieldError('status', createError)}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <Grid>
              <TextField
                id="comment"
                size={'small'}
                name="comment"
                label="Комментарий"
                value={form.comment}
                onChange={e => inputChangeHandler(e, setForm)}
                fullWidth
              />
            </Grid>

            <Grid>
              <Divider sx={{ width: '100%', marginBottom: '15px' }} />
              <Typography fontWeight="bold">Дефекты</Typography>
              <ItemsList<Defect>
                items={defectsForm}
                onDelete={i => deleteItem(i, setDefectForm)}
                getNameById={i => getArrayItemNameById(availableProducts, i)}
              />
              <Button type="button" onClick={() => openModal(ItemType.DEFECTS, initialItemState)}>
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
                  options={availableDefects ?? []}
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

                <Grid container spacing={2}>
                  <Button type="button" variant="outlined" onClick={() => addItem(ItemType.DEFECTS)}>
                    Добавить
                  </Button>

                  <Button type="button" variant="outlined" onClick={() => setDefectsModalOpen(false)}>
                    Закрыть
                  </Button>
                </Grid>
              </Grid>
            )}

            <Grid>
              <Divider sx={{ width: '100%', marginBottom: '15px' }} />
              <Typography fontWeight="bold">Услуги</Typography>
              <ItemsList
                items={servicesForm}
                onDelete={i => deleteItem(i, setServicesForm)}
                getNameById={i => getArrayItemNameById(services, i, true)}
              />

              <Button type="button" onClick={() => openModal(ItemType.SERVICES, initialServiceState)}>
                + Добавить услуги
              </Button>
            </Grid>

            {servicesModalOpen && (
              <Grid>
                <Typography sx={{ marginBottom: '15px' }}>Укажите услуги</Typography>
                <Autocomplete
                  fullWidth
                  size="small"
                  disablePortal
                  options={getAutocompleteItemName(services, 'name', '_id')}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setNewService(prev => ({ ...prev, service: newValue.id }))
                    }
                  }}
                  getOptionLabel={option => `${ option.label }`}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Услуга"
                      error={Boolean(errors.service || getFieldError('service', error))}
                      helperText={errors.service || getFieldError('service', error)}
                      onBlur={e => handleBlur('service', e.target.value)}
                    />
                  )}
                  sx={{ marginBottom: '15px' }}
                />

                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  label="Количество услуги"
                  name="service_amount"
                  value={newService.service_amount || ''}
                  onChange={e => setNewService(prev => ({ ...prev, service_amount: +e.target.value }))}
                  error={Boolean(errors.service_amount || getFieldError('service_amount', error))}
                  helperText={errors.service_amount || getFieldError('service_amount', error)}
                  onBlur={e => handleBlur('service_amount', e.target.value)}
                  sx={{ marginBottom: '15px' }}
                />

                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  label="Цена услуги"
                  name="service_price"
                  value={newService.service_price || services.find(s => s._id === newService.service)?.price || ''}
                  onChange={e => {
                    const newPrice = +e.target.value
                    setNewService(prev => ({
                      ...prev,
                      service_price: newPrice >= 0 ? newPrice : prev.service_price,
                    }))
                  }}
                  error={Boolean(errors.service_price || getFieldError('service_price', error))}
                  helperText={errors.service_price || getFieldError('service_price', error)}
                  sx={{ marginBottom: '15px' }}
                />

                {newService.service_price !== undefined &&
                  newService.service_price !== null &&
                  newService.service_price !== 0 && (
                  <FormHelperText sx={{ color: 'red', mb: 2, fontWeight: 'bold' }}>
                      Указанная цена перезапишет стандартную стоимость услуги при выставлении счёта!
                  </FormHelperText>
                )}

                <Grid container spacing={2}>
                  <Button type="button" variant="outlined" onClick={() => addItem(ItemType.SERVICES)}>
                    Добавить
                  </Button>

                  <Button type="button" variant="outlined" onClick={() => setServicesModalOpen(false)}>
                    Закрыть
                  </Button>
                </Grid>
              </Grid>
            )}

            <FileAttachments
              existingFiles={existingFiles}
              onRemoveExistingFile={handleRemoveExistingFile}
              files={files}
              onRemoveFile={handleRemoveFile}
              onFileChange={handleFileChange}
            />
            <Grid>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : initialData ? (
                  'Обновить заказ'
                ) : (
                  'Создать заказ'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
      <ConfirmationModal
        open={openDeleteModal}
        entityName="этот документ"
        actionType="delete"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </>
  )
}
export default OrderForm
