import type { UpdateProfileInput, User } from '@/types/domain';

import { apiClient } from './client';

export async function getProfile() {
  const { data } = await apiClient.get<User>('/api/users/me');
  return data;
}

export async function updateProfile(input: UpdateProfileInput) {
  const { data } = await apiClient.put<User>('/api/users/me', input);
  return data;
}

export async function deleteAccount() {
  await apiClient.delete('/api/users/me');
}
