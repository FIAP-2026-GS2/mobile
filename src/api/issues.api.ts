import type {
  IssueReport,
  IssueReportInput,
  IssueStatus,
  IssueType,
  MonitoringPoint,
  Page,
} from '@/types/domain';

import { apiClient } from './client';

export type IssueFilters = {
  status?: IssueStatus;
  mine?: boolean;
};

export const ISSUES_PAGE_SIZE = 10;

export async function listIssues(filters: IssueFilters, page: number) {
  const { data } = await apiClient.get<Page<IssueReport>>('/issue-reports', {
    params: { ...filters, page, size: ISSUES_PAGE_SIZE, sort: 'openingDate,desc' },
  });
  return data;
}

export async function getIssue(id: number) {
  const { data } = await apiClient.get<IssueReport>(`/issue-reports/${id}`);
  return data;
}

export async function createIssue(input: IssueReportInput) {
  const { data } = await apiClient.post<IssueReport>('/issue-reports', input);
  return data;
}

export async function updateIssue(id: number, input: IssueReportInput) {
  const { data } = await apiClient.put<IssueReport>(`/issue-reports/${id}`, input);
  return data;
}

export async function deleteIssue(id: number) {
  await apiClient.delete(`/issue-reports/${id}`);
}

// Somente gestor: muda o status e grava uma linha em ISSUE_HISTORY
export async function changeIssueStatus(id: number, status: IssueStatus, notes: string) {
  const { data } = await apiClient.patch<IssueReport>(`/issue-reports/${id}/status`, {
    status,
    notes,
  });
  return data;
}

export async function listIssueTypes() {
  const { data } = await apiClient.get<IssueType[]>('/issue-types');
  return data;
}

export async function listMonitoringPoints() {
  const { data } = await apiClient.get<MonitoringPoint[]>('/monitoring-points');
  return data;
}
