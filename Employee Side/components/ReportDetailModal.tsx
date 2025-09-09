
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Report, Status, AIAssessment, Activity } from '../types';
import { DANGER_LEVEL_COLORS, STATUS_COLORS, STATUS_OPTIONS, WORKERS } from '../constants';
import { XIcon, SparklesIcon, BrainCircuitIcon } from './icons/Icons';
import { generateRepairBrief } from '../services/geminiService';
import L from 'leaflet';

interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
  onUpdate: (report: Report) => void;
}

const loadingMessages = [
    "Analyzing pothole image...",
    "Assessing road type and conditions...",
    "Correlating with danger score...",
    "Generating safety protocols...",
    "Compiling repair brief...",
];

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Status>(report.status);
  const [assignedWorker, setAssignedWorker] = useState<string>(report.worker || 'Unassigned');
  const [aiAssessment, setAIAssessment] = useState<AIAssessment | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState<boolean>(false);
  const [errorBrief, setErrorBrief] = useState<string>('');
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);


  useEffect(() => {
    let interval: number;
    if (isLoadingBrief) {
        let i = 0;
        setCurrentLoadingMessage(loadingMessages[i]);
        interval = window.setInterval(() => {
            i = (i + 1) % loadingMessages.length;
            setCurrentLoadingMessage(loadingMessages[i]);
        }, 2000);
    }
    return () => window.clearInterval(interval);
  }, [isLoadingBrief]);

  useEffect(() => {
      if(mapContainerRef.current && report) {
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([report.location.lat, report.location.lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        } else {
            mapRef.current.setView([report.location.lat, report.location.lng], 16);
        }
        
        if (markerRef.current) {
            markerRef.current.remove();
        }
        
        markerRef.current = L.marker([report.location.lat, report.location.lng]).addTo(mapRef.current);
        markerRef.current.bindPopup(`<b>${report.location.address}</b>`).openPopup();

        setTimeout(() => mapRef.current?.invalidateSize(), 200);
      }
  }, [report]);
  
  const handleSaveChanges = () => {
    let updatedReport = { ...report };
    let activityMessage = '';
    let activityType: Activity['type'] = 'status_change';

    if (report.status !== currentStatus) {
        activityMessage = `Status changed from "${report.status}" to "${currentStatus}".`;
        activityType = 'status_change';
        updatedReport.status = currentStatus;
    }
    
    const newWorker = assignedWorker === 'Unassigned' ? undefined : assignedWorker;
    if (report.worker !== newWorker) {
        activityMessage = `Assigned to ${newWorker || 'Unassigned'}.`;
        activityType = 'assignment';
        updatedReport.worker = newWorker;
    }

    if (activityMessage) {
        const newActivity: Activity = {
            timestamp: new Date().toISOString(),
            message: activityMessage,
            type: activityType,
        };
        updatedReport.activityLog = [newActivity, ...report.activityLog];
    }
    
    onUpdate(updatedReport);
    setIsEditing(false);
  };

  const handleGenerateBrief = useCallback(async () => {
    setIsLoadingBrief(true);
    setAIAssessment(null);
    setErrorBrief('');
    try {
      const brief = await generateRepairBrief(report);
      setAIAssessment(brief);
    } catch (error) {
      console.error("Failed to generate AI brief:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setErrorBrief(errorMessage);
    } finally {
      setIsLoadingBrief(false);
    }
  }, [report]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b dark:border-dark-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border">
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Image, Map and Details */}
          <div className="space-y-4">
            <div>
              <img src={report.photoUrl} alt="Pothole" className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>

            <div ref={mapContainerRef} className="w-full h-64 rounded-lg shadow-md z-0"></div>

            <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Report Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-gray-500 dark:text-gray-400">ID:</strong> <span className="font-mono">{report.id}</span></p>
                  <p><strong className="text-gray-500 dark:text-gray-400">Address:</strong> {report.location.address}</p>
                  <p><strong className="text-gray-500 dark:text-gray-400">Reported By:</strong> {report.user.name}</p>
                  <p><strong className="text-gray-500 dark:text-gray-400">Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
                  <p><strong className="text-gray-500 dark:text-gray-400">Description:</strong> "{report.description}"</p>
                  <p><strong className="text-gray-500 dark:text-gray-400">Upvotes:</strong> {report.upvotes}</p>
                </div>
            </div>
          </div>

          {/* Right Column: Status and AI */}
          <div>
            <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Status & Analysis</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Danger Score: {report.dangerScore.toFixed(2)}</span>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${DANGER_LEVEL_COLORS[report.dangerLevel]}`}>
                  {report.dangerLevel}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  {isEditing ? (
                    <select value={currentStatus} onChange={e => setCurrentStatus(e.target.value as Status)} className="w-full rounded-md border-gray-300 shadow-sm dark:bg-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[report.status]}`}>{report.status}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Worker</label>
                  {isEditing ? (
                     <select value={assignedWorker} onChange={e => setAssignedWorker(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm dark:bg-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option>Unassigned</option>
                        {WORKERS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  ) : (
                    <span>{report.worker || 'Unassigned'}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={handleGenerateBrief}
                disabled={isLoadingBrief}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoadingBrief ? 'Generating...' : 'Generate AI Repair Brief'}
              </button>
            </div>

            { (isLoadingBrief || aiAssessment || errorBrief) && 
              <div className="mt-4 bg-blue-50 dark:bg-dark-bg p-4 rounded-lg">
                <h4 className="flex items-center font-semibold text-md mb-2 text-blue-800 dark:text-blue-300">
                    <BrainCircuitIcon className="w-6 h-6 mr-2" />
                    AI-Generated Assessment
                </h4>
                {isLoadingBrief && 
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="transition-opacity duration-500">{currentLoadingMessage}</span>
                  </div>
                }
                {errorBrief && <p className="text-sm text-red-600 dark:text-red-400">{errorBrief}</p>}
                {aiAssessment && (
                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <div>
                            <strong className="block text-gray-800 dark:text-gray-100">Visual Analysis:</strong>
                            <p>{aiAssessment.visualAnalysis}</p>
                        </div>
                         <div>
                            <strong className="block text-gray-800 dark:text-gray-100">Priority Assessment:</strong>
                            <p>{aiAssessment.priorityAssessment}</p>
                        </div>
                         <div>
                            <strong className="block text-gray-800 dark:text-gray-100">Suggested Action:</strong>
                            <p>{aiAssessment.suggestedAction}</p>
                        </div>
                         <div>
                            <strong className="block text-gray-800 dark:text-gray-100">Safety Protocol:</strong>
                            <p>{aiAssessment.safetyProtocol}</p>
                        </div>
                    </div>
                )}
              </div>
            }
          </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t dark:border-dark-border bg-gray-50 dark:bg-gray-900/50">
          {isEditing ? (
            <div className="space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border">Cancel</button>
              <button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Save Changes</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary">
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};