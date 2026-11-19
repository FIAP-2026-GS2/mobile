import { Platform } from 'react-native';

import type {
  CitizenFeedback,
  CitizenFeedbackInput,
  DotnetPagedResponse,
  PublicIssueReport,
} from '@/types/domain';

import { DOTNET_API_BASE_URL } from '@/config/env';

import { dotnetClient } from './client';
import { ApiError } from './errors';

export const RESOLVED_ISSUES_PAGE_SIZE = 10;

// Rota pública da .NET (sem login): só ocorrências resolvidas podem ser conferidas
export async function listResolvedIssues(page: number) {
  if (!DOTNET_API_BASE_URL) {
    throw new ApiError('A conferência de consertos está indisponível no momento.', null);
  }
  const { data } = await dotnetClient.get<DotnetPagedResponse<PublicIssueReport>>(
    '/api/public/issue-reports',
    { params: { status: 'RESOLVED', page, pageSize: RESOLVED_ISSUES_PAGE_SIZE } },
  );
  return data;
}

async function appendPhoto(form: FormData, photoUri: string) {
  const name = `conferencia-${Date.now()}.jpg`;
  if (Platform.OS === 'web') {
    // No navegador a foto vem como blob: precisa virar arquivo de verdade
    const blob = await (await fetch(photoUri)).blob();
    form.append('photo', blob, name);
    return;
  }
  // No Android e no iOS o React Native lê o arquivo direto pelo caminho
  form.append('photo', { uri: photoUri, name, type: 'image/jpeg' } as unknown as Blob);
}

// Envia a foto (multipart). A IA da .NET borra rostos e placas e confere se a foto mostra a rua
export async function submitCitizenFeedback(issueId: number, input: CitizenFeedbackInput) {
  const form = new FormData();
  form.append('decision', input.decision);
  if (input.notes) form.append('notes', input.notes);
  form.append('latitude', input.latitude.toFixed(6));
  form.append('longitude', input.longitude.toFixed(6));
  await appendPhoto(form, input.photoUri);

  const { data } = await dotnetClient.post<CitizenFeedback>(
    `/api/issue-reports/${issueId}/citizen-feedback`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}
