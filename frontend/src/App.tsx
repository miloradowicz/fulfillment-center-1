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
import ClientDetail from './features/clients/containers/ClientDetail.tsx'
import TaskBoard from './features/tasks/components/TaskBoard.tsx'
import ProductDetails from './features/products/containers/ProductDetails.tsx'
import ArrivalDetails from './features/arrivals/containers/ArrivalDetails.tsx'
import ServicesPage from './features/services/containers/ServicesPage.tsx'
import RegistrationPage from './features/users/containers/RegistrationPage.tsx'

const App = () => {
  const theme = createTheme()
  return (
    <>
      <ThemeProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/" element={<ClientPage />} />
            <Route path="/clients" element={<ClientPage />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            <Route path="/arrivals" element={<ArrivalPage />} />
            <Route path="/arrivals/:arrivalId" element={<ArrivalDetails />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/add-new-client" element={<ClientForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
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
