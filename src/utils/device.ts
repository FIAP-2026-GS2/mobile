import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import type { PhotoFile } from '@/types/domain';

export class DevicePermissionError extends Error {}

export type PhotoSource = 'camera' | 'library';

// Limite da API .NET para a foto do cidadão
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  // Qualidade reduzida mantém a foto bem abaixo do limite de 5 MB da API
  quality: 0.6,
};

async function openCamera() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new DevicePermissionError(
      'Permita o uso da câmera nas configurações do celular para fotografar o local.',
    );
  }
  return ImagePicker.launchCameraAsync(pickerOptions);
}

async function openLibrary() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new DevicePermissionError(
      'Permita o acesso às fotos nas configurações do celular para escolher uma imagem.',
    );
  }
  return ImagePicker.launchImageLibraryAsync(pickerOptions);
}

// Câmera (foto tirada agora, no local) ou uma foto já salva no aparelho
export async function pickPhoto(source: PhotoSource): Promise<PhotoFile | null> {
  const result = source === 'camera' ? await openCamera() : await openLibrary();
  if (result.canceled) return null;

  const asset = result.assets[0];
  if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
    throw new DevicePermissionError('A foto passa de 5 MB. Escolha ou tire outra.');
  }
  return { uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' };
}

export async function getCurrentCoordinates() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new DevicePermissionError(
      'Permita o acesso à localização para confirmar que a foto foi tirada no local.',
    );
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}
