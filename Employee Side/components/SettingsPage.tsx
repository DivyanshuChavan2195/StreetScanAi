import React, { useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { ToggleSwitch } from './ToggleSwitch';
import { SunIcon, MoonIcon, CogIcon, KeyIcon } from './icons/Icons';
import { Theme } from '../App';

interface SettingsPageProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme }) => {
  const [notifications, setNotifications] = useState({
    criticalReport: true,
    taskAssigned: true,
    weeklySummary: false,
  });
  
  const [apiKeyStatus, setApiKeyStatus] = useState<'verified' | 'unverified' | 'verifying'>('verified');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleVerifyKey = () => {
    setApiKeyStatus('verifying');
    setTimeout(() => {
        // In a real app, this would make an API call.
        // We'll just simulate a success.
        setApiKeyStatus('verified');
    }, 1500);
  }

  const apiKey = process.env.API_KEY;
  const maskedApiKey = apiKey ? `sk-**********${apiKey.slice(-4)}` : 'Not Configured';


  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
        <CogIcon className="w-8 h-8 mr-3 text-gray-500" />
        Settings
      </h1>

      <SettingsSection
        title="Appearance"
        description="Customize the look and feel of your dashboard."
      >
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-bg">
          <span className="font-medium text-gray-800 dark:text-gray-200">Theme</span>
          <div className="flex items-center space-x-2">
            <SunIcon className={`w-6 h-6 ${theme === 'light' ? 'text-yellow-500' : 'text-gray-500'}`} />
            <ToggleSwitch
              enabled={theme === 'dark'}
              onChange={(isDark) => setTheme(isDark ? 'dark' : 'light')}
              ariaLabel="Theme toggle"
            />
            <MoonIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-500'}`} />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        description="Manage how you receive alerts and updates."
      >
        <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-dark-bg">
          <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">New Critical Report</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get notified immediately for critical danger reports.</p>
            </div>
            <ToggleSwitch enabled={notifications.criticalReport} onChange={() => handleNotificationChange('criticalReport')} ariaLabel="Critical report notifications"/>
          </div>
           <div className="flex items-center justify-between">
             <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Task Assigned</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive an alert when a task is assigned to your team.</p>
            </div>
            <ToggleSwitch enabled={notifications.taskAssigned} onChange={() => handleNotificationChange('taskAssigned')} ariaLabel="Task assignment notifications"/>
          </div>
           <div className="flex items-center justify-between">
             <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Weekly Summary Email</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive a weekly digest of all activities.</p>
            </div>
            <ToggleSwitch enabled={notifications.weeklySummary} onChange={() => handleNotificationChange('weeklySummary')} ariaLabel="Weekly summary email"/>
          </div>
        </div>
      </SettingsSection>
      
      <SettingsSection
        title="API Configuration"
        description="Manage connection to external services like Google Gemini."
      >
        <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-dark-bg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <KeyIcon className="w-5 h-5 mr-3 text-gray-500" />
              <p className="font-medium text-gray-800 dark:text-gray-200">Gemini API Key</p>
            </div>
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">{maskedApiKey}</span>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleVerifyKey}
              disabled={!apiKey || apiKeyStatus === 'verifying'}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {apiKeyStatus === 'verifying' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {apiKeyStatus === 'verifying' ? 'Verifying...' : 'Verify Connection'}
            </button>
          </div>
          {apiKeyStatus === 'verified' && apiKey && (
            <p className="text-sm text-green-600 dark:text-green-400 text-right">✓ Connection successful.</p>
          )}
        </div>
      </SettingsSection>

    </div>
  );
};
