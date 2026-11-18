import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';

import { AppText } from './AppText';

export type ChipOption<T extends string | number> = {
  value: T;
  label: string;
};

type ChipGroupProps<T extends string | number> = {
  label?: string;
  options: ChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
  scrollable?: boolean;
};

// Seleção única em "chips": substitui o Picker nativo e fica igual no Android, iOS e web
export function ChipGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  error,
  scrollable = false,
}: ChipGroupProps<T>) {
  const { colors } = useTheme();

  const chips = options.map((option) => {
    const selected = option.value === value;
    return (
      <Pressable
        key={String(option.value)}
        accessibilityRole="radio"
        accessibilityLabel={option.label}
        accessibilityState={{ selected }}
        onPress={() => onChange(option.value)}
        style={[
          styles.chip,
          {
            backgroundColor: selected ? colors.primary : colors.surface,
            borderColor: selected ? colors.primary : colors.border,
          },
        ]}>
        {/* No Android a quebra de linha "highQuality" mede o texto mais largo do que desenha:
            a última palavra ia para uma segunda linha escondida e sobrava um espaço vazio */}
        <AppText
          variant="caption"
          numberOfLines={1}
          textBreakStrategy="simple"
          style={{ color: selected ? colors.onPrimary : colors.text }}>
          {option.label}
        </AppText>
      </Pressable>
    );
  });

  return (
    <View style={styles.container} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {label ? (
        <AppText variant="caption" color="textSecondary">
          {label}
        </AppText>
      ) : null}
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}>
          {chips}
        </ScrollView>
      ) : (
        <View style={[styles.row, styles.wrap]}>{chips}</View>
      )}
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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
