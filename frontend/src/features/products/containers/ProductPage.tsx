import { Box } from '@mui/material'
import ProductsDataList from '../components/ProductsDataList.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ProductForm from '../components/ProductForm.tsx'
import useProductActions from '../hooks/useProductActions.ts'
import CustomButton from '../../../components/UI/CustomButton/CustomButton.tsx'
import CustomTitle from '../../../components/UI/CustomTitle/CustomTitle.tsx'

const ProductPage = () => {
  const { open, handleOpen, handleClose, fetchAllProducts } = useProductActions(true)

  return (
    <>
      <Modal handleClose={handleClose} open={open}>
        <ProductForm
          onSuccess={fetchAllProducts}
        />
      </Modal>
      <Box className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Товары'}/>
        <CustomButton text={'Добавить товар'} onClick={handleOpen}/>
      </Box>
      <Box><ProductsDataList/></Box>
    </>
  )
}

export default ProductPage
