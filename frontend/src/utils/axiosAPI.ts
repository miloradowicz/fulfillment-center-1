import axios from 'axios'
import { Store } from '@reduxjs/toolkit'
import { RootState } from '../app/store'


const axiosAPI = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
})

export const addCsrf = async () => {
  axiosAPI.get<{csrfToken: string}>('csrf')
    .then(({ data }) => {
      axiosAPI.interceptors.request.use(config => {
        config.headers.set('X-XSRF-TOKEN', data.csrfToken)
        return config
      })
    }).catch(e => {
      console.error(e)
    })
}

export const addAuthorization = (store: Store<RootState>) => {
  axiosAPI.interceptors.request.use(config => {
    const token = store.getState().users.user?.token

    if (token) {
      config.headers.set('Authorization', `Bearer ${ token }`)
    }

    return config
  })
}


export default axiosAPI
