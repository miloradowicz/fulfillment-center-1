import { ContactRound } from 'lucide-react'
import UsersDataList from '../components/UsersDataList.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import RegistrationForm from '../../users/components/RegistrationForm.tsx'
import useUserActions from '../hooks/useUserActions.ts'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

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
      {loading ? <Loader/> :  null}

      <Modal handleClose={handleClose} open={open}>
        <RegistrationForm
          onSuccess={() => {
            void fetchAllUsers()
            handleClose()
          }}
        />
      </Modal>

      <div className="max-w-[1000px] mx-auto mb-5 mt-2 w-full flex items-center justify-between gap-4">
        <CustomTitle text="Сотрудники" icon={<ContactRound size={25} />} />
        <ProtectedElement allowedRoles={['super-admin', 'admin']}>
          <CustomButton text="Добавить сотрудника" onClick={handleOpen} />
        </ProtectedElement>
      </div>

      <div className="px-4">
        <UsersDataList />
      </div>
    </>
  )
}

export default UserPage
