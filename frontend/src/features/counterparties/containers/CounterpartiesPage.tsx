import Modal from '@/components/Modal/Modal.tsx'
import { useCounterpartyPage } from '../hooks/useCounterpartyPage.ts'
import CounterpartiesDataList from '../components/CounterpartiesDataList.tsx'
import CounterpartyForm from '../components/CounterpartyForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { BookUser } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { withRequestHandler } from '@/utils/withRequestHandler.tsx'

const CounterpartiesPage = () => {
  const { open, handleOpen, handleClose, isLoading } = useCounterpartyPage()

  return (
    <>
      {isLoading && <Loader />}

      <Modal handleClose={handleClose} open={open}>
        <CounterpartyForm onClose={handleClose} />
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full flex items-center justify-between">
        <CustomTitle text={'Контрагенты'} icon={<BookUser size={25} />} />
        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <CustomButton text={'Добавить контрагента'} onClick={handleOpen} />
        </ProtectedElement>
      </div>

      <div className="my-8">
        <CounterpartiesDataList />
      </div>
    </>
  )
}

const CounterpartiesPageWithRequestHandler = withRequestHandler(CounterpartiesPage)

export default CounterpartiesPageWithRequestHandler
