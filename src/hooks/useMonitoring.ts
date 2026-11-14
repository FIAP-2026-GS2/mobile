import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as monitoringApi from '@/api/monitoring.api';
import type { CaptureScheduleInput, DetectionReviewStatus } from '@/types/domain';

import { issueKeys } from './useIssues';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: monitoringApi.getDashboardSummary,
  });
}

// ---- Agendas de captura ----

export function useSchedules() {
  return useQuery({ queryKey: ['schedules'], queryFn: monitoringApi.listSchedules });
}

export function useSchedule(id: number | null) {
  return useQuery({
    queryKey: ['schedules', id],
    queryFn: () => monitoringApi.getSchedule(id as number),
    enabled: id !== null,
  });
}

export function useCameras() {
  return useQuery({
    queryKey: ['cameras'],
    queryFn: monitoringApi.listCameras,
    staleTime: 1000 * 60 * 30,
  });
}

function useInvalidateSchedules() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['schedules'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]);
}

export function useSaveSchedule(id: number | null) {
  const invalidate = useInvalidateSchedules();
  return useMutation({
    mutationFn: (input: CaptureScheduleInput) =>
      id ? monitoringApi.updateSchedule(id, input) : monitoringApi.createSchedule(input),
    onSuccess: invalidate,
  });
}

export function useDeleteSchedule() {
  const invalidate = useInvalidateSchedules();
  return useMutation({ mutationFn: monitoringApi.deleteSchedule, onSuccess: invalidate });
}

// ---- Detecções da IA ----

export function useDetections(reviewStatus: DetectionReviewStatus) {
  return useQuery({
    queryKey: ['detections', reviewStatus],
    queryFn: () => monitoringApi.listDetections(reviewStatus),
  });
}

export function useDetection(id: number) {
  return useQuery({
    queryKey: ['detections', 'detail', id],
    queryFn: () => monitoringApi.getDetection(id),
  });
}

function useInvalidateDetections() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['detections'] }),
      queryClient.invalidateQueries({ queryKey: issueKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]);
}

export function useConfirmDetection() {
  const invalidate = useInvalidateDetections();
  return useMutation({ mutationFn: monitoringApi.confirmDetection, onSuccess: invalidate });
}

export function useDismissDetection() {
  const invalidate = useInvalidateDetections();
  return useMutation({ mutationFn: monitoringApi.dismissDetection, onSuccess: invalidate });
}
