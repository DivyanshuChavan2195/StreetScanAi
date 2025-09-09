
import React from 'react';
import { Report, Status, DangerLevel, SortConfig } from '../types';
import { DANGER_LEVEL_COLORS, STATUS_COLORS } from '../constants';
import { ChevronDownIcon, ChevronUpIcon } from './icons/Icons';
import { PaginationControls } from './PaginationControls';

interface ReportTableProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  sortConfig: SortConfig | null;
  setSortConfig: (config: SortConfig | null) => void;
  selectedReportIds: string[];
  onToggleReportSelection: (reportId: string) => void;
  onToggleAllReportsSelection: () => void;
  areAllVisibleReportsSelected: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

type SortableKeys = keyof Report | 'location' | 'dangerScore';

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onSelectReport,
  sortConfig,
  setSortConfig,
  selectedReportIds,
  onToggleReportSelection,
  onToggleAllReportsSelection,
  areAllVisibleReportsSelected,
  currentPage,
  totalPages,
  onPageChange,
  totalItems
}) => {
  
  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronDownIcon className="w-4 h-4 text-gray-400 invisible group-hover:visible" />;
    }
    return sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"
                    checked={areAllVisibleReportsSelected}
                    onChange={onToggleAllReportsSelection}
                    aria-label="Select all reports on this page"
                  />
                </div>
              </th>
              {['ID', 'Location', 'Danger Score', 'Danger Level', 'Status', 'Actions'].map((header, index) => {
                 const sortKey = (['id', 'location', 'dangerScore', 'dangerLevel', 'status'] as SortableKeys[])[index];
                 return (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     {sortKey ? (
                        <button onClick={() => requestSort(sortKey)} className="group flex items-center space-x-1 w-full text-left">
                            <span>{header}</span>
                            {getSortIcon(sortKey)}
                        </button>
                    ) : (
                        <span>{header}</span>
                    )}
                  </th>
                 );
              })}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
            {reports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"
                      checked={selectedReportIds.includes(report.id)}
                      onChange={() => onToggleReportSelection(report.id)}
                      aria-label={`Select report ${report.id.substring(0,8)}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{report.id.substring(0, 8)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{report.location.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">{report.dangerScore.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${DANGER_LEVEL_COLORS[report.dangerLevel]}`}>
                    {report.dangerLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[report.status]}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onSelectReport(report)} className="text-brand-primary hover:text-brand-secondary font-bold">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={reports.length}
        />
      </div>
    </div>
  );
};
