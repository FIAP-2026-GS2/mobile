import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/ThemeProvider';
import type { ColorPalette } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type DecisionOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  tone: keyof ColorPalette;
  selected: boolean;
  onPress: () => void;
};

export function DecisionOption({
  icon,
  title,
  description,
  tone,
  selected,
  onPress,
}: DecisionOptionProps) {
  const { colors } = useTheme();
  const accent = colors[tone];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? `${accent}1F` : colors.surface,
          borderColor: selected ? accent : colors.border,
        },
      ]}>
      <Ionicons name={icon} size={28} color={accent} />
      <View style={styles.texts}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" color="textSecondary">
          {description}
        </AppText>
      </View>
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={selected ? accent : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
