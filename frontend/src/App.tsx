import { Route, Routes } from 'react-router-dom'
import ClientForm from './features/clients/components/ClientForm.tsx'
import { Container, Typography } from '@mui/material'
import ProductForm from './features/products/components/ProductForm.tsx'


const App = () => {
  return <>
    <Container>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/add-new-client' element={<ClientForm />} />
        <Route path='/add-new-product' element={<ProductForm />} />
        <Route path="/*" element={<Typography variant={'h3'} textAlign="center">Not Found</Typography>}/>
      </Routes>
    </Container>
  </>
}

export default App
