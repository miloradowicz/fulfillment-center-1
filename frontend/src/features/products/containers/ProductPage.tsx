import { Box, Button, Typography } from '@mui/material'
import ProductsDataList from '../components/ProductsDataList.tsx'
import { useState } from 'react'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ProductForm from '../components/ProductForm.tsx'


const ProductPage = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <Modal handleClose={handleClose} open={open}><ProductForm/></Modal>
      <Box display={'flex'}  className="text-center mb-5 mt-7 text-[20px] flex items-center justify-center">
        <Typography className="flex-grow text-[20px]">Товары</Typography>
        <Button
          className="text-[#32363F] border-[#32363F] bg-[#f8f9fa] ml-auto hover:bg-[#f1f3f5] hover:border-[#5a6268]"
          variant="outlined" onClick={handleOpen} >Добавить товар</Button>
      </Box>
      <Box><ProductsDataList/></Box>
    </>
  )
}

export default ProductPage
