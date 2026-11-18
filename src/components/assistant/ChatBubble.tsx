import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';

type ChatBubbleProps = {
  author: 'user' | 'assistant';
  text?: string;
  isTyping?: boolean;
};

export function ChatBubble({ author, text, isTyping = false }: ChatBubbleProps) {
  const { colors } = useTheme();
  const isUser = author === 'user';

  return (
    <View
      accessible
      accessibilityLabel={`${isUser ? 'Você' : 'Assistente'}: ${isTyping ? 'escrevendo' : text}`}
      style={[
        styles.bubble,
        isUser
          ? [styles.user, { backgroundColor: colors.primary }]
          : [styles.assistant, { backgroundColor: colors.surface, borderColor: colors.border }],
      ]}>
      {isTyping ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <AppText style={{ color: isUser ? colors.onPrimary : colors.text }}>{text}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  user: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: radius.sm / 2,
  },
  assistant: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderBottomLeftRadius: radius.sm / 2,
  },
});
