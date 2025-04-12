import { Box, CircularProgress } from '@mui/material'
import ProductsDataList from '../components/ProductsDataList.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import ProductForm from '../components/ProductForm.tsx'
import useProductActions from '../hooks/useProductActions.ts'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'

const ProductPage = () => {
  const { open, handleOpen, handleClose, fetchAllProducts, loading } = useProductActions(true)

  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      )}

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
