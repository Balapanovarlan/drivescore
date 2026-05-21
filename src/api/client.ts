import axios from 'axios'

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('drivescore.token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
