export enum Status {
  Reported = 'Reported',
  UnderReview = 'Under Review',
  Assigned = 'Assigned',
  Fixed = 'Fixed',
  Rejected = 'Rejected',
}

export enum DangerLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum RoadType {
  Highway = 'Highway',
  Arterial = 'Arterial',
  Residential = 'Residential',
  Alley = 'Alley',
}

export interface Activity {
  timestamp: string;
  message: string;
  type: 'creation' | 'status_change' | 'assignment';
}

export interface Report {
  id: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  photoUrl: string;
  description: string;
  upvotes: number;
  dangerScore: number;
  dangerLevel: DangerLevel;
  roadType: RoadType;
  status: Status;
  worker?: string;
  activityLog: Activity[];
}

export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

export enum WorkerStatus {
    Active = 'Active',
    OnLeave = 'On Leave',
    Inactive = 'Inactive',
}

export interface Worker {
    id: string;
    name: string;
    avatarUrl: string;
    status: WorkerStatus;
    joinDate: string;
}

export interface AIAssessment {
  priorityAssessment: string;
  suggestedAction: string;
  safetyProtocol: string;
  visualAnalysis: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface SortConfig {
  key: keyof Report | 'location' | 'dangerScore';
  direction: 'asc' | 'desc';
}

export interface SavedView {
  id: string;
  name: string;
  filters: {
    status: string;
    danger: string;
    searchQuery: string;
    worker: string;
  };
  sort: SortConfig | null;
}

export interface Notification {
  id: string;
  message: string;
  reportId: string;
  reportAddress: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'task_fixed' | 'task_rejected' | 'status_change' | 'bulk_update';
}
