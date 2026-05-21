import axios from 'axios'

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

const TOKEN_KEY = 'drivescore.token'

// 401 from these endpoints means "the credentials you just submitted are wrong",
// NOT "your session is dead", so they must not trigger the global auto-logout.
const CREDENTIAL_ENDPOINTS = ['/auth/login', '/auth/change-password']

function readToken(): string | null {
  // localStorage is canonical (shared across tabs). The sessionStorage fallback
  // covers users still on the previous build's storage location.
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = readToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isCredentialEndpoint = CREDENTIAL_ENDPOINTS.some((endpoint) =>
        url.startsWith(endpoint),
      )
      if (!isCredentialEndpoint) {
        localStorage.removeItem(TOKEN_KEY)
        sessionStorage.removeItem(TOKEN_KEY)
        const path = window.location.pathname
        if (path !== '/login' && path !== '/register') {
          window.location.assign('/login')
        }
      }
    }
    return Promise.reject(error)
  },
)
