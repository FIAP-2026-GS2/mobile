import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { getErrorMessage } from '@/api/errors';
import { ChatBubble } from '@/components/assistant/ChatBubble';
import { ChatComposer } from '@/components/assistant/ChatComposer';
import { AppText } from '@/components/ui/AppText';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { ErrorState, LoadingState } from '@/components/ui/StateViews';
import { useAskAssistant, useChatHistory } from '@/hooks/useAssistant';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';

const SUGGESTED_QUESTIONS = [
  'Quais ocorrências estão abertas agora?',
  'Quantos postes apagados foram resolvidos?',
  'Como as câmeras encontram os problemas?',
];

type ChatExchange = { key: string; question: string; answer: string };

export default function AssistantScreen() {
  const { colors } = useTheme();
  // Pergunta sugerida quando o assistente é aberto a partir de uma ocorrência
  const { question } = useLocalSearchParams<{ question?: string }>();
  const history = useChatHistory();
  const askAssistant = useAskAssistant();
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  // Respostas desta sessão: aparecem na hora, mesmo antes de o histórico da API trazê-las
  const [sessionExchanges, setSessionExchanges] = useState<ChatExchange[]>([]);

  const savedEntries: ChatExchange[] = (
    history.data?.pages.flatMap((page) => page.content) ?? []
  ).map((entry) => ({ key: `saved-${entry.id}`, question: entry.question, answer: entry.answer }));
  const unsavedExchanges = sessionExchanges.filter(
    (exchange) =>
      !savedEntries.some(
        (saved) => saved.question === exchange.question && saved.answer === exchange.answer,
      ),
  );
  const entries = [...unsavedExchanges, ...savedEntries];

  async function handleSend(message: string) {
    setSendError(null);
    setPendingQuestion(message);
    try {
      const answer = await askAssistant.mutateAsync(message);
      setSessionExchanges((current) => [
        { key: `session-${Date.now()}`, question: message, answer },
        ...current,
      ]);
    } catch (error) {
      setSendError(getErrorMessage(error));
    } finally {
      setPendingQuestion(null);
    }
  }

  function renderConversation() {
    if (history.isLoading) return <LoadingState message="Carregando conversa..." />;
    if (history.isError)
      return <ErrorState error={history.error} onRetry={() => history.refetch()} />;

    if (entries.length === 0 && !pendingQuestion) {
      return (
        <View style={styles.welcome}>
          <AppText variant="title">Pergunte ao assistente</AppText>
          <AppText color="textSecondary">
            Ele responde com base nas ocorrências registradas pela prefeitura. Experimente:
          </AppText>
          <ChipGroup
            options={SUGGESTED_QUESTIONS.map((text) => ({ value: text, label: text }))}
            value={null}
            onChange={handleSend}
          />
        </View>
      );
    }

    return (
      <FlatList
        inverted
        data={entries}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.conversation}
        renderItem={({ item }) => (
          <View style={styles.exchange}>
            <ChatBubble author="user" text={item.question} />
            <ChatBubble author="assistant" text={item.answer} />
          </View>
        )}
        // Na lista invertida o cabeçalho fica embaixo, junto do campo de mensagem
        ListHeaderComponent={
          pendingQuestion ? (
            <View style={styles.exchange}>
              <ChatBubble author="user" text={pendingQuestion} />
              <ChatBubble author="assistant" isTyping />
            </View>
          ) : undefined
        }
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (history.hasNextPage && !history.isFetchingNextPage) history.fetchNextPage();
        }}
        ListFooterComponent={
          history.isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : undefined
        }
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.flex}>{renderConversation()}</View>
      {sendError ? (
        <AppText color="danger" style={styles.error} accessibilityLiveRegion="assertive">
          {sendError}
        </AppText>
      ) : null}
      <AppText variant="caption" color="textMuted" style={styles.disclaimer}>
        Respostas geradas por IA podem conter erros. Confira os detalhes na aba Ocorrências.
      </AppText>
      <ChatComposer
        key={question ?? 'empty'}
        initialMessage={question}
        isSending={askAssistant.isPending}
        onSend={handleSend}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  welcome: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  conversation: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  exchange: {
    gap: spacing.sm,
  },
  error: {
    paddingHorizontal: spacing.lg,
  },
  disclaimer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    textAlign: 'center',
  },
});
