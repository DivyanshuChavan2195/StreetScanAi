// Unified types for the Pothole Management System
// Combining structures from both Citizen and Employee sides

// Authentication and User types
export interface User {
  uid: string;
  email: string;
  role: 'citizen' | 'employee';
  name: string;
  score?: number; // For citizens
  reports?: number; // For citizens
}

// Views and Navigation
export enum View {
  Map = 'map',
  Report = 'report',
  Leaderboard = 'leaderboard',
  Complaints = 'complaints',
}

// Report Status (unified from both sides)
export enum Status {
  Submitted = 'Submitted',
  Acknowledged = 'Acknowledged', 
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  // Legacy statuses for backward compatibility
  Reported = 'Submitted',
  UnderReview = 'Acknowledged',
  Assigned = 'In Progress', 
  Fixed = 'Resolved',
  Rejected = 'Rejected',
}

// Danger/Severity levels (unified)
export enum DangerLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
  Unknown = 'Unknown',
}

export enum RoadType {
  Highway = 'Highway',
  Arterial = 'Arterial',
  Residential = 'Residential',
  Alley = 'Alley',
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium', 
  High = 'High',
  Critical = 'Critical',
}

// Activity log for reports
export interface Activity {
  timestamp: string;
  message: string;
  type: 'creation' | 'status_change' | 'assignment' | 'note_added' | 'priority_change';
}

// Internal notes for employee management
export interface InternalNote {
  id: string;
  noteText: string;
  authorId: string;
  authorName: string;
  timestamp: string;
}

// Main Report interface (combining Pothole and Report structures)
export interface Report {
  id: string;
  location: {
    address?: string;
    lat: number;
    lng: number;
  };
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  imageUrl?: string; // Stored in memory as base64 or blob URL
  photoUrl?: string; // Alternative field name for compatibility
  description: string;
  notes?: string; // Additional notes from citizen
  upvotes: number;
  dangerScore: number;
  dangerLevel: DangerLevel;
  roadType?: RoadType;
  status: Status;
  // Enhanced management fields
  assignedTo?: string; // Employee UID assigned to this report
  assignedToName?: string; // Employee name for display
  priority: Priority;
  internalNotes: InternalNote[]; // Employee notes
  // Legacy fields
  worker?: string; // For backward compatibility
  activityLog: Activity[];
  severity?: DangerLevel; // For backward compatibility with citizen side
  contains_water?: boolean;
}

// AI Analysis data from image
export interface AnalyzedPotholeData {
  is_pothole: boolean;
  severity: DangerLevel;
  contains_water: boolean;
  description: string;
}

// Worker management
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

// Chart and Analytics data
export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

// AI Assistant
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

// Table sorting
export interface SortConfig {
  key: keyof Report | 'location' | 'dangerScore';
  direction: 'asc' | 'desc';
}

// Saved views for employees
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

// Notifications
export interface Notification {
  id: string;
  message: string;
  reportId: string;
  reportAddress: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'task_fixed' | 'task_rejected' | 'status_change' | 'bulk_update';
}

// App navigation
export type Page = 'dashboard' | 'analytics' | 'heatmap' | 'teams' | 'settings';
export type ActiveView = 'list' | 'map' | 'board';
export type Theme = 'light' | 'dark';

// Type aliases for backward compatibility
export type PotholeStatus = Status;
export type PotholeSeverity = DangerLevel;
export type Pothole = Report; // For citizen side compatibility
