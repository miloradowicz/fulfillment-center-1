import axios from 'axios'

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

export default axiosAPI
