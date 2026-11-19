import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';
import type { PhotoSource } from '@/utils/device';

type PhotoFieldProps = {
  photoUri: string | null;
  error?: string;
  onPickPhoto: (source: PhotoSource) => void;
};

export function PhotoField({ photoUri, error, onPickPhoto }: PhotoFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="caption" color="textSecondary">
        Foto do local
      </AppText>
      <View
        style={[
          styles.frame,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.preview}
            accessibilityLabel="Foto escolhida do local"
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={40} color={colors.primary} />
            <AppText variant="caption" color="textMuted" style={styles.center}>
              Mostre o local por inteiro. Rostos e placas são borrados automaticamente.
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button
            title={photoUri ? 'Tirar outra' : 'Tirar foto'}
            icon="camera-outline"
            variant="secondary"
            onPress={() => onPickPhoto('camera')}
          />
        </View>
        <View style={styles.action}>
          <Button
            title="Galeria"
            icon="images-outline"
            variant="secondary"
            onPress={() => onPickPhoto('library')}
            accessibilityHint="Escolhe uma foto já salva no celular"
          />
        </View>
      </View>
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  frame: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    overflow: 'hidden',
    aspectRatio: 4 / 3,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  center: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    flex: 1,
  },
});
