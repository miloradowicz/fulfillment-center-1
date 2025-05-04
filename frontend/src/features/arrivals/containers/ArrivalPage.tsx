import Modal from '@/components/Modal/Modal.tsx'
import { useArrivalPage } from '../hooks/useArrivalPage.ts'
import ArrivalsDataList from '../components/ArrivalsDataList.tsx'
import ArrivalForm from '../components/ArrivalForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Truck } from 'lucide-react'
import ProductForm from '@/features/products/components/ProductForm.tsx'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'

const ArrivalPage = () => {
  const { open, formType, handleOpen, handleClose, isLoading, arrivalToEdit, handleOpenEdit } = useArrivalPage()

  return (
    <>
      {isLoading && <Loader />}

      <Modal handleClose={handleClose} open={open} aria-modal="true">
        {formType === 'arrival' ? (
          <ArrivalForm initialData={arrivalToEdit} onSuccess={handleClose} />
        ) : (
          <ProductForm onSuccess={handleClose} />
        )}
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full gap-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center">
        <CustomTitle text="Поставки" icon={<Truck className="h-[25px] w-[25px]" />} />

        <div className="flex flex-col sm:flex-row sm:gap-2 space-y-2 sm:w-auto w-full">
          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text="Добавить товар" onClick={() => handleOpen('product')} />
          </ProtectedElement>

          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text="Добавить поставку" onClick={() => handleOpen('arrival')} />
          </ProtectedElement>
        </div>
      </div>

      <div className="my-8">
        <ArrivalsDataList onEdit={handleOpenEdit} />
      </div>
    </>
  )
}

export default ArrivalPage
