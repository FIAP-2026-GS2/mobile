import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorPalette } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

import { AppText } from './AppText';

type BadgeProps = {
  label: string;
  tone: keyof ColorPalette;
};

export function Badge({ label, tone }: BadgeProps) {
  const { colors } = useTheme();
  const color = colors[tone];

  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}22` }]}>
      <AppText variant="caption" style={{ color }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
