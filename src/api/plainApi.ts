import axios from 'axios'

const $plainApi = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
})

export default $plainApi
