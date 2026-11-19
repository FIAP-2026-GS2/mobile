import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export class DevicePermissionError extends Error {}

// Só câmera, sem galeria: a foto precisa ser tirada agora, no local (como no Smart Sampa Cidadão)
export async function takePhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new DevicePermissionError(
      'Permita o uso da câmera nas configurações do celular para fotografar o local.',
    );
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    // Qualidade reduzida mantém a foto bem abaixo do limite de 5 MB da API
    quality: 0.6,
  });
  return result.canceled ? null : result.assets[0].uri;
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
