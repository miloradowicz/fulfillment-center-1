import { Box, CircularProgress } from '@mui/material'
import Modal from '@/components/Modal/Modal.tsx'
import ServiceForm from '../components/ServiceForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Handshake } from 'lucide-react'
import { useServiceActions } from '@/features/services/hooks/useServicesActions.ts'
import ServicesDataList from '@/features/services/components/ServicesDataList.tsx'

const ServicesPage = () => {

  const { open, handleOpen, handleClose, loading } = useServiceActions(true)

  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      )}

      <Modal handleClose={handleClose} open={open}><ServiceForm onClose={handleClose}/></Modal>
      <Box  display={'flex'} className="max-w-[1000px] mx-auto mb-5 mt-2 w-full flex items-center justify-end">
        <CustomTitle text={'Услуги'} icon={<Handshake size={25} />}/>
        <CustomButton text={'Добавить услугу'} onClick={handleOpen}/>
      </Box>
      <Box className="my-8">
        <ServicesDataList />
      </Box>
    </>
  )
}

export default ServicesPage
