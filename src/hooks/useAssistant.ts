import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as assistantApi from '@/api/assistant.api';

const chatHistoryKey = ['chat-history'];

// Histórico do mais recente para o mais antigo (a lista do chat é invertida)
export function useChatHistory() {
  return useInfiniteQuery({
    queryKey: chatHistoryKey,
    queryFn: ({ pageParam }) => assistantApi.listChatHistory(pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ page }) =>
      page.number + 1 < page.totalPages ? page.number + 1 : undefined,
  });
}

export function useAskAssistant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assistantApi.askAssistant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chatHistoryKey }),
  });
}
