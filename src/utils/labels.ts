import type { ColorPalette } from '@/theme/colors';
import type {
  IssueSource,
  IssueStatus,
  ScheduleFrequency,
  Severity,
  UserType,
} from '@/types/domain';

type Tone = keyof ColorPalette;

export const issueStatusLabels: Record<IssueStatus, { label: string; tone: Tone }> = {
  OPEN: { label: 'Aberta', tone: 'warning' },
  IN_PROGRESS: { label: 'Em atendimento', tone: 'primary' },
  RESOLVED: { label: 'Resolvida', tone: 'success' },
  CANCELLED: { label: 'Cancelada', tone: 'textMuted' },
};

export const severityLabels: Record<Severity, { label: string; tone: Tone }> = {
  LOW: { label: 'Baixa', tone: 'success' },
  MEDIUM: { label: 'Média', tone: 'warning' },
  HIGH: { label: 'Alta', tone: 'danger' },
  CRITICAL: { label: 'Crítica', tone: 'danger' },
};

export const sourceLabels: Record<IssueSource, string> = {
  CITIZEN: 'Relatada por cidadão',
  CAMERA: 'Detectada por câmera',
};

export const userTypeLabels: Record<UserType, string> = {
  CITIZEN: 'Cidadão',
  MANAGER: 'Gestor de zeladoria',
};

export const frequencyLabels: Record<ScheduleFrequency, string> = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
};

export const weekdayLabels: Record<number, string> = {
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
  7: 'Domingo',
};
