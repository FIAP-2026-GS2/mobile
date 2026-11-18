import { useMutation, useQuery } from '@tanstack/react-query';

import * as usersApi from '@/api/users.api';
import { useAuth } from '@/context/AuthProvider';

// Lê o perfil direto da API, para a tela de conta sempre mostrar o dado atual
export function useProfile() {
  const { replaceUser } = useAuth();
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profile = await usersApi.getProfile();
      replaceUser(profile);
      return profile;
    },
  });
}

export function useUpdateProfile() {
  const { replaceUser } = useAuth();
  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: replaceUser,
  });
}

export function useDeleteAccount() {
  const { signOut } = useAuth();
  return useMutation({
    mutationFn: usersApi.deleteAccount,
    onSuccess: signOut,
  });
}
