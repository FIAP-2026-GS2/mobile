import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import * as issuesApi from '@/api/issues.api';
import type { IssueStatus } from '@/types/domain';

export const issueKeys = {
  all: ['issues'] as const,
  list: (filters: issuesApi.IssueFilters) => ['issues', 'list', filters] as const,
  count: (status: IssueStatus) => ['issues', 'count', status] as const,
  detail: (id: number) => ['issues', 'detail', id] as const,
};

export function useIssueList(filters: issuesApi.IssueFilters) {
  return useInfiniteQuery({
    queryKey: issueKeys.list(filters),
    queryFn: ({ pageParam }) => issuesApi.listIssues(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: ({ page }) =>
      page.number + 1 < page.totalPages ? page.number + 1 : undefined,
  });
}

// Busca só 1 item para ler o total de ocorrências naquele status
export function useIssueCount(status: IssueStatus) {
  return useQuery({
    queryKey: issueKeys.count(status),
    queryFn: () => issuesApi.listIssues({ status }, 0, 1),
    select: (data) => data.page.totalElements,
  });
}

export function useIssue(id: number) {
  return useQuery({
    queryKey: issueKeys.detail(id),
    queryFn: () => issuesApi.getIssue(id),
  });
}

export function useIssueTypes() {
  return useQuery({
    queryKey: ['issue-types'],
    queryFn: issuesApi.listIssueTypes,
    staleTime: 1000 * 60 * 30,
  });
}
