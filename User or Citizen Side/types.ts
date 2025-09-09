
export enum View {
  Map = 'map',
  Report = 'report',
  Leaderboard = 'leaderboard',
  Complaints = 'complaints',
}

export type PotholeStatus = 'Reported' | 'Under Review' | 'Repaired';
export type PotholeSeverity = 'Low' | 'Medium' | 'High' | 'Unknown';

export interface Pothole {
  id: string;
  location: { lat: number; lng: number };
  notes: string;
  timestamp: Date;
  status: PotholeStatus;
  reporterId: string;
  severity: PotholeSeverity;
  contains_water: boolean;
  description: string;
}

export interface User {
  uid: string;
  score: number;
  reports: number;
}

export interface AnalyzedPotholeData {
  is_pothole: boolean;
  severity: PotholeSeverity;
  contains_water: boolean;
  description: string;
}
