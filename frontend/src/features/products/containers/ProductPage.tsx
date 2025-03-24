import { Box, Button, Typography } from '@mui/material'
import ProductsDataList from '../components/ProductsDataList.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ProductForm from '../components/ProductForm.tsx'
import useProductActions from '../hooks/useProductActions.ts'

const ProductPage = () => {
  const { open, handleOpen, handleClose, fetchAllProducts } = useProductActions(true)

  return (
    <>
      <Modal handleClose={handleClose} open={open}>
        <ProductForm
          onSuccess={fetchAllProducts}
        />
      </Modal>
      <Box display={'flex'}  className="text-center mb-5 mt-7 text-[20px] flex items-center justify-center">
        <Typography className="flex-grow text-[20px]">Товары</Typography>
        <Button
          sx={{
            color: '#32363F',
            marginLeft: 'auto',
            border: '1px solid #32363F',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: '#32363F',
              border: '1px solid #ffffff',
            },
          }}
          variant="outlined"
          onClick={() => handleOpen()} >Добавить товар</Button>
      </Box>
      <Box><ProductsDataList/></Box>
    </>
  )
}

export default ProductPage
