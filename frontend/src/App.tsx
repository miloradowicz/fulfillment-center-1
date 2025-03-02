import { Route, Routes } from 'react-router-dom'
import ClientForm from './features/clients/components/ClientForm.tsx'
import { Container } from '@mui/material'


const App = () => {
  return <>
    <Container>
      <Routes>
        <Route path='add-new-client' element={<ClientForm />} />
      </Routes>
    </Container>
  </>
}

export default App
