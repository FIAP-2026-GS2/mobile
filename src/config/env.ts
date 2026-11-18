import Constants from 'expo-constants';

// Endereço da API Java (Spring Boot). Para apontar para outro servidor, defina
// EXPO_PUBLIC_API_URL (ex.: http://192.168.0.10:8080).
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://sampatech-portal.onrender.com';

export const COMMIT_HASH: string | null = Constants.expoConfig?.extra?.commitHash ?? null;

export const REPOSITORY_URL = 'https://github.com/FIAP-2026-GS2/mobile';
