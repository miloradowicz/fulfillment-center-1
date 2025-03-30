import Modal from '../../../components/UI/Modal/Modal.tsx'
import { Box, CircularProgress } from '@mui/material'
import { useClientPage } from '../hooks/useClientPage.ts'
import ClientsDataList from '../components/ClientsDataList.tsx'
import ClientForm from '../components/ClientForm.tsx'
import CustomButton from '../../../components/UI/CustomButton/CustomButton.tsx'
import CustomTitle from '../../../components/UI/CustomTitle/CustomTitle.tsx'

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
        <ClientForm onClose={handleClose} />
      </Modal>
      <Box className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Клиенты'}/>
        <CustomButton text={'Добавить клиента'} onClick={handleOpen}/>
      </Box>
      <Box className="my-8">
        <ClientsDataList />
      </Box>
    </>
  )
}

export default ClientsPage
