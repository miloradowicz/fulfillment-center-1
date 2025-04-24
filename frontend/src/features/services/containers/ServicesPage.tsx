import Modal from '@/components/Modal/Modal.tsx'
import ServiceForm from '../components/ServiceForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Handshake, Loader2 } from 'lucide-react'
import { useServiceActions } from '@/features/services/hooks/useServicesActions.ts'
import ServicesDataList from '@/features/services/components/ServicesDataList.tsx'

const ServicesPage = () => {

  const { open, handleOpen, handleClose, loading } = useServiceActions(true)

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center my-10">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
        </div>
      )}

      <Modal handleClose={handleClose} open={open}><ServiceForm onClose={handleClose}/></Modal>
      <div className="max-w-[1000px] mx-auto mb-5 mt-2 w-full flex items-center justify-between gap-4">
        <CustomTitle text={'Услуги'} icon={<Handshake size={25} />}/>
        <CustomButton text={'Добавить услугу'} onClick={handleOpen}/>
      </div>
      <div className="px-4">
        <ServicesDataList />
      </div>
    </>
  )
}

export default ServicesPage
