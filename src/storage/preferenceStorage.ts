import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore guarda os dados criptografados no Android/iOS.
// No navegador (usado só para desenvolvimento) ele não existe, então caímos no localStorage.
const isWeb = Platform.OS === 'web';

async function get(key: string): Promise<string | null> {
  try {
    if (isWeb) return globalThis.localStorage?.getItem(key) ?? null;
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function set(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Sem armazenamento disponível o app continua funcionando, só não lembra a escolha
  }
}

async function remove(key: string): Promise<void> {
  try {
    if (isWeb) {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    // ignorado pelo mesmo motivo de set()
  }
}

export const preferenceStorage = { get, set, remove };
