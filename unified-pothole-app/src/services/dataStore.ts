import { Report, Status, DangerLevel, RoadType, Activity, User, Priority, InternalNote } from '../types';

const STORAGE_KEY = 'pothole-app-reports';

// Helper function to convert base64 or file to blob URL for image display
const createImageUrl = (imageData: string | File): string => {
  if (typeof imageData === 'string') {
    // If it's already a data URL, return as is
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    // If it's base64, convert to data URL
    return `data:image/jpeg;base64,${imageData}`;
  } else if (imageData instanceof File) {
    // If it's a File object, create blob URL
    return URL.createObjectURL(imageData);
  }
  return '';
};

// Mock data for initial population
const createMockReports = (): Report[] => [
  {
    id: 'rpt-001',
    location: {
      address: '123 Main Street, Downtown',
      lat: 18.6295,
      lng: 73.8213
    },
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 'demo-citizen-1',
      name: 'Demo Citizen'
    },
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#gray"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white">Pothole Image 1</text>
    </svg>`),
    description: 'Large pothole causing traffic slowdowns near the main junction.',
    notes: 'Very deep, needs immediate attention.',
    upvotes: 12,
    dangerScore: 8.5,
    dangerLevel: DangerLevel.High,
    roadType: RoadType.Arterial,
    status: Status.Submitted,
    priority: Priority.High,
    internalNotes: [],
    activityLog: [
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        message: 'Report created by citizen',
        type: 'creation'
      }
    ],
    contains_water: true
  },
  {
    id: 'rpt-002',
    location: {
      address: '456 Oak Avenue, Residential Area',
      lat: 18.6180,
      lng: 73.8050
    },
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    user: {
      id: 'demo-citizen-1',
      name: 'Demo Citizen'
    },
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#555"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white">Pothole Image 2</text>
    </svg>`),
    description: 'Cluster of smaller potholes on residential street.',
    notes: '',
    upvotes: 6,
    dangerScore: 5.2,
    dangerLevel: DangerLevel.Medium,
    roadType: RoadType.Residential,
    status: Status.Resolved,
    priority: Priority.Medium,
    assignedTo: 'demo-employee-1',
    assignedToName: 'Demo Employee',
    internalNotes: [
      {
        id: 'note-001',
        noteText: 'Repair crew dispatched. Materials ordered.',
        authorId: 'demo-employee-1',
        authorName: 'Demo Employee',
        timestamp: new Date(Date.now() - 43200000).toISOString()
      }
    ],
    worker: 'John Smith',
    activityLog: [
      {
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        message: 'Report created by citizen',
        type: 'creation'
      },
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        message: 'Status changed to "Resolved"',
        type: 'status_change'
      }
    ],
    contains_water: false
  },
  {
    id: 'rpt-003',
    location: {
      address: '789 School Road, Near Elementary School',
      lat: 18.6350,
      lng: 73.8150
    },
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    user: {
      id: 'demo-citizen-1',
      name: 'Demo Citizen'
    },
    imageUrl: 'data:image/svg+xml;base64,' + btoa(`<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#666"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white">Pothole Image 3</text>
    </svg>`),
    description: 'Pothole forming near speed bump in school zone.',
    notes: 'Safety concern for children walking to school.',
    upvotes: 18,
    dangerScore: 7.0,
    dangerLevel: DangerLevel.Medium,
    roadType: RoadType.Residential,
    status: Status.InProgress,
    priority: Priority.Medium,
    assignedTo: 'demo-employee-1',
    assignedToName: 'Demo Employee',
    internalNotes: [],
    worker: 'Mike Johnson',
    activityLog: [
      {
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        message: 'Report created by citizen',
        type: 'creation'
      },
      {
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        message: 'Status changed to "In Progress"',
        type: 'status_change'
      },
      {
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        message: 'Assigned to Demo Employee',
        type: 'assignment'
      }
    ],
    contains_water: false
  }
];

export class DataStore {
  private reports: Report[] = [];
  private subscribers: Array<(reports: Report[]) => void> = [];

  constructor() {
    this.loadReports();
  }

  // Load reports from localStorage or initialize with mock data
  private loadReports(): void {
    try {
      const storedReports = localStorage.getItem(STORAGE_KEY);
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      } else {
        // Initialize with mock data if no stored data exists
        this.reports = createMockReports();
        this.saveReports();
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      this.reports = createMockReports();
      this.saveReports();
    }
  }

  // Save reports to localStorage
  private saveReports(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('Error saving reports:', error);
    }
  }

  // Notify subscribers of data changes
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback([...this.reports]));
  }

  // Subscribe to data changes
  subscribe(callback: (reports: Report[]) => void): () => void {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Get all reports
  getAllReports(): Report[] {
    return [...this.reports];
  }

  // Get reports by user ID (for citizen view)
  getReportsByUser(userId: string): Report[] {
    return this.reports.filter(report => report.user.id === userId);
  }

  // Add a new report (from citizen submission)
  addReport(reportData: {
    location: { lat: number; lng: number; address?: string };
    imageData: string | File;
    description: string;
    notes?: string;
    user: User;
    severity: DangerLevel;
    contains_water: boolean;
  }): Report {
    const imageUrl = createImageUrl(reportData.imageData);
    
    const newReport: Report = {
      id: `rpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      location: {
        lat: reportData.location.lat,
        lng: reportData.location.lng,
        address: reportData.location.address || `${reportData.location.lat}, ${reportData.location.lng}`
      },
      timestamp: new Date().toISOString(),
      user: {
        id: reportData.user.uid,
        name: reportData.user.name
      },
      imageUrl,
      description: reportData.description,
      notes: reportData.notes || '',
      upvotes: 1, // Start with 1 upvote from reporter
      dangerScore: this.calculateDangerScore(reportData.severity, reportData.contains_water),
      dangerLevel: reportData.severity,
      roadType: RoadType.Residential, // Default, could be determined by location
      status: Status.Submitted,
      priority: Priority.Medium, // Default priority
      internalNotes: [],
      activityLog: [
        {
          timestamp: new Date().toISOString(),
          message: `Report created by ${reportData.user.name}`,
          type: 'creation'
        }
      ],
      severity: reportData.severity,
      contains_water: reportData.contains_water
    };

    this.reports.unshift(newReport); // Add to beginning
    this.saveReports();
    this.notifySubscribers();
    
    return newReport;
  }

  // Update report (for employee actions)
  updateReport(reportId: string, updates: Partial<Report>): Report | null {
    const index = this.reports.findIndex(report => report.id === reportId);
    if (index === -1) return null;

    const originalReport = this.reports[index];
    const updatedReport = { ...originalReport, ...updates };

    // Add activity log entries for specific changes
    const newActivities: Activity[] = [];
    
    if (updates.status && updates.status !== originalReport.status) {
      newActivities.push({
        timestamp: new Date().toISOString(),
        message: `Status changed from "${originalReport.status}" to "${updates.status}"`,
        type: 'status_change'
      });
    }

    if (updates.assignedTo && updates.assignedTo !== originalReport.assignedTo) {
      newActivities.push({
        timestamp: new Date().toISOString(),
        message: `Assigned to ${updates.assignedToName || updates.assignedTo}`,
        type: 'assignment'
      });
    }

    if (updates.priority && updates.priority !== originalReport.priority) {
      newActivities.push({
        timestamp: new Date().toISOString(),
        message: `Priority changed to ${updates.priority}`,
        type: 'priority_change'
      });
    }

    // Legacy worker field support
    if (updates.worker && updates.worker !== originalReport.worker) {
      newActivities.push({
        timestamp: new Date().toISOString(),
        message: `Assigned to ${updates.worker}`,
        type: 'assignment'
      });
    }

    if (newActivities.length > 0) {
      updatedReport.activityLog = [...newActivities, ...originalReport.activityLog];
    }

    this.reports[index] = updatedReport;
    this.saveReports();
    this.notifySubscribers();

    return updatedReport;
  }

  // Get report by ID
  getReportById(reportId: string): Report | null {
    return this.reports.find(report => report.id === reportId) || null;
  }

  // Update multiple reports (bulk operations)
  updateMultipleReports(reportIds: string[], updates: Partial<Report>): Report[] {
    const updatedReports: Report[] = [];
    
    reportIds.forEach(reportId => {
      const updated = this.updateReport(reportId, updates);
      if (updated) updatedReports.push(updated);
    });

    return updatedReports;
  }

  // Calculate danger score based on severity and other factors
  private calculateDangerScore(severity: DangerLevel, hasWater: boolean): number {
    let baseScore: number;
    
    switch (severity) {
      case DangerLevel.Low: baseScore = 2; break;
      case DangerLevel.Medium: baseScore = 5; break;
      case DangerLevel.High: baseScore = 8; break;
      case DangerLevel.Critical: baseScore = 10; break;
      default: baseScore = 1;
    }

    // Add penalty for water-filled potholes
    if (hasWater) baseScore += 1;

    return Math.min(baseScore, 10); // Cap at 10
  }

  // Get statistics for dashboard
  getStatistics() {
    const total = this.reports.length;
    const critical = this.reports.filter(r => r.dangerLevel === DangerLevel.Critical).length;
    const underReview = this.reports.filter(r => r.status === Status.UnderReview).length;
    const fixed = this.reports.filter(r => r.status === Status.Fixed).length;
    const recent = this.reports.filter(r => {
      const reportDate = new Date(r.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return reportDate > weekAgo;
    }).length;

    return {
      total,
      critical,
      underReview,
      fixed,
      recent
    };
  }

  // Clear all data (for testing)
  clearAllData(): void {
    this.reports = [];
    this.saveReports();
    this.notifySubscribers();
  }

  // Reset to mock data
  resetToMockData(): void {
    this.reports = createMockReports();
    this.saveReports();
    this.notifySubscribers();
  }

  // Add internal note to a report
  addInternalNote(reportId: string, noteText: string, authorId: string, authorName: string): boolean {
    const report = this.getReportById(reportId);
    if (!report) return false;

    const newNote: InternalNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      noteText,
      authorId,
      authorName,
      timestamp: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...report.internalNotes];
    const updatedReport = {
      ...report,
      internalNotes: updatedNotes,
      activityLog: [
        {
          timestamp: new Date().toISOString(),
          message: `Internal note added by ${authorName}`,
          type: 'note_added' as const
        },
        ...report.activityLog
      ]
    };

    const index = this.reports.findIndex(r => r.id === reportId);
    if (index > -1) {
      this.reports[index] = updatedReport;
      this.saveReports();
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // Get filtered reports
  getFilteredReports(filters: {
    status?: string;
    assignedTo?: string;
    priority?: string;
    search?: string;
  }): Report[] {
    let filtered = [...this.reports];

    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.assignedTo && filters.assignedTo !== 'All') {
      if (filters.assignedTo === 'Unassigned') {
        filtered = filtered.filter(report => !report.assignedTo);
      } else {
        filtered = filtered.filter(report => report.assignedTo === filters.assignedTo);
      }
    }

    if (filters.priority && filters.priority !== 'All') {
      filtered = filtered.filter(report => report.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.id.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        (report.location.address || '').toLowerCase().includes(searchLower) ||
        report.user.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  // Get reports assigned to specific employee
  getReportsByEmployee(employeeId: string): Report[] {
    return this.reports.filter(report => report.assignedTo === employeeId);
  }

  // Get reports by status
  getReportsByStatus(status: Status): Report[] {
    return this.reports.filter(report => report.status === status);
  }

  // Get reports by priority
  getReportsByPriority(priority: Priority): Report[] {
    return this.reports.filter(report => report.priority === priority);
  }

  // Update statistics to use new status values
  getEnhancedStatistics() {
    const total = this.reports.length;
    const submitted = this.reports.filter(r => r.status === Status.Submitted).length;
    const acknowledged = this.reports.filter(r => r.status === Status.Acknowledged).length;
    const inProgress = this.reports.filter(r => r.status === Status.InProgress).length;
    const resolved = this.reports.filter(r => r.status === Status.Resolved).length;
    const rejected = this.reports.filter(r => r.status === Status.Rejected).length;
    const critical = this.reports.filter(r => r.dangerLevel === DangerLevel.Critical || r.priority === Priority.Critical).length;
    const highPriority = this.reports.filter(r => r.priority === Priority.High).length;
    const unassigned = this.reports.filter(r => !r.assignedTo).length;

    return {
      total,
      submitted,
      acknowledged, 
      inProgress,
      resolved,
      rejected,
      critical,
      highPriority,
      unassigned,
      // Legacy for backward compatibility
      underReview: acknowledged,
      fixed: resolved,
      recent: this.reports.filter(r => {
        const reportDate = new Date(r.timestamp);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return reportDate > weekAgo;
      }).length
    };
  }
}

// Create singleton instance
export const dataStore = new DataStore();
