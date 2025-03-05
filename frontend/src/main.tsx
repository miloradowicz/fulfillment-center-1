import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { addCsrf } from './utils/axiosAPI.ts'

addCsrf()

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <CssBaseline />
    <ToastContainer position={'top-center'} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
)
