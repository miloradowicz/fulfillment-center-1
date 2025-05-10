import Modal from '@/components/Modal/Modal.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Receipt } from 'lucide-react'
import InvoicesDataList from '@/features/invoices/components/InvoicesDataList.tsx'
import { useInvoicesPage } from '@/features/invoices/hooks/useInvoicesPage.ts'
import Loader from '@/components/Loader/Loader.tsx'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import InvoiceForm from '../components/InvoiceForm'

const InvoicesPage = () => {
  const { open, handleOpenCreate, handleClose, loading, handleOpenEdit, invoiceToEdit } = useInvoicesPage()

  return (
    <>
      {loading && <Loader />}

      <Modal open={open} handleClose={handleClose}>
        <InvoiceForm initialData={invoiceToEdit} onSuccess={handleClose} />
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full flex items-center justify-between gap-4">
        <CustomTitle text={'Счета'} icon={<Receipt size={25} />} />

        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <CustomButton text={'Добавить счет'} onClick={handleOpenCreate} />
        </ProtectedElement>
      </div>

      <div className="my-8">
        <InvoicesDataList onEdit={handleOpenEdit} />
      </div>
    </>
  )
}

export default InvoicesPage
