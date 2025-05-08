import OrdersList from '../components/OrdersList.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import useOrderPage from '../hooks/useOrderPage.ts'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { ClipboardList } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import InvoiceForm from '@/features/invoices/components/InvoiceForm'

const OrderPage = () => {
  const {
    orders,
    open,
    formType,
    handleOpen,
    handleClose,
    handleArchive,
    loading,
    handleOpenEdit,
    orderToEdit,
  } = useOrderPage()

  return (
    <>
      {loading && <Loader/>}

      <Modal handleClose={handleClose} open={open}>
        {formType === 'order' ? (
          <OrderForm initialData={orderToEdit} onSuccess={handleClose}/>
        ) : (
          <InvoiceForm onSuccess={handleClose}
          />
        )}
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full flex items-center justify-between gap-4">
        <CustomTitle text={'Заказы'} icon={<ClipboardList size={25} />} />

        <div className="flex gap-2">
          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text={'Выставить счет'} onClick={() => handleOpen('invoice')}/>
          </ProtectedElement>

          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text={'Добавить заказ'} onClick={() => handleOpen('order')}/>
          </ProtectedElement>
        </div>
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
