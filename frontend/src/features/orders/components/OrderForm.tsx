import Grid from '@mui/material/Grid2'
import { Autocomplete, Button, CircularProgress, FormControl, InputLabel, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import {inputChangeHandler} from "../../../utils/inputChangeHandler.ts";
import {getFieldError} from "../../../utils/getFieldError.ts";
import {useOrderForm} from "../hooks/useOrderForm.ts";


const OrderForm = () => {
  const {
    form,
    setForm,
    productsForm,
    defectForm,
    newField,
    setNewField,
    newFieldDefects,
    setNewFieldDefects,
    modalOpen,
    modalOpenDefects,
    isButtonDefectVisible,
    isButtonVisible,
    setCurrentClient,
    errors,
    setErrors,
    loading,
    createError,
    clients,
    clientProducts,
    loadingFetchClient,
    handleBlur,
    handleBlurAutoComplete,
    handleButtonClick,
    handleButtonDefectClick,
    handleCloseModal,
    handleCloseDefectModal,
    deleteProduct,
    deleteDefect,
    addArrayProductInForm,
    addArrayDefectInForm,
    onSubmit,
  } = useOrderForm();

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
                    value={clients.find(option => option._id === form.client) || null}
                    getOptionLabel={option => option.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Клиент"
                        error={Boolean(errors.client)}
                        helperText={errors.client || getFieldError('client',createError)}
                        onBlur={()=>handleBlurAutoComplete('client', setErrors, form, 'Выберите клиента')}
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
                      helperText={errors.product || getFieldError('product', createError)}
                      onBlur={()=>handleBlurAutoComplete('product', setErrors, newField, 'Выберите товар')}
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
                  value={newField.amount || ''}
                  onChange={e => setNewField({ ...newField, amount: Number(e.target.value) })}
                  error={Boolean(errors.amount)}
                  helperText={errors.amount || getFieldError('amount' , createError)}
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
                value={form.price || '' }
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                error={Boolean(errors.price)}
                helperText={errors.price || getFieldError('price', createError)}
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
                onChange={(e) => inputChangeHandler(e, setForm)}
                error={Boolean(errors.sent_at)}
                helperText={errors.sent_at || getFieldError('sent_at', createError)}
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
                onChange={(e) => inputChangeHandler(e, setForm)}
                error={Boolean(errors.delivered_at)}
                helperText={errors.delivered_at || getFieldError('delivered_at', createError)}
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
                onChange={(e) => inputChangeHandler(e, setForm)}
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
                      helperText={errors.product || getFieldError('product', createError)}
                      onBlur={()=>handleBlurAutoComplete('product', setErrors, newFieldDefects, 'Выберите товар')}
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
                  helperText={errors.amount || getFieldError('amount', createError)}
                  onBlur={handleBlur}
                  value={newFieldDefects.amount || ''}
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
                  helperText={errors.defect_description || getFieldError('defect_description', createError)}
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
