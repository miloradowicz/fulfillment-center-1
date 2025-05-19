import Modal from '@/components/Modal/Modal.tsx'
import ClientsDataList from '../components/ClientsDataList.tsx'
import ClientForm from '../components/ClientForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { useClientActions } from '../hooks/useClientActions.ts'
import { Users } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'

const ClientsPage = () => {
  const { open, handleOpen, handleClose, loading } = useClientActions(true)

  return (
    <>
      {loading && <Loader />}

      <Modal handleClose={handleClose} open={open}>
        <ClientForm onClose={handleClose} />
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full flex items-center justify-between">
        <CustomTitle text={'Клиенты'} icon={<Users size={25} />} />

        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <CustomButton text={'Добавить клиента'} onClick={handleOpen} />
        </ProtectedElement>
      </div>

      <div className="my-8">
        <ClientsDataList />
      </div>
    </>
  )
}

export default ClientsPage
