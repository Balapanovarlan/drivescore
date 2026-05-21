import { apiClient } from './client'

export interface User {
  id: string
  email: string
  fullName: string | null
}

export interface AuthResponse {
  token: string
  user: User
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function register(input: {
  email: string
  password: string
  fullName?: string
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', input)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}

export async function changePassword(input: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  await apiClient.post('/auth/change-password', input)
}

const TOKEN_KEY = 'drivescore.token'

// Stored in sessionStorage so the token does NOT survive a browser restart and
// is isolated per tab. Less attack surface than localStorage for a B2B app.
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  // Also clean any legacy localStorage tokens from older builds.
  localStorage.removeItem(TOKEN_KEY)
}
