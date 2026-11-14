// Tipos do domínio, espelhando as tabelas do modelo relacional (USER, ISSUE_REPORT, CAMERA...)
// como a API Java devolve em JSON (camelCase).

export type UserType = 'CITIZEN' | 'MANAGER';

export type User = {
  id: number;
  name: string;
  email: string;
  userType: UserType;
  registrationDate: string;
};

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueSource = 'CITIZEN' | 'CAMERA';

export type IssueType = {
  id: number;
  name: string;
  category: string;
  description?: string | null;
};

export type MonitoringPoint = {
  id: number;
  street: string;
  streetNumber?: string | null;
  neighborhood?: string | null;
  city: string;
  latitude: number;
  longitude: number;
  description?: string | null;
};

export type Camera = {
  id: number;
  cameraCode: string;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  monitoringPoint: MonitoringPoint;
};

export type IssueHistoryEntry = {
  id: number;
  previousStatus: IssueStatus | null;
  newStatus: IssueStatus;
  notes?: string | null;
  changeDate: string;
  changedBy?: string | null;
};

export type DetectionSummary = {
  id: number;
  confidenceScore: number;
  estimatedSeverity: Severity | null;
  description: string | null;
  aiModel: string;
  imageUrl?: string | null;
};

export type IssueReport = {
  id: number;
  title: string;
  description: string | null;
  source: IssueSource;
  severity: Severity | null;
  status: IssueStatus;
  openingDate: string;
  resolutionDate: string | null;
  issueType: IssueType;
  monitoringPoint: MonitoringPoint | null;
  reportedBy: { id: number; name: string } | null;
  detection: DetectionSummary | null;
  history?: IssueHistoryEntry[];
};

export type IssueReportInput = {
  title: string;
  description: string;
  severity: Severity;
  issueTypeId: number;
  monitoringPointId: number;
};

export type DetectionReviewStatus = 'PENDING' | 'CONFIRMED' | 'DISMISSED';

export type AiDetection = DetectionSummary & {
  reviewStatus: DetectionReviewStatus;
  detectionCoordinates?: string | null;
  analysis: {
    modelVersion?: string | null;
    analysisDate: string;
    processingTimeMs?: number | null;
  };
  capture: {
    id: number;
    captureDate: string;
    camera: Pick<Camera, 'id' | 'cameraCode'>;
    monitoringPoint: MonitoringPoint;
  };
  suggestedIssueType: IssueType | null;
  issueReportId: number | null;
};

export type ScheduleFrequency = 'WEEKLY' | 'MONTHLY';

export type CaptureSchedule = {
  id: number;
  frequency: ScheduleFrequency;
  weekday: number | null; // 1 = segunda ... 7 = domingo (frequência semanal)
  dayOfMonth: number | null; // 1..28 (frequência mensal)
  executionTime: string; // HH:mm
  startDate: string; // yyyy-MM-dd
  endDate: string | null;
  isActive: boolean;
  camera: Camera;
};

export type CaptureScheduleInput = {
  cameraId: number;
  frequency: ScheduleFrequency;
  weekday: number | null;
  dayOfMonth: number | null;
  executionTime: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
};

export type DashboardSummary = {
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  pendingDetections: number;
  activeSchedules: number;
  myOpenIssues: number;
};

// Formato de página do Spring Data (Page<T>)
export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
};
