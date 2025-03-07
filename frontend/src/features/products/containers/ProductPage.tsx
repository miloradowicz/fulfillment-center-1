import {Box, Button, Typography} from '@mui/material'
import { NavLink } from 'react-router-dom'
import ProductsDataList from '../components/ProductsDataList.tsx'


const ProductPage = () => {
  return (
    <>
      <Box display={'flex'}  style={{ textAlign:'center',marginBottom:'20px', marginTop:'30px', fontSize:'20px', alignItems: 'center', justifyContent:'center' }}>
        <Typography style={{ flexGrow:'1', fontSize:'20px' }}>Товары</Typography>
        <Button
          sx={{
            color: '#32363F',
            borderColor: '#32363F',
            backgroundColor: 'white',
            marginLeft:'auto',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#5a6268',
            },
          }}
          variant="outlined"  component={NavLink} to={'/add-new-product'}>Добавить товар</Button>
      </Box>
      <Box><ProductsDataList/></Box>
    </>
  )
}

export default ProductPage
