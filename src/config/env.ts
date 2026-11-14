import Constants from 'expo-constants';

// Endereço da API Java (Spring Boot). Em produção aponta para o deploy no Azure;
// para desenvolvimento, defina EXPO_PUBLIC_API_URL (ex.: http://192.168.0.10:8080).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export const COMMIT_HASH: string | null = Constants.expoConfig?.extra?.commitHash ?? null;

export const REPOSITORY_URL = 'https://github.com/FIAP-2026-GS2/mobile';
