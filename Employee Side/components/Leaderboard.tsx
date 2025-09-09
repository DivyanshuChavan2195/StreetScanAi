import React, { useMemo } from 'react';
import { Worker } from '../types';
import { TrophyIcon } from './icons/Icons';

interface LeaderboardProps {
  workers: (Worker & { assignedTasks: number; completedTasks: number })[];
}

const medalColors = [
    'text-yellow-400', // Gold
    'text-gray-400', // Silver
    'text-yellow-600' // Bronze
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ workers }) => {
    
  const sortedWorkers = useMemo(() => {
    return [...workers].sort((a, b) => b.completedTasks - a.completedTasks);
  }, [workers]);

  const topPerformerScore = useMemo(() => {
      return sortedWorkers.length > 0 ? sortedWorkers[0].completedTasks : 0;
  }, [sortedWorkers]);

  return (
    <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Leaderboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ranked by number of completed reports.</p>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-dark-border">
        {sortedWorkers.map((worker, index) => (
          <div key={worker.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors duration-200">
            <div className="w-8 text-center">
              {index < 3 ? (
                <TrophyIcon className={`w-7 h-7 ${medalColors[index]}`} />
              ) : (
                <span className="text-lg font-bold text-gray-500 dark:text-gray-400">{index + 1}</span>
              )}
            </div>
            <img src={worker.avatarUrl} alt={worker.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{worker.name}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                <div 
                    className="bg-brand-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${(worker.completedTasks / (topPerformerScore || 1)) * 100}%` }}
                    title={`${worker.completedTasks} completed`}
                ></div>
              </div>
            </div>
            <div className="text-right">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{worker.completedTasks}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
