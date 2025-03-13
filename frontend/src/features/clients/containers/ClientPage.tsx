import Modal from '../../../components/UI/Modal/Modal.tsx'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useClientPage } from '../hooks/useClientPage.ts'
import ClientsDataList from '../components/ClientsDataList.tsx'
import ClientForm from '../components/ClientForm.tsx'

const ClientsPage = () => {
  const { open, handleOpen, handleClose, isLoading } = useClientPage()

  return (
    <>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      )}

      <Modal handleClose={handleClose} open={open}>
        <ClientForm />
      </Modal>
      <Box
        display={'flex'}
        className="text-center mb-5 mt-7 text-[20px] flex items-center justify-between"
      >
        <Typography className="flex-grow" variant="h5">Клиенты</Typography>
        <Button
          sx={{
            'color': '#32363F',
            'marginLeft': 'auto',
            'border': '1px solid #32363F',
            'transition': 'all 0.3s ease-in-out',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: '#32363F',
              border: '1px solid #ffffff',
            },
          }}
          variant="outlined"
          onClick={handleOpen}
        >
          Добавить клиента
        </Button>
      </Box>
      <Box className="my-8">
        <ClientsDataList />
      </Box>
    </>
  )
}

export default ClientsPage
