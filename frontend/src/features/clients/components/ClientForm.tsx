import Grid from '@mui/material/Grid2'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useClientForm } from '../hooks/useClientForm.ts'

const ClientForm = () => {

  const { form, loading, inputChangeHandler, onSubmit, getFieldError } = useClientForm()

  return (
    <>
      <form onSubmit={onSubmit} style={{ width: '70%', margin: '0 auto' }}>
        <Typography variant='h4' sx={{ mb: 2 }}>Добавить нового клиента</Typography>
        <Grid container direction="column" spacing={2}>
          <Grid>
            <TextField
              id="name"
              name="name"
              label="ФИО / Название комании *"
              value={form.name}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="phone_number"
              name="phone_number"
              label="Номер телефона *"
              value={form.phone_number}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('phone_number'))}
              helperText={getFieldError('phone_number')}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="email"
              name="email"
              label="Эл. почта *"
              value={form.email}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('email'))}
              helperText={getFieldError('email')}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="inn"
              name="inn"
              label="ИНН *"
              value={form.inn}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('inn'))}
              helperText={getFieldError('inn')}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="address"
              name="address"
              label="Адрес"
              value={form.address}
              onChange={inputChangeHandler}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="banking_data"
              name="banking_data"
              label="Банковские реквизиты"
              value={form.banking_data}
              onChange={inputChangeHandler}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <TextField
              id="ogrn"
              name="ogrn"
              label="ОГРН"
              value={form.ogrn}
              onChange={inputChangeHandler}
              fullWidth
              size='small'
            />
          </Grid>

          <Grid>
            <Button type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24}/> : 'Создать клиента'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ClientForm
