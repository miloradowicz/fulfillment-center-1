import { Route, Routes } from 'react-router-dom'
import ClientForm from './features/clients/components/ClientForm.tsx'
import { Container } from '@mui/material'
import ArrivalForm from './features/arrivals/components/ArrivalForm.tsx'

const App = () => {
  return <>
    <Container>
      <Routes>
        <Route path='add-new-arrival' element={<ArrivalForm/>}/>
        <Route path='add-new-client' element={<ClientForm />} />
      </Routes>
    </Container>
  </>
}

export default App
