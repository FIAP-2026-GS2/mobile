import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const MAX_MESSAGE_LENGTH = 1000;

type ChatComposerProps = {
  initialMessage?: string;
  isSending: boolean;
  onSend: (message: string) => void;
};

export function ChatComposer({ initialMessage = '', isSending, onSend }: ChatComposerProps) {
  const { colors } = useTheme();
  const [message, setMessage] = useState(initialMessage);
  const canSend = message.trim().length > 0 && !isSending;

  function handleSend() {
    if (!canSend) return;
    onSend(message.trim());
    setMessage('');
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TextInput
        accessibilityLabel="Mensagem para o assistente"
        value={message}
        onChangeText={setMessage}
        placeholder="Pergunte sobre as ocorrências da cidade"
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={MAX_MESSAGE_LENGTH}
        style={[styles.input, { color: colors.text }]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Enviar mensagem"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={handleSend}
        style={[styles.send, { backgroundColor: canSend ? colors.primary : colors.surfaceAlt }]}>
        {isSending ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Ionicons name="send" size={18} color={canSend ? colors.onPrimary : colors.textMuted} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    borderTopWidth: 1,
    padding: spacing.md,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
