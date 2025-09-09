import React from 'react';
import { Worker, WorkerStatus } from '../types';

interface WorkerCardProps {
  worker: Worker & { assignedTasks: number; completedTasks: number };
}

const getStatusColor = (status: WorkerStatus): string => {
  switch (status) {
    case WorkerStatus.Active:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case WorkerStatus.OnLeave:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case WorkerStatus.Inactive:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return '';
  }
};

const getPerformanceRating = (completedTasks: number): { rating: string; color: string } => {
    if (completedTasks > 5) return { rating: "Top Performer", color: "text-green-500" };
    if (completedTasks > 2) return { rating: "Reliable", color: "text-blue-500" };
    if (completedTasks > 0) return { rating: "Active", color: "text-gray-500" };
    return { rating: "New", color: "text-gray-400" };
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const { rating, color } = getPerformanceRating(worker.completedTasks);

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative mb-4">
        <img
          src={worker.avatarUrl}
          alt={worker.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200 dark:ring-dark-border"
        />
        <span
          className={`absolute bottom-0 right-1 block h-5 w-5 rounded-full border-2 border-white dark:border-dark-card ${
            worker.status === WorkerStatus.Active ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          title={worker.status}
        ></span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{worker.name}</h3>
      <p className={`text-sm font-semibold ${color}`}>{rating}</p>
      <span
        className={`mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(worker.status)}`}
      >
        {worker.status}
      </span>
      <div className="w-full border-t border-gray-200 dark:border-dark-border my-4"></div>
      <div className="w-full flex justify-around">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{worker.assignedTasks}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{worker.completedTasks}</p>
        </div>
      </div>
    </div>
  );
};
