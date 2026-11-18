import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorPalette } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

import { AppText } from './AppText';

type StatTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | string;
  tone: keyof ColorPalette;
};

export function StatTile({ icon, label, value, tone }: StatTileProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.border }]}
      accessible
      accessibilityLabel={`${label}: ${value}`}>
      <Ionicons name={icon} size={20} color={colors[tone]} />
      <AppText variant="display">{value}</AppText>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
