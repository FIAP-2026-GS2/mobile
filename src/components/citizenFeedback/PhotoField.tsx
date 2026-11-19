import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';

type PhotoFieldProps = {
  photoUri: string | null;
  error?: string;
  onTakePhoto: () => void;
};

export function PhotoField({ photoUri, error, onTakePhoto }: PhotoFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="caption" color="textSecondary">
        Foto do local
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={photoUri ? 'Tirar outra foto' : 'Tirar foto do local'}
        onPress={onTakePhoto}
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
            accessibilityLabel="Foto tirada do local"
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={40} color={colors.primary} />
            <AppText variant="bodyStrong" color="primary">
              Tirar foto
            </AppText>
            <AppText variant="caption" color="textMuted" style={styles.center}>
              Mostre o local por inteiro. Rostos e placas são borrados automaticamente.
            </AppText>
          </View>
        )}
      </Pressable>
      {photoUri ? (
        <AppText variant="caption" color="primary" onPress={onTakePhoto}>
          Tirar outra foto
        </AppText>
      ) : null}
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
    gap: spacing.xs,
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
});
