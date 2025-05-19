import { useStockPage } from '../hooks/useStockPage.ts'
import StockCard from '../components/StockCard.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import StockForm from '../components/StockForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Warehouse } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'

const StockPage = () => {
  const { open, handleOpen, isLoading, handleClose, stocks } = useStockPage()

  return (
    <>
      {isLoading && <Loader />}

      <Modal handleClose={handleClose} open={open} aria-modal="true">
        <StockForm onSuccess={handleClose} />
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full flex items-center justify-between">
        <CustomTitle text={'Склады'} icon={<Warehouse size={25} />}/>

        <ProtectedElement allowedRoles={['super-admin', 'admin']}>
          <CustomButton text={'Добавить склад'} onClick={handleOpen}/>
        </ProtectedElement>
      </div>

      <div className="max-w-[700px] mx-auto flex flex-col space-y-5">
        {stocks &&
          stocks.map(stock => (
            <StockCard key={stock._id} stock={stock} />
          ))}
      </div>
    </>
  )
}

export default StockPage
