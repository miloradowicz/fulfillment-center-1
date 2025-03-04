import { Route, Routes } from 'react-router-dom'
import ClientForm from './features/clients/components/ClientForm.tsx'
import { Container } from '@mui/material'
import OrderForm from './features/clients/components/OrderForm.tsx'



const App = () => {
  return <>
    <Container>
      <Routes>
        <Route path='add-new-client' element={<ClientForm />} />
        <Route path='add-new-order' element={<OrderForm />} />
      </Routes>
    </Container>
  </>
}

export default App
