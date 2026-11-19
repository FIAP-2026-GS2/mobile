// Tipos do domínio no formato JSON devolvido pela API Java (SampaTech - Portal da Transparência).

export type UserType = 'CITIZEN' | 'AGENT' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  email: string;
  userType: UserType;
  registrationDate: string;
  active: boolean;
};

export type IssueCategory =
  'ROAD_INFRASTRUCTURE' | 'ACCESSIBILITY' | 'URBAN_CLEANING' | 'PUBLIC_LIGHTING';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueSource = 'AI' | 'CITIZEN' | 'AGENT';

// VALIDATION aparece no histórico enquanto uma detecção da IA aguarda validação humana
export type IssueStatus =
  'VALIDATION' | 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type IssueType = {
  id: number;
  name: string;
  category: IssueCategory;
  description: string | null;
  active: boolean;
};

export type IssueSummary = {
  id: number;
  title: string;
  issueType: string;
  category: IssueCategory;
  status: IssueStatus;
  severity: Severity | null;
  source: IssueSource;
  neighborhood: string | null;
  street: string | null;
  openingDate: string;
  resolutionDate: string | null;
  resolved: boolean;
};

export type IssueHistoryEntry = {
  previousStatus: IssueStatus | null;
  newStatus: IssueStatus;
  notes: string | null;
  changeDate: string;
};

export type IssueDetail = {
  summary: IssueSummary;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  history: IssueHistoryEntry[];
};

export type ChatHistoryEntry = {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
};

export type UpdateProfileInput = {
  name: string;
  password?: string;
};

// ---- API .NET: conferência do conserto pelo cidadão ----

// Ocorrência pública da API .NET (os ids não são os mesmos da API Java: são bancos separados)
export type PublicIssueReport = {
  id: number;
  title: string;
  description: string | null;
  issueTypeName: string;
  category: IssueCategory;
  severity: Severity | null;
  status: IssueStatus;
  openingDate: string;
  resolutionDate: string | null;
  street: string | null;
  neighborhood: string | null;
  detectionCount: number;
  lastSeenAt: string | null;
  citizenConfirmations: number;
  citizenContests: number;
};

export type CitizenFeedbackDecision = 'CONFIRM' | 'CONTEST';

export type CitizenFeedbackStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type CitizenFeedbackInput = {
  decision: CitizenFeedbackDecision;
  notes: string;
  latitude: number;
  longitude: number;
  photoUri: string;
};

export type CitizenFeedback = {
  id: number;
  issueReportId: number;
  decision: CitizenFeedbackDecision;
  status: CitizenFeedbackStatus;
  notes: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  message: string;
};

// Página no formato da API .NET (a primeira página é a 1)
export type DotnetPagedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

// Página no formato PagedModel do Spring
export type PagedResponse<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
