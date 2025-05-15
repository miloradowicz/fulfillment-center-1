import ProductsDataList from '../components/ProductsDataList.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import ProductForm from '../components/ProductForm.tsx'
import useProductActions from '../hooks/useProductActions.ts'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Package } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { withRequestHandler } from '@/utils/withRequestHandler.tsx'

const ProductPage = () => {
  const { open, handleOpen, handleClose, fetchAllProducts, loading } = useProductActions(true)

  return (
    <>
      {loading && <Loader />}

      <Modal handleClose={handleClose} open={open}>
        <ProductForm onSuccess={fetchAllProducts} />
      </Modal>

      <div className="max-w-[1000px] mx-auto my-7 w-full flex items-center justify-between">
        <CustomTitle text={'Товары'} icon={<Package size={25} />} />
        <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
          <CustomButton text={'Добавить товар'} onClick={handleOpen} />
        </ProtectedElement>
      </div>

      <div className="my-8">
        <ProductsDataList />
      </div>
    </>
  )
}

const ProductPageWithRequestHandler = withRequestHandler(ProductPage)

export default ProductPageWithRequestHandler
