
import React from 'react';
import { Report } from '../types';
import { DANGER_LEVEL_COLORS } from '../constants';

interface KanbanCardProps {
  report: Report;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

const borderColors: Record<string, string> = {
    'green-600': '#16a34a',
    'yellow-600': '#ca8a04',
    'orange-600': '#ea580c',
    'red-800': '#991b1b',
};

const getBorderColor = (className: string): string => {
    const colorClass = className.split(' ').find(c => c.startsWith('border-'));
    if (!colorClass) return '#ccc';
    const colorKey = colorClass.replace('border-', '');
    return borderColors[colorKey] || '#ccc';
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ report, isDragging, onDragStart, onDragEnd, onClick }) => {
  const dangerColorClasses = DANGER_LEVEL_COLORS[report.dangerLevel];
  const borderColor = getBorderColor(dangerColorClasses);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-lg p-3 cursor-pointer transition-all duration-200 border-l-4 ${isDragging ? 'opacity-50 ring-2 ring-brand-primary' : 'hover:-translate-y-1'}`}
      style={{ borderLeftColor: borderColor }}
    >
      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate mb-1" title={report.location.address}>
        {report.location.address}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-2">
        ID: {report.id.substring(0, 8)}
      </p>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${dangerColorClasses}`}>
          {report.dangerLevel}
        </span>
        {report.worker && (
          <div className="flex items-center space-x-1">
            <img src={`https://picsum.photos/seed/${report.worker.toLowerCase()}/20/20`} alt={report.worker} className="w-5 h-5 rounded-full" />
            <span className="text-xs text-gray-600 dark:text-gray-300">{report.worker}</span>
          </div>
        )}
      </div>
    </div>
  );
};
