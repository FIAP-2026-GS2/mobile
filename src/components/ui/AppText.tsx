import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorPalette } from '@/theme/colors';
import { textVariants, type TextVariant } from '@/theme/typography';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: keyof ColorPalette;
};

export function AppText({ variant = 'body', color = 'text', style, ...props }: AppTextProps) {
  const { colors } = useTheme();
  return <Text {...props} style={[textVariants[variant], { color: colors[color] }, style]} />;
}
