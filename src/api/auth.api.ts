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

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
