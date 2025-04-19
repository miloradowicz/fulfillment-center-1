import { Box, CircularProgress } from '@mui/material'
import UsersDataList from '../components/UsersDataList.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import RegistrationForm from '../../users/components/RegistrationForm.tsx'
import useUserActions from '../hooks/useUserActions.ts'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Users } from 'lucide-react'

const UserPage = () => {
  const {
    open,
    handleOpen,
    handleClose,
    fetchAllUsers,
    loading,
  } = useUserActions(true)

  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      )}

      <Modal handleClose={handleClose} open={open}>
        <RegistrationForm
          onSuccess={() => {
            void fetchAllUsers()
            handleClose()
          }}
        />
      </Modal>

      <Box className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Сотрудники'} icon={<Users size={25} />} />
        <CustomButton text={'Добавить сотрудника'} onClick={handleOpen} />
      </Box>

      <Box>
        <UsersDataList />
      </Box>
    </>
  )
}

export default UserPage
