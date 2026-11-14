import type {
  AiDetection,
  Camera,
  CaptureSchedule,
  CaptureScheduleInput,
  DashboardSummary,
  DetectionReviewStatus,
  IssueReport,
} from '@/types/domain';

import { apiClient } from './client';

// ---- Agendas de captura (CAPTURE_SCHEDULE) ----

export async function listSchedules() {
  const { data } = await apiClient.get<CaptureSchedule[]>('/capture-schedules');
  return data;
}

export async function getSchedule(id: number) {
  const { data } = await apiClient.get<CaptureSchedule>(`/capture-schedules/${id}`);
  return data;
}

export async function createSchedule(input: CaptureScheduleInput) {
  const { data } = await apiClient.post<CaptureSchedule>('/capture-schedules', input);
  return data;
}

export async function updateSchedule(id: number, input: CaptureScheduleInput) {
  const { data } = await apiClient.put<CaptureSchedule>(`/capture-schedules/${id}`, input);
  return data;
}

export async function deleteSchedule(id: number) {
  await apiClient.delete(`/capture-schedules/${id}`);
}

export async function listCameras() {
  const { data } = await apiClient.get<Camera[]>('/cameras');
  return data;
}

// ---- Detecções da IA (AI_DETECTION + AI_ANALYSIS) ----

export async function listDetections(reviewStatus: DetectionReviewStatus) {
  const { data } = await apiClient.get<AiDetection[]>('/ai-detections', {
    params: { reviewStatus },
  });
  return data;
}

export async function getDetection(id: number) {
  const { data } = await apiClient.get<AiDetection>(`/ai-detections/${id}`);
  return data;
}

// Confirmar gera uma ocorrência (ISSUE_REPORT com source = CAMERA)
export async function confirmDetection(id: number) {
  const { data } = await apiClient.post<IssueReport>(`/ai-detections/${id}/confirm`);
  return data;
}

export async function dismissDetection(id: number) {
  await apiClient.post(`/ai-detections/${id}/dismiss`);
}

// ---- Painel ----

export async function getDashboardSummary() {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return data;
}
