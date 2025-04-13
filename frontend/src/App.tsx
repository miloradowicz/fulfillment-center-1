import { Route, Routes } from 'react-router-dom'
import ClientForm from './features/clients/components/ClientForm.tsx'
import { createTheme, ThemeProvider, Typography } from '@mui/material'
import Layout from '@/layout/Layout.tsx'
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
import StockPage from './features/stocks/containers/StockPage.tsx'
import StockDetails from './features/stocks/containers/StockDetails.tsx'
import CounterpartiesPage from './features/counterparties/containers/CounterpartiesPage.tsx'
import { useAppSelector } from './app/hooks.ts'
import { selectUser } from './store/slices/authSlice.ts'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute.tsx'
import { TooltipProvider } from '@/components/ui/tooltip'
import ArchivePage from './features/archive/containers/ArchivePage.tsx'

const App = () => {
  const user = useAppSelector(selectUser)

  const theme = createTheme({
    typography: {
      fontFamily: '\'Inter\', sans-serif',
    },
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute isAllowed={!!user}>
                    <ClientPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/clients" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ClientPage />
                </ProtectedRoute>
              } />
              <Route path="/clients/:id" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ClientDetail />
                </ProtectedRoute>
              } />
              <Route path="/arrivals" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ArrivalPage />
                </ProtectedRoute>
              } />
              <Route path="/arrivals/:arrivalId" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ArrivalDetails />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ProductPage />
                </ProtectedRoute>
              } />
              <Route path="/products/:id" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ProductDetails />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute isAllowed={!!user}>
                  <OrderPage />
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute isAllowed={!!user}>
                  <OrderDetails />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ReportPage />
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute isAllowed={!!user}>
                  <TaskBoard />
                </ProtectedRoute>
              } />
              <Route path="/tasks/:id" element={
                <ProtectedRoute isAllowed={!!user}>
                  <TaskBoard />
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ServicesPage />
                </ProtectedRoute>
              } />
              <Route path="/add-new-client" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ClientForm />
                </ProtectedRoute>
              } />
              <Route path="/counterparties" element={
                <ProtectedRoute isAllowed={!!user}>
                  <CounterpartiesPage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={
                <ProtectedRoute isAllowed={!!user}>
                  <RegistrationPage />
                </ProtectedRoute>
              } />
              <Route path="/stocks" element={
                <ProtectedRoute isAllowed={!!user}>
                  <StockPage />
                </ProtectedRoute>
              } />
              <Route path="/stocks/:stockId" element={
                <ProtectedRoute isAllowed={!!user}>
                  <StockDetails />
                </ProtectedRoute>
              } />
              <Route path="/archives" element={
                <ProtectedRoute isAllowed={!!user}>
                  <ArchivePage />
                </ProtectedRoute>
              } />
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
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}

export default App
