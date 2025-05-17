import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { addCsrf, checkAuthentication } from './utils/axiosAPI.ts'
import './index.css'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { ErrorBoundary } from '@/hoc/ErrorBoundary.tsx'

dayjs.extend(localizedFormat)
dayjs.locale('ru')

const AppWithErrorBoundary = ErrorBoundary(App)

addCsrf()
checkAuthentication(store)
  .then(() => createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <ToastContainer position={'top-center'} />
      <BrowserRouter>
        <AppWithErrorBoundary />
      </BrowserRouter>
    </Provider>,
  ))
