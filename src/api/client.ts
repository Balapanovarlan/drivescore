import axios from 'axios'

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

const TOKEN_KEY = 'drivescore.token'

// 401 from these endpoints means "the credentials you just submitted are wrong",
// NOT "your session is dead", so they must not trigger the global auto-logout.
const CREDENTIAL_ENDPOINTS = ['/auth/login', '/auth/change-password']

function readToken(): string | null {
  // sessionStorage is the canonical place; fall back to localStorage so users
  // who logged in before the storage switch don't get bounced once.
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
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
        sessionStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(TOKEN_KEY)
        const path = window.location.pathname
        if (path !== '/login' && path !== '/register') {
          window.location.assign('/login')
        }
      }
    }
    return Promise.reject(error)
  },
)
