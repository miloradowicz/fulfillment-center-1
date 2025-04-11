import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { addCsrf, checkAuthentication } from './utils/axiosAPI.ts'
import './index.css'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)
dayjs.locale('ru')

addCsrf()
checkAuthentication(store)
  .then(() => createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <CssBaseline />
      <ToastContainer position={'top-center'} />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  ))
