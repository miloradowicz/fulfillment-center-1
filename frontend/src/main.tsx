import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { CssBaseline } from '@mui/material'


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <CssBaseline />
    <App />
  </Provider>,
)
