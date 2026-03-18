import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000'
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('fl_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
