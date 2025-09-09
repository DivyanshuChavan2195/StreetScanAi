import React from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="md:col-span-2">
            {children}
        </div>
      </div>
    </div>
  );
};
