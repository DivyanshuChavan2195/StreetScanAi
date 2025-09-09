import React, { useMemo, useState } from 'react';
import { Worker, Report, Status } from '../types';
import { WorkerCard } from './WorkerCard';
import { UsersIcon, ListBulletIcon, DashboardIcon } from './icons/Icons';
import { Leaderboard } from './Leaderboard';

interface TeamsPageProps {
  workers: Worker[];
  reports: Report[];
}

export const TeamsPage: React.FC<TeamsPageProps> = ({ workers, reports }) => {
  const [teamView, setTeamView] = useState<'cards' | 'leaderboard'>('cards');

  const workerStats = useMemo(() => {
    return workers.map(worker => {
      const assignedTasks = reports.filter(r => r.worker === worker.name && r.status === Status.Assigned).length;
      const completedTasks = reports.filter(r => r.worker === worker.name && r.status === Status.Fixed).length;
      
      return {
        ...worker,
        assignedTasks,
        completedTasks,
      };
    });
  }, [workers, reports]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
          <UsersIcon className="w-8 h-8 mr-3 text-brand-primary" />
          Team Management
        </h1>
        <div className="flex items-center space-x-2 bg-gray-200 dark:bg-dark-bg p-1 rounded-lg">
            <button onClick={() => setTeamView('cards')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${teamView === 'cards' ? 'bg-white dark:bg-dark-card shadow' : 'text-gray-600 dark:text-gray-400'}`}>
                <DashboardIcon className="w-4 h-4 mr-1.5" />
                Cards
            </button>
            <button onClick={() => setTeamView('leaderboard')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${teamView === 'leaderboard' ? 'bg-white dark:bg-dark-card shadow' : 'text-gray-600 dark:text-gray-400'}`}>
                <ListBulletIcon className="w-4 h-4 mr-1.5" />
                Leaderboard
            </button>
        </div>
      </div>
      
      {teamView === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workerStats.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      ) : (
        <Leaderboard workers={workerStats} />
      )}
    </div>
  );
};
