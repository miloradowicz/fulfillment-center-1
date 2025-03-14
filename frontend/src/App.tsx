import { Route, Routes } from 'react-router-dom'
import ClientForm from './features/clients/components/ClientForm.tsx'
import { createTheme, ThemeProvider, Typography } from '@mui/material'
import Layout from './Layout/Layout.tsx'
import LoginPage from './features/users/containers/LoginPage.tsx'
import ArrivalPage from './features/arrivals/containers/ArrivalPage.tsx'
import ProductPage from './features/products/containers/ProductPage.tsx'
import ClientPage from './features/clients/containers/ClientPage.tsx'
import ReportPage from './features/reports/containers/ReportPage.tsx'
import OrderDetails from './features/orders/containers/OrderDetails.tsx'
import OrderPage from './features/orders/containers/OrderPage.tsx'
import RegistrationForm from './features/users/components/RegistrationForm.tsx'
import ClientDetail from './features/clients/containers/ClientDetail.tsx'
import TaskBoard from './features/tasks/components/TaskBoard.tsx'

const App = () => {
  const theme = createTheme()
  return (
    <>
      <ThemeProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/clients" element={<ClientPage />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            <Route path="/arrivals" element={<ArrivalPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/add-new-client" element={<ClientForm />} />
            <Route path="/add-new-user" element={<RegistrationForm />} />
            <Route
              path="/*"
              element={
                <Typography variant={'h3'} textAlign="center">
                  Not Found
                </Typography>
              }
            />
          </Routes>
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default App
