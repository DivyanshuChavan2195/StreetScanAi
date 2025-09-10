import React, { useState, useEffect } from 'react';
import { User, Report, Status, Priority } from '../../types';
import { dataStore } from '../../services/dataStore';
import ReportDetailModal from './ReportDetailModal';

interface EmployeeAppProps {
  user: User;
  onLogout: () => void;
}

const EmployeeApp: React.FC<EmployeeAppProps> = ({ user, onLogout }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<User[]>([]);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Load reports and employees
    const allReports = dataStore.getAllReports();
    // For now, use demo employee data - in a real app, load from authService
    const employeeUsers = [{ uid: 'demo-employee-1', name: 'Demo Employee', email: 'employee@demo.com', role: 'employee' as const }];
    
    setReports(allReports);
    setEmployees(employeeUsers);
    setLoading(false);

    // Subscribe to changes
    const unsubscribe = dataStore.subscribe((updatedReports) => {
      setReports(updatedReports);
    });

    return unsubscribe;
  }, []);

  // Apply filters whenever reports or filters change
  useEffect(() => {
    const filtered = dataStore.getFilteredReports({
      status: statusFilter !== 'All' ? statusFilter : undefined,
      assignedTo: assignmentFilter !== 'All' ? assignmentFilter : undefined,
      priority: priorityFilter !== 'All' ? priorityFilter : undefined,
      search: searchQuery || undefined
    });
    setFilteredReports(filtered);
  }, [reports, statusFilter, assignmentFilter, priorityFilter, searchQuery]);

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  const handleReportUpdate = (updatedReport: Report) => {
    setSelectedReport(updatedReport);
    // Reports will be updated via subscription
  };

  const statistics = dataStore.getEnhancedStatistics();

  const getStatusBadgeColor = (status: Status) => {
    switch (status) {
      case Status.Submitted: return 'bg-red-100 text-red-800';
      case Status.Acknowledged: return 'bg-yellow-100 text-yellow-800';
      case Status.InProgress: return 'bg-blue-100 text-blue-800';
      case Status.Resolved: return 'bg-green-100 text-green-800';
      case Status.Rejected: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.Critical: return 'text-red-600 font-bold';
      case Priority.High: return 'text-orange-600 font-semibold';
      case Priority.Medium: return 'text-yellow-600';
      case Priority.Low: return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading Employee Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PP</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Total</h3>
            <p className="text-2xl font-bold text-blue-600">{statistics.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Submitted</h3>
            <p className="text-2xl font-bold text-red-600">{statistics.submitted}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">In Progress</h3>
            <p className="text-2xl font-bold text-blue-600">{statistics.inProgress}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Resolved</h3>
            <p className="text-2xl font-bold text-green-600">{statistics.resolved}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Critical</h3>
            <p className="text-2xl font-bold text-red-600">{statistics.critical}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Unassigned</h3>
            <p className="text-2xl font-bold text-orange-600">{statistics.unassigned}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by ID, description, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value={Status.Submitted}>Submitted</option>
                <option value={Status.Acknowledged}>Acknowledged</option>
                <option value={Status.InProgress}>In Progress</option>
                <option value={Status.Resolved}>Resolved</option>
                <option value={Status.Rejected}>Rejected</option>
              </select>
            </div>
            
            {/* Assignment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment</label>
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Assignments</option>
                <option value="Unassigned">Unassigned</option>
                <option value={user.uid}>Assigned to Me</option>
                {employees.map((employee) => (
                  <option key={employee.uid} value={employee.uid}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Priorities</option>
                <option value={Priority.Critical}>Critical</option>
                <option value={Priority.High}>High</option>
                <option value={Priority.Medium}>Medium</option>
                <option value={Priority.Low}>Low</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reports</h2>
          <div className="space-y-4">
            {filteredReports.length > 0 ? filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                onClick={() => handleReportClick(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{report.location.address}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(report.priority || Priority.Medium)}`}>
                        {report.priority || 'Medium'} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>ID: {report.id}</span>
                      <span>Reported by: {report.user.name}</span>
                      <span>Severity: {report.dangerLevel}</span>
                      <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                      {report.assignedToName && (
                        <span className="text-blue-600">Assigned to: {report.assignedToName}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-1">
                    {report.contains_water && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        💧 Contains Water
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Click to view details
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No reports match your filters</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          employees={employees}
          currentUser={user}
          onClose={handleCloseModal}
          onUpdate={handleReportUpdate}
        />
      )}
    </div>
  );
};

export default EmployeeApp;
