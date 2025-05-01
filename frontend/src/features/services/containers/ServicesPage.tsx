import Modal from '@/components/Modal/Modal.tsx'
import ServiceForm from '../components/ServiceForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Handshake } from 'lucide-react'
import { useServiceActions } from '@/features/services/hooks/useServicesActions.ts'
import ServicesDataList from '@/features/services/components/ServicesDataList.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

const ServicesPage = () => {

  const { open, handleOpen, handleClose, loading } = useServiceActions(true)

  return (
    <>
      {loading ? <Loader/> : null}

      <Modal handleClose={handleClose} open={open}><ServiceForm onClose={handleClose}/></Modal>
      <div className="max-w-[1000px] mx-auto mb-5 mt-2 w-full flex items-center justify-between gap-4">
        <CustomTitle text={'Услуги'} icon={<Handshake size={25} />}/>
        <ProtectedElement allowedRoles={['super-admin', 'admin']} >
          <CustomButton text={'Добавить услугу'} onClick={handleOpen}/>
        </ProtectedElement>
      </div>
      <div className="px-4">
        <ServicesDataList />
      </div>
    </>
  )
}

export default ServicesPage
