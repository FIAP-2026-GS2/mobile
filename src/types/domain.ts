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
