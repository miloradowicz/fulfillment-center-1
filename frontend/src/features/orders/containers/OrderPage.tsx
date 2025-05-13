import OrdersDataList from '../components/OrdersDataList.tsx'
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
    handleCancelOrder,
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

      <div className="max-w-[1000px] mx-auto my-7 w-full gap-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center">
        <CustomTitle text={'Заказы'} icon={<ClipboardList size={25}/>}/>

        <div className="flex flex-col sm:flex-row sm:gap-2 space-y-2 sm:space-y-0 sm:w-auto w-full">
          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text={'Выставить счет'} onClick={() => handleOpen('invoice')}/>
          </ProtectedElement>

          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text={'Добавить заказ'} onClick={() => handleOpen('order')}/>
          </ProtectedElement>
        </div>
      </div>

      <div className="my-8">
        <OrdersDataList
          onEdit={handleOpenEdit}
          orders={orders || []}
          handleDelete={handleArchive}
          handleCancelOrder={handleCancelOrder}
        />
      </div>
    </>
  )
}

export default OrderPage
