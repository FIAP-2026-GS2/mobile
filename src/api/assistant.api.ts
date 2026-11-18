import type { ChatHistoryEntry, PagedResponse } from '@/types/domain';

import { apiClient } from './client';

export const CHAT_HISTORY_PAGE_SIZE = 20;

export async function askAssistant(message: string) {
  const { data } = await apiClient.post<{ answer: string }>('/api/chat', { message });
  return data.answer;
}

export async function listChatHistory(page: number) {
  const { data } = await apiClient.get<PagedResponse<ChatHistoryEntry>>(
    '/api/users/me/chat-history',
    { params: { page, size: CHAT_HISTORY_PAGE_SIZE, sort: 'createdAt,desc' } },
  );
  return data;
}
