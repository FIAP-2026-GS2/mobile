import Constants from 'expo-constants';

// Endereço da API Java (Spring Boot): login, perfil, ocorrências do portal e assistente.
// Para apontar para outro servidor, defina EXPO_PUBLIC_API_URL (ex.: http://192.168.0.10:8080).
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://sampatech-portal.onrender.com';

// Endereço da API .NET: ocorrências resolvidas e envio de fotos do cidadão (confirmar ou contestar).
// Ela é publicada em HTTP no Azure; por isso o app.json libera esse tráfego no Android.
export const DOTNET_API_BASE_URL =
  process.env.EXPO_PUBLIC_DOTNET_API_URL ??
  'http://sampatech-api-gs2jd.canadacentral.azurecontainer.io:8080';

export const COMMIT_HASH: string | null = Constants.expoConfig?.extra?.commitHash ?? null;

export const REPOSITORY_URL = 'https://github.com/FIAP-2026-GS2/mobile';
