import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Button,
  Card, CircularProgress,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  ArrowBack,
  EmailOutlined,
  PhoneAndroidOutlined,
  LocationOnOutlined,
  AccountBalanceOutlined, DeleteOutline,
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectClient, selectClientError, selectLoadingFetchClient } from '../../../store/slices/clientSlice.ts'
import { fetchClientById } from '../../../store/thunks/clientThunk.ts'
import ClientInfoItem from '../components/ClientInfoItem.tsx'
import { useClientsList } from '../hooks/useClientsList.ts'
import { toast } from 'react-toastify'

const ClientDetail = () => {

  const { clientId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { deleteOneClient } = useClientsList()

  const client = useAppSelector(selectClient)
  const loading = useAppSelector(selectLoadingFetchClient)
  const error = useAppSelector(selectClientError)

  useEffect(() => {
    if (clientId) {
      dispatch(fetchClientById(clientId))
    }
  }, [dispatch, clientId])

  return (
    <>
      {error ? (
        <>
          <Box textAlign="center" mt={4}>
            <Typography color="error" variant="body1" textAlign="center">
                  Ошибка загрузки данных клиента
            </Typography>
          </Box>
        </>
      ) : <>
        <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 1, md: 3 } }}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate('/clients')}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" fontWeight={700}>
                Профиль клиента
            </Typography>
          </Box>

          <Card sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
          }}>
            <Box sx={{ mb: 3 }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  {client?.name}
                </Typography>
              )}

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid>
                    <ClientInfoItem
                      loading={loading}
                      label="ИНН"
                      value={client?.inn || '—'}
                    />
                  </Grid>
                  <Grid>
                    <ClientInfoItem
                      loading={loading}
                      label="ОГРН"
                      value={client?.ogrn || '—'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={12}>
              <Grid>
                <ClientInfoItem
                  loading={loading}
                  icon={<PhoneAndroidOutlined />}
                  label="Телефон"
                  value={client?.phone_number}
                />
                <ClientInfoItem
                  loading={loading}
                  icon={<EmailOutlined />}
                  label="Email"
                  value={client?.email}
                />
              </Grid>

              <Grid>
                <ClientInfoItem
                  loading={loading}
                  icon={<LocationOnOutlined />}
                  label="Адрес"
                  value={client?.address}
                />
                <ClientInfoItem
                  loading={loading}
                  icon={<AccountBalanceOutlined />}
                  label="Банковские реквизиты"
                  value={client?.banking_data || '—'}
                />
              </Grid>
            </Grid>
            <Box sx={{
              mt: 4,
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
            }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteOutline />}
                sx={{
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
                onClick={async () => {
                  if (clientId) {
                    try {
                      await deleteOneClient(clientId)
                      toast.success('Клиент успешно удалён!')
                      navigate('/clients')
                    } catch {
                      toast.error('Ошибка при удалении клиента. Пожалуйста, попробуйте позже.')
                    }
                  }
                }}
              >
                Удалить
              </Button>
            </Box>
          </Card>
        </Box>
      </>}
    </>
  )
}

export default ClientDetail
