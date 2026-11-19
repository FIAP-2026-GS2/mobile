import { create, type AxiosInstance } from 'axios';

import { API_BASE_URL, DOTNET_API_BASE_URL } from '@/config/env';

import { toApiError } from './errors';

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

// Chamado pelo AuthProvider ao entrar/sair e ao restaurar a sessão salva
export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Chave única por envio: se a requisição for repetida (rede instável, toque duplo),
// a API reconhece a chave e não cria o registro duas vezes
function createIdempotencyKey() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

type ClientOptions = {
  baseURL: string;
  // Só a API que emite o token (Java) encerra a sessão quando responde 401
  endsSessionOnUnauthorized: boolean;
};

function createApiClient({ baseURL, endsSessionOnUnauthorized }: ClientOptions): AxiosInstance {
  const client = create({ baseURL, timeout: 60000 });

  client.interceptors.request.use((config) => {
    // As duas APIs aceitam o mesmo JWT emitido pela API Java
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    if (config.method === 'post' && !config.headers['Idempotency-Key']) {
      config.headers['Idempotency-Key'] = createIdempotencyKey();
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const apiError = toApiError(error);
      const isAuthRoute = String(error?.config?.url ?? '').startsWith('/api/auth/');
      if (endsSessionOnUnauthorized && apiError.status === 401 && !isAuthRoute) {
        onUnauthorized?.();
      }
      return Promise.reject(apiError);
    },
  );

  return client;
}

export const apiClient = createApiClient({
  baseURL: API_BASE_URL,
  endsSessionOnUnauthorized: true,
});

export const dotnetClient = createApiClient({
  baseURL: DOTNET_API_BASE_URL,
  endsSessionOnUnauthorized: false,
});
