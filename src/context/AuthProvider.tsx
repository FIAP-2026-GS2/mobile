import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import * as authApi from '@/api/auth.api';
import { setAuthToken, setUnauthorizedHandler } from '@/api/client';
import { preferenceStorage } from '@/storage/preferenceStorage';
import type { User } from '@/types/domain';

type AuthContextValue = {
  user: User | null;
  isRestoring: boolean;
  signIn: (input: authApi.SignInInput) => Promise<void>;
  signUp: (input: authApi.SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  replaceUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'auth-token';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  async function signOut() {
    setAuthToken(null);
    setUser(null);
    await preferenceStorage.remove(TOKEN_KEY);
  }

  async function startSession({ token, user: signedInUser }: authApi.AuthResponse) {
    setAuthToken(token);
    await preferenceStorage.set(TOKEN_KEY, token);
    setUser(signedInUser);
  }

  async function signIn(input: authApi.SignInInput) {
    await startSession(await authApi.signIn(input));
  }

  async function signUp(input: authApi.SignUpInput) {
    await startSession(await authApi.signUp(input));
  }

  // Ao abrir o app, tenta reaproveitar o token salvo e confirma com a API quem é o usuário
  useEffect(() => {
    async function restoreSession() {
      const savedToken = await preferenceStorage.get(TOKEN_KEY);
      if (!savedToken) {
        setIsRestoring(false);
        return;
      }
      setAuthToken(savedToken);
      try {
        setUser(await authApi.fetchCurrentUser());
      } catch {
        await signOut();
      } finally {
        setIsRestoring(false);
      }
    }
    restoreSession();
  }, []);

  // Qualquer 401 da API (token expirado ou inválido) encerra a sessão e volta para o login
  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isRestoring,
    signIn,
    signUp,
    signOut,
    replaceUser: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  }
  return context;
}
