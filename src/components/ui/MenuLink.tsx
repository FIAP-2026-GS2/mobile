import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';

import { AppText } from './AppText';

type MenuLinkProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

export function MenuLink({ icon, title, onPress }: MenuLinkProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.link,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <AppText variant="bodyStrong" style={styles.title}>
        {title}
      </AppText>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  title: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
