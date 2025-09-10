import React, { useState, useEffect } from 'react';
import { Report, Status, Priority, User } from '../../types';
import { dataStore } from '../../services/dataStore';

interface ReportDetailModalProps {
  report: Report;
  employees: User[];
  currentUser: User;
  onClose: () => void;
  onUpdate: (updatedReport: Report) => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  employees,
  currentUser,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'activity'>('details');
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const leaflet = await import('leaflet');
        setL(leaflet.default);
      }
    };
    loadLeaflet();
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!L || !report.location.lat || !report.location.lng) return;

    const mapContainer = document.getElementById('report-detail-map');
    if (!mapContainer) return;

    // Clean up existing map
    if (map) {
      map.remove();
    }

    const newMap = L.map('report-detail-map').setView([report.location.lat, report.location.lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    // Add marker for the report location
    L.marker([report.location.lat, report.location.lng])
      .addTo(newMap)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${report.location.address}</h3>
          <p class="text-sm">${report.description}</p>
        </div>
      `);

    setMap(newMap);

    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  }, [L, report.location]);

  const handleStatusChange = (newStatus: Status) => {
    const updatedReport = dataStore.updateReport(report.id, { status: newStatus });
    if (updatedReport) {
      onUpdate(updatedReport);
    }
  };

  const handleAssignmentChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.uid === employeeId);
    const updatedReport = dataStore.updateReport(report.id, {
      assignedTo: employeeId === 'unassigned' ? undefined : employeeId,
      assignedToName: employeeId === 'unassigned' ? undefined : employee?.name
    });
    if (updatedReport) {
      onUpdate(updatedReport);
    }
  };

  const handlePriorityChange = (newPriority: Priority) => {
    const updatedReport = dataStore.updateReport(report.id, { priority: newPriority });
    if (updatedReport) {
      onUpdate(updatedReport);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const success = dataStore.addInternalNote(
      report.id,
      newNote.trim(),
      currentUser.uid,
      currentUser.name
    );

    if (success) {
      const updatedReport = dataStore.getReportById(report.id);
      if (updatedReport) {
        onUpdate(updatedReport);
      }
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Submitted: return 'bg-red-100 text-red-800 border-red-200';
      case Status.Acknowledged: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Status.InProgress: return 'bg-blue-100 text-blue-800 border-blue-200';
      case Status.Resolved: return 'bg-green-100 text-green-800 border-green-200';
      case Status.Rejected: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.Critical: return 'text-red-600 bg-red-50 border-red-200';
      case Priority.High: return 'text-orange-600 bg-orange-50 border-orange-200';
      case Priority.Medium: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case Priority.Low: return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
            <p className="text-gray-600">ID: {report.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light"
          >
            ×
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'details', label: 'Report Details', icon: '📋' },
              { key: 'notes', label: 'Internal Notes', icon: '📝', count: report.internalNotes?.length || 0 },
              { key: 'activity', label: 'Activity Log', icon: '📅', count: report.activityLog?.length || 0 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Report Information */}
              <div className="space-y-6">
                {/* Report Image */}
                {report.imageUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Submitted Photo</h3>
                    <img
                      src={report.imageUrl}
                      alt="Pothole report"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}

                {/* Report Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Report Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{report.location.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reported by:</span>
                      <span className="font-medium">{report.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">{new Date(report.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danger Level:</span>
                      <span className="font-medium">{report.dangerLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contains Water:</span>
                      <span className="font-medium">{report.contains_water ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upvotes:</span>
                      <span className="font-medium">{report.upvotes}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700">{report.description}</p>
                  {report.notes && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Additional Notes:</h4>
                      <p className="text-gray-600 italic">"{report.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Management and Map */}
              <div className="space-y-6">
                {/* Management Controls */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold mb-4">Management Controls</h3>
                  
                  {/* Status */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(e.target.value as Status)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={Status.Submitted}>Submitted</option>
                      <option value={Status.Acknowledged}>Acknowledged</option>
                      <option value={Status.InProgress}>In Progress</option>
                      <option value={Status.Resolved}>Resolved</option>
                      <option value={Status.Rejected}>Rejected</option>
                    </select>
                    <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.status)}`}>
                      Current: {report.status}
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                    <select
                      value={report.assignedTo || 'unassigned'}
                      onChange={(e) => handleAssignmentChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="unassigned">Unassigned</option>
                      {employees.map((employee) => (
                        <option key={employee.uid} value={employee.uid}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                    {report.assignedToName && (
                      <div className="mt-2 text-sm text-blue-600">
                        Currently assigned to: {report.assignedToName}
                      </div>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(Priority).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => handlePriorityChange(priority)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            report.priority === priority
                              ? getPriorityColor(priority)
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Location</h3>
                  <div
                    id="report-detail-map"
                    className="h-64 rounded-lg"
                    style={{ minHeight: '256px' }}
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Coordinates: {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Internal Notes</h3>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Note
                </button>
              </div>

              {isAddingNote && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Add Internal Note</h4>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      Save Note
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingNote(false);
                        setNewNote('');
                      }}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {report.internalNotes && report.internalNotes.length > 0 ? (
                  report.internalNotes.map((note) => (
                    <div key={note.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900">{note.authorName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.noteText}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No internal notes yet</p>
                    <p className="text-sm">Add notes to communicate with your team about this report</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Activity Log</h3>
              <div className="space-y-3">
                {report.activityLog && report.activityLog.length > 0 ? (
                  report.activityLog.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'creation' ? 'bg-green-500' :
                        activity.type === 'status_change' ? 'bg-blue-500' :
                        activity.type === 'assignment' ? 'bg-purple-500' :
                        activity.type === 'note_added' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.message}</p>
                        <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No activity logged yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
