import type { User } from '@/types/domain';

import { apiClient } from './client';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export async function login(input: LoginInput) {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', input);
  return data;
}

export async function register(input: RegisterInput) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', input);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}
