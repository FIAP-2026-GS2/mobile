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

// O cadastro já devolve o token, então a pessoa entra direto no app
export async function signUp(input: SignUpInput) {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/register', input);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<User>('/api/users/me');
  return data;
}
