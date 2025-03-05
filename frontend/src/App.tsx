import { Route, Routes } from 'react-router-dom'
import ClientForm from './features/clients/components/ClientForm.tsx'
import { Container, Typography } from '@mui/material'
import ArrivalForm from './features/arrivals/components/ArrivalForm.tsx'
import ProductForm from './features/products/components/ProductForm.tsx'
import OrderForm from './features/clients/components/OrderForm.tsx'


const App = () => {
  return <>
    <Container>
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/add-new-client' element={<ClientForm />} />
        <Route path='/add-new-product' element={<ProductForm />} />
        <Route path='/add-new-order' element={<OrderForm />} />
        <Route path='/add-new-arrival' element={<ArrivalForm/>}/>
        <Route path="/*" element={<Typography variant={'h3'} textAlign="center">Not Found</Typography>}/>
      </Routes>
    </Container>
  </>
}

export default App
