import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as issuesApi from '@/api/issues.api';
import type { IssueReportInput, IssueStatus } from '@/types/domain';

export const issueKeys = {
  all: ['issues'] as const,
  list: (filters: issuesApi.IssueFilters) => ['issues', 'list', filters] as const,
  detail: (id: number) => ['issues', 'detail', id] as const,
};

export function useIssueList(filters: issuesApi.IssueFilters) {
  return useInfiniteQuery({
    queryKey: issueKeys.list(filters),
    queryFn: ({ pageParam }) => issuesApi.listIssues(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });
}

// id nulo desliga a busca (ex.: formulário em modo de criação)
export function useIssue(id: number | null) {
  return useQuery({
    queryKey: issueKeys.detail(id ?? 0),
    queryFn: () => issuesApi.getIssue(id as number),
    enabled: id !== null,
  });
}

export function useIssueTypes() {
  return useQuery({
    queryKey: ['issue-types'],
    queryFn: issuesApi.listIssueTypes,
    staleTime: 1000 * 60 * 30,
  });
}

export function useMonitoringPoints() {
  return useQuery({
    queryKey: ['monitoring-points'],
    queryFn: issuesApi.listMonitoringPoints,
    staleTime: 1000 * 60 * 30,
  });
}

// Depois de qualquer alteração, as listas, o detalhe e o painel são recarregados
function useInvalidateIssues() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: issueKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]);
}

export function useSaveIssue(id?: number) {
  const invalidate = useInvalidateIssues();
  return useMutation({
    mutationFn: (input: IssueReportInput) =>
      id ? issuesApi.updateIssue(id, input) : issuesApi.createIssue(input),
    onSuccess: invalidate,
  });
}

export function useDeleteIssue() {
  const invalidate = useInvalidateIssues();
  return useMutation({
    mutationFn: issuesApi.deleteIssue,
    onSuccess: invalidate,
  });
}

export function useChangeIssueStatus(id: number) {
  const invalidate = useInvalidateIssues();
  return useMutation({
    mutationFn: ({ status, notes }: { status: IssueStatus; notes: string }) =>
      issuesApi.changeIssueStatus(id, status, notes),
    onSuccess: invalidate,
  });
}
