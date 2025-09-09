import React from 'react';
import { Activity } from '../types';
import { ListBulletIcon, PlusCircleIcon, PencilSquareIcon } from './icons/Icons';

interface FeedItem extends Activity {
  reportId: string;
  reportAddress: string;
}

interface ActivityFeedProps {
  items: FeedItem[];
  onSelectReportById: (reportId: string) => void;
}

const ActivityIcon: React.FC<{ type: Activity['type'] }> = ({ type }) => {
    switch (type) {
        case 'creation':
            return <PlusCircleIcon className="w-5 h-5 text-green-500" />;
        case 'status_change':
            return <PencilSquareIcon className="w-5 h-5 text-yellow-500" />;
        case 'assignment':
            return <PencilSquareIcon className="w-5 h-5 text-blue-500" />;
        default:
            return <ListBulletIcon className="w-5 h-5 text-gray-400" />;
    }
};

const timeAgo = (date: string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, onSelectReportById }) => {
  return (
    <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl h-full flex flex-col">
        <div className="p-4 border-b dark:border-dark-border">
            <h2 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
                <ListBulletIcon className="w-6 h-6 mr-2 text-brand-primary"/>
                Activity Feed
            </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
                    <p>No recent activity.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {items.map((item, index) => (
                        <li key={`${item.reportId}-${item.timestamp}-${index}`} className="relative pl-8">
                            <div className="absolute left-0 top-1 w-6 h-6 bg-gray-100 dark:bg-dark-bg rounded-full flex items-center justify-center ring-4 ring-white dark:ring-dark-card">
                                <ActivityIcon type={item.type} />
                            </div>
                            <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border"></div>

                            <div className="ml-2">
                                <p className="text-sm text-gray-800 dark:text-gray-200">{item.message}</p>
                                <button
                                    onClick={() => onSelectReportById(item.reportId)} 
                                    className="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-blue-400 hover:underline"
                                    title={`View report at ${item.reportAddress}`}
                                >
                                    Report at {item.reportAddress.split(',')[0]}...
                                </button>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(item.timestamp)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  );
};
