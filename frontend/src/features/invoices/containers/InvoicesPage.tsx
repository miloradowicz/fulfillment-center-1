import Modal from '@/components/Modal/Modal.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Receipt, Loader2 } from 'lucide-react'
import InvoicesDataList from '@/features/invoices/components/InvoicesDataList.tsx'
import { useInvoicesPage } from '@/features/invoices/hooks/useInvoicesPage.ts'

const InvoicesPage = () => {

  const { open, handleOpen, handleClose, loading } = useInvoicesPage()

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center my-10">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <Modal handleClose={handleClose} open={open}>Форма создания</Modal>
      <div className="max-w-[1000px] mx-auto mb-5 mt-2 w-full flex items-center justify-between gap-4">
        <CustomTitle text={'Счета'} icon={<Receipt size={25} />}/>
        <CustomButton text={'Добавить счет'} onClick={handleOpen}/>
      </div>
      <div className="px-4">
        <InvoicesDataList onEdit={()=>console.log('Редактирование')}/>
      </div>
    </>
  )
}

export default InvoicesPage
