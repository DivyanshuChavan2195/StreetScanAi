
import React, { useMemo, useState } from 'react';
import { Report, Status } from '../types';
import { KanbanCard } from './KanbanCard';
import { STATUS_OPTIONS } from '../constants';

interface KanbanBoardProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onUpdateReportStatus: (reportId: string, newStatus: Status) => void;
}

const statusOrder: Status[] = [
    Status.Reported,
    Status.UnderReview,
    Status.Assigned,
    Status.Fixed,
    Status.Rejected
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ reports, onSelectReport, onUpdateReportStatus }) => {
  const [draggedReportId, setDraggedReportId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<Status | null>(null);

  const reportsByStatus = useMemo(() => {
    const grouped = {} as Record<Status, Report[]>;
    statusOrder.forEach(status => {
      grouped[status] = [];
    });
    reports.forEach(report => {
      if (grouped[report.status]) {
        grouped[report.status].push(report);
      }
    });
    return grouped;
  }, [reports]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, report: Report) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', report.id);
    setDraggedReportId(report.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault();
    if (reports.find(r => r.id === draggedReportId)?.status !== status) {
        setTargetStatus(status);
    }
  };

  const handleDragLeave = () => {
    setTargetStatus(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Status) => {
    e.preventDefault();
    const reportId = e.dataTransfer.getData('text/plain');
    const originalStatus = reports.find(r => r.id === reportId)?.status;
    if (reportId && newStatus !== originalStatus) {
      onUpdateReportStatus(reportId, newStatus);
    }
    setDraggedReportId(null);
    setTargetStatus(null);
  };

  const handleDragEnd = () => {
    setDraggedReportId(null);
    setTargetStatus(null);
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {statusOrder.map(status => (
        <div
          key={status}
          onDragOver={(e) => handleDragOver(e, status)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status)}
          className={`flex-shrink-0 w-72 bg-gray-100 dark:bg-dark-bg rounded-lg shadow-inner transition-colors duration-200 ${targetStatus === status ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}
        >
          <div className="p-3 border-b border-gray-200 dark:border-dark-border">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex justify-between items-center">
              <span>{status}</span>
              <span className="text-sm font-normal bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5">
                {reportsByStatus[status].length}
              </span>
            </h3>
          </div>
          <div className="p-2 space-y-3 min-h-[200px]">
            {reportsByStatus[status].map(report => (
              <KanbanCard
                key={report.id}
                report={report}
                isDragging={draggedReportId === report.id}
                onDragStart={(e) => handleDragStart(e, report)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectReport(report)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
