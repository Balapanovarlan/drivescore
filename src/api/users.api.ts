import { apiClient } from './client'
import type { User } from './auth.api'

export interface CreateUserInput {
  email: string
  password: string
  fullName?: string
  role?: 'admin' | 'manager'
}

export async function listUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/users')
  return data
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data } = await apiClient.post<User>('/users', input)
  return data
}

export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`)
}
