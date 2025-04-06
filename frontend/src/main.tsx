import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store.ts'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { addAuthorization, addCsrf } from './utils/axiosAPI.ts'
import './index.css'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { PersistGate } from 'redux-persist/integration/react'

addCsrf()
addAuthorization(store)
dayjs.extend(localizedFormat)
dayjs.locale('ru')

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CssBaseline />
      <ToastContainer position={'top-center'} />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
)
