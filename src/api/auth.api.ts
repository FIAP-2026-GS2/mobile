import type { User } from '@/types/domain';

import { apiClient } from './client';

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = SignInInput & {
  name: string;
};

export type AuthResponse = {
  token: string;
  type: string;
  user: User;
};

export async function signIn(input: SignInInput) {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', input);
  return data;
}

// Hoje a API devolve só o usuário criado; quando passar a devolver o token,
// o AuthProvider já aproveita a resposta sem precisar de um login extra
export async function signUp(input: SignUpInput) {
  const { data } = await apiClient.post<User | AuthResponse>('/api/auth/register', input);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<User>('/api/users/me');
  return data;
}
