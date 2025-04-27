import Modal from '@/components/Modal/Modal.tsx'
import { Box, CircularProgress } from '@mui/material'
import ClientsDataList from '../components/ClientsDataList.tsx'
import ClientForm from '../components/ClientForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { useClientActions } from '../hooks/useClientActions.ts'
import { Users } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

const ClientsPage = () => {
  const { open, handleOpen, handleClose, loading } = useClientActions(true)

  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      )}

      <Modal handleClose={handleClose} open={open}>
        <ClientForm onClose={handleClose} />
      </Modal>
      <Box className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Клиенты'} icon={<Users size={25} />}/>
        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <CustomButton text={'Добавить клиента'} onClick={handleOpen} />
        </ProtectedElement>
      </Box>
      <Box className="my-8">
        <ClientsDataList />
      </Box>
    </>
  )
}

export default ClientsPage
