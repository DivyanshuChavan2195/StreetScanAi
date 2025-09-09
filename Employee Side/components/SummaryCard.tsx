import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<{ className?: string }>;
  color?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color = 'text-brand-primary' }) => {
  return (
    <div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-md flex items-center justify-between transition-all hover:shadow-lg hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-blue-100 dark:bg-gray-700 ${color}`}>
        {React.cloneElement(icon, { className: 'h-7 w-7' })}
      </div>
    </div>
  );
};
