
import React, { useState } from 'react';
import { Status } from '../types';
import { STATUS_OPTIONS } from '../constants';
import { CheckBadgeIcon } from './icons/Icons';

interface BulkActionsToolbarProps {
  selectedCount: number;
  workers: string[];
  onBulkUpdate: (action: 'status' | 'worker', value: string) => void;
  onClearSelection: () => void;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({ selectedCount, workers, onBulkUpdate, onClearSelection }) => {
  const [bulkStatus, setBulkStatus] = useState<Status | ''>('');
  const [bulkWorker, setBulkWorker] = useState<string>('');

  const handleApplyStatus = () => {
    if (bulkStatus) {
      onBulkUpdate('status', bulkStatus);
    }
  };

  const handleApplyWorker = () => {
    if (bulkWorker) {
      onBulkUpdate('worker', bulkWorker);
    }
  };

  return (
    <div className="w-full bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-center justify-between transition-all duration-300">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-bold text-blue-800 dark:text-blue-200">{selectedCount} items selected</span>
        <button onClick={onClearSelection} className="text-sm text-blue-600 hover:underline dark:text-blue-300">Clear selection</button>
      </div>
      <div className="flex items-center space-x-4">
        {/* Bulk Status Update */}
        <div className="flex items-center space-x-2">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as Status)}
            className="rounded-md border-gray-300 shadow-sm dark:bg-dark-bg dark:border-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            aria-label="Set status for selected items"
          >
            <option value="" disabled>Set Status...</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={handleApplyStatus}
            disabled={!bulkStatus}
            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <CheckBadgeIcon className="w-4 h-4 mr-1.5" />
            Apply
          </button>
        </div>
        {/* Divider */}
        <div className="h-6 w-px bg-blue-200 dark:bg-blue-700"></div>
        {/* Bulk Worker Assignment */}
        <div className="flex items-center space-x-2">
          <select
            value={bulkWorker}
            onChange={(e) => setBulkWorker(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm dark:bg-dark-bg dark:border-dark-border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            aria-label="Assign worker for selected items"
          >
            <option value="" disabled>Assign Worker...</option>
            <option value="Unassigned">Unassigned</option>
            {workers.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <button
            onClick={handleApplyWorker}
            disabled={!bulkWorker}
            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <CheckBadgeIcon className="w-4 h-4 mr-1.5" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
