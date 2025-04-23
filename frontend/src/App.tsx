import { Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider, Typography } from '@mui/material'
import { useAppSelector } from './app/hooks.ts'
import { selectUser } from './store/slices/authSlice.ts'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/layout/Layout.tsx'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute.tsx'
import LoginPage from './features/users/containers/LoginPage.tsx'
import ClientForm from './features/clients/components/ClientForm.tsx'
import ClientPage from './features/clients/containers/ClientPage.tsx'
import ClientDetail from './features/clients/containers/ClientDetail.tsx'
import ArrivalPage from './features/arrivals/containers/ArrivalPage.tsx'
import ArrivalDetails from './features/arrivals/containers/ArrivalDetails.tsx'
import ProductPage from './features/products/containers/ProductPage.tsx'
import ProductDetails from './features/products/containers/ProductDetails.tsx'
import OrderPage from './features/orders/containers/OrderPage.tsx'
import OrderDetails from './features/orders/containers/OrderDetails.tsx'
import ReportPage from './features/reports/containers/ReportPage.tsx'
import TaskBoard from './features/tasks/components/TaskBoard.tsx'
import StockPage from './features/stocks/containers/StockPage.tsx'
import StockDetails from './features/stocks/containers/StockDetails.tsx'
import CounterpartiesPage from './features/counterparties/containers/CounterpartiesPage.tsx'
import ArchivePage from './features/archive/containers/ArchivePage.tsx'
import AdminPage from '@/features/admin/containers/AdminPage.tsx'

const App = () => {
  const user = useAppSelector(selectUser)

  const theme = createTheme({
    typography: {
      fontFamily: '\'Inter\', sans-serif',
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <TooltipProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute isAllowed={!!user}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<ClientPage />} />
            <Route path="/clients" element={<ClientPage />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/arrivals" element={<ArrivalPage />} />
            <Route path="/arrivals/:arrivalId" element={<ArrivalDetails />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/tasks/:id" element={<TaskBoard />} />
            <Route path="/add-new-client" element={<ClientForm />} />
            <Route path="/counterparties" element={<CounterpartiesPage />} />
            <Route path="/stocks" element={<StockPage />} />
            <Route path="/stocks/:stockId" element={<StockDetails />} />
            <Route path="/archives" element={<ArchivePage />} />
            <Route path="/admin" element={<AdminPage />} />

            <Route
              path="*"
              element={
                <Typography variant="h3" textAlign="center">
                  Not Found
                </Typography>
              }
            />
          </Route>
        </Routes>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
