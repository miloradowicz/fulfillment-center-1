import OrdersList from '../components/OrdersList.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import useOrderPage from '../hooks/useOrderPage.ts'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { ClipboardList } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'

const OrderPage = () => {
  const { orders, open, handleOpen, handleClose, handleArchive, loading, handleOpenEdit } = useOrderPage()

  return (
    <>
      {loading && <Loader />}

      <Modal handleClose={handleClose} open={open}>
        <OrderForm onSuccess={handleClose} />
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full flex items-center justify-between">
        <CustomTitle text={'Заказы'} icon={<ClipboardList size={25} />} />

        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <CustomButton text={'Добавить заказ'} onClick={handleOpen} />
        </ProtectedElement>
      </div>

      <div className="my-8">
        <OrdersList
          onEdit={handleOpenEdit}
          orders={orders || []}
          handleDelete={handleArchive}
        />
      </div>
    </>
  )
}

export default OrderPage
