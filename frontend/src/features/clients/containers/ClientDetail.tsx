import { Box, Card, CircularProgress, Divider, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  AccountBalanceOutlined,
  ArrowBack,
  EmailOutlined,
  LocationOnOutlined,
  PhoneAndroidOutlined,
} from '@mui/icons-material'
import ClientInfoItem from '../components/ClientInfoItem.tsx'
import ClientForm from '../components/ClientForm.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ConfirmationModal from '../../../components/UI/Modal/ConfirmationModal.tsx'
import { useClientActions } from '../hooks/useClientActions.ts'
import EditButton from '../../../components/UI/EditButton/EditButton.tsx'
import ArchiveButton from '../../../components/UI/ArchiveButton/ArchiveButton.tsx'

const ClientDetail = () => {
  const {
    error,
    navigate,
    loading,
    client,
    open,
    handleOpen,
    handleClose,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationArchive,
  } = useClientActions(false)

  return (
    <>
      {error ? (
        <Box textAlign="center" mt={4}>
          <Typography color="error" variant="body1">
            Ошибка загрузки данных клиента
          </Typography>
        </Box>
      ) : !client ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" textAlign="center">
            Клиент не найден
          </Typography>
        </Box>
      ) : (
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

              <Grid container spacing={2}>
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
              <EditButton onClick={() => handleOpen()} />
              <ArchiveButton onClick={() => handleConfirmationOpen(client._id)} />
            </Box>
          </Card>

          <Modal open={open} handleClose={handleClose}>
            <ClientForm client={client} onClose={handleClose} />
          </Modal>

          <ConfirmationModal
            open={confirmationOpen}
            entityName="этого клиента"
            actionType={'archive'}
            onConfirm={handleConfirmationArchive}
            onCancel={handleConfirmationClose}
          />
        </Box>
      )}
    </>
  )
}

export default ClientDetail
