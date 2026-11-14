import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '@/api/errors';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

import { AppText } from './AppText';
import { Button } from './Button';

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText color="textSecondary">{message}</AppText>
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container} accessibilityLiveRegion="assertive">
      <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
      <AppText variant="subtitle" style={styles.center}>
        Não foi possível carregar
      </AppText>
      <AppText color="textSecondary" style={styles.center}>
        {getErrorMessage(error)}
      </AppText>
      <Button title="Tentar novamente" icon="refresh" variant="secondary" onPress={onRetry} />
    </View>
  );
}

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
};

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <AppText variant="subtitle" style={styles.center}>
        {title}
      </AppText>
      {message ? (
        <AppText color="textSecondary" style={styles.center}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
  },
  center: {
    textAlign: 'center',
  },
});
