import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as citizenFeedbackApi from '@/api/citizenFeedback.api';
import type { CitizenFeedbackInput } from '@/types/domain';

const resolvedIssuesKey = ['resolved-issues'];

export function useResolvedIssues() {
  return useInfiniteQuery({
    queryKey: resolvedIssuesKey,
    queryFn: ({ pageParam }) => citizenFeedbackApi.listResolvedIssues(pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalPages }) => (page < totalPages ? page + 1 : undefined),
  });
}

// A .NET não tem rota pública de detalhe: a ocorrência vem da mesma lista já carregada
export function useResolvedIssue(id: number) {
  const issues = useResolvedIssues();
  const issue = issues.data?.pages.flatMap((page) => page.items).find((item) => item.id === id);
  return { ...issues, issue };
}

export function useSubmitCitizenFeedback(issueId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CitizenFeedbackInput) =>
      citizenFeedbackApi.submitCitizenFeedback(issueId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resolvedIssuesKey }),
  });
}
