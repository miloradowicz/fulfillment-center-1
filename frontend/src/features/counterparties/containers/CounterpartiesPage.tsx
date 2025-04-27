import Modal from '@/components/Modal/Modal.tsx'
import { Box, CircularProgress } from '@mui/material'
import { useCounterpartyPage } from '../hooks/useCounterpartyPage.ts'
import CounterpartiesDataList from '../components/CounterpartiesDataList.tsx'
import CounterpartyForm from '../components/CounterpartyForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { BookUser } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

const CounterpartiesPage = () => {
  const { open, handleOpen, handleClose, isLoading } = useCounterpartyPage()

  return (
    <>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      )}

      <Modal handleClose={handleClose} open={open}>
        <CounterpartyForm onClose={handleClose} />
      </Modal>
      <Box className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Контрагенты'} icon={<BookUser size={25} />}/>
        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <CustomButton text={'Добавить контрагента'} onClick={handleOpen}/>
        </ProtectedElement>
      </Box>
      <Box className="my-8">
        <CounterpartiesDataList />
      </Box>
    </>
  )
}

export default CounterpartiesPage
