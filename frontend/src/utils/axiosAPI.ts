import { RootState } from '@/app/store'
import { setUser, unsetUser } from '@/store/slices/authSlice'
import { Store } from '@reduxjs/toolkit'
import axios from 'axios'

const axiosAPI = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
})

export const addCsrf = async () => {
  try {
    const { data } = await axiosAPI.get<{csrfToken: string}>('csrf')

    axiosAPI.interceptors.request.use(config => {
      config.headers.set('X-XSRF-TOKEN', data.csrfToken)
      return config
    })
  } catch(e) {
    console.error(e)
  }
}

export const checkAuthentication = async (store: Store<RootState>) => {
  try {
    const { data } = await axiosAPI.get('/users/me')
    store.dispatch(setUser(data))
  } catch {
    store.dispatch(unsetUser())
  }
}

export default axiosAPI
