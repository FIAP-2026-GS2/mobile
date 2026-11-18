import type {
  IssueDetail,
  IssueStatus,
  IssueSummary,
  IssueType,
  PagedResponse,
} from '@/types/domain';

import { apiClient } from './client';

export type IssueFilters = {
  status?: IssueStatus;
  typeId?: number;
  neighborhood?: string;
};

export const ISSUES_PAGE_SIZE = 10;

export async function listIssues(filters: IssueFilters, page: number, size = ISSUES_PAGE_SIZE) {
  const { data } = await apiClient.get<PagedResponse<IssueSummary>>('/api/issues', {
    params: { ...filters, page, size, sort: 'openingDate,desc' },
  });
  return data;
}

export async function getIssue(id: number) {
  const { data } = await apiClient.get<IssueDetail>(`/api/issues/${id}`);
  return data;
}

export async function listIssueTypes() {
  const { data } = await apiClient.get<IssueType[]>('/api/issue-types');
  return data;
}
