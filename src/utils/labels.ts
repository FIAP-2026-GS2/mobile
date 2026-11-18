import type { ColorPalette } from '@/theme/colors';
import type { IssueCategory, IssueSource, IssueStatus, Severity, UserType } from '@/types/domain';

type Tone = keyof ColorPalette;
type Label = { label: string; tone: Tone };

const issueStatusLabels: Record<IssueStatus, Label> = {
  VALIDATION: { label: 'Em validação', tone: 'secondary' },
  OPEN: { label: 'Aberta', tone: 'warning' },
  ASSIGNED: { label: 'Equipe designada', tone: 'secondary' },
  IN_PROGRESS: { label: 'Em atendimento', tone: 'primary' },
  RESOLVED: { label: 'Resolvida', tone: 'success' },
  REJECTED: { label: 'Rejeitada', tone: 'textMuted' },
};

// Status que a lista pública permite filtrar, na ordem do fluxo de atendimento
export const filterableStatuses: IssueStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

// A API pode criar novos status; nesse caso mostramos o código sem quebrar a tela
export function getStatusLabel(status: string): Label {
  return issueStatusLabels[status as IssueStatus] ?? { label: status, tone: 'textSecondary' };
}

export const severityLabels: Record<Severity, Label> = {
  LOW: { label: 'Baixa', tone: 'success' },
  MEDIUM: { label: 'Média', tone: 'warning' },
  HIGH: { label: 'Alta', tone: 'danger' },
  CRITICAL: { label: 'Crítica', tone: 'danger' },
};

export const sourceLabels: Record<IssueSource, string> = {
  AI: 'Detectada pelas câmeras (IA)',
  CITIZEN: 'Relatada por cidadão',
  AGENT: 'Registrada por agente da prefeitura',
};

export const categoryLabels: Record<IssueCategory, string> = {
  ROAD_INFRASTRUCTURE: 'Vias',
  ACCESSIBILITY: 'Acessibilidade',
  URBAN_CLEANING: 'Limpeza urbana',
  PUBLIC_LIGHTING: 'Iluminação pública',
};

export const userTypeLabels: Record<UserType, string> = {
  CITIZEN: 'Cidadão',
  AGENT: 'Agente da prefeitura',
  ADMIN: 'Administrador',
};
