
import React from 'react';
import { Notification } from '../types';
import { BellIcon, CheckCircleIcon, ClipboardListIcon, PencilSquareIcon, UsersIcon, XIcon } from './icons/Icons';

interface NotificationMenuProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectReportById: (id: string) => void;
}

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'assignment':
            return <UsersIcon className="w-5 h-5 text-blue-500" />;
        case 'task_fixed':
            return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        case 'task_rejected':
            return <XIcon className="w-5 h-5 text-red-500" />;
        case 'status_change':
            return <PencilSquareIcon className="w-5 h-5 text-yellow-500" />;
        case 'bulk_update':
            return <ClipboardListIcon className="w-5 h-5 text-indigo-500" />;
        default:
            return <BellIcon className="w-5 h-5 text-gray-400" />;
    }
};

const timeAgo = (date: string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 10) return "just now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

const NotificationItem: React.FC<{
  notification: Notification;
  onClick: () => void;
}> = ({ notification, onClick }) => {
  return (
    <button onClick={onClick} className="w-full text-left p-3 flex items-start space-x-3 hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors duration-150">
        {!notification.read && <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" aria-label="Unread"></div>}
        <div className={`flex-shrink-0 ${notification.read ? 'ml-2' : ''}`}>
            <NotificationIcon type={notification.type}/>
        </div>
        <div className="flex-1">
            <p className={`text-sm ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100 font-semibold'}`}>
                {notification.message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5" title={new Date(notification.timestamp).toLocaleString()}>
                {timeAgo(notification.timestamp)}
            </p>
        </div>
    </button>
  );
}

export const NotificationMenu: React.FC<NotificationMenuProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectReportById,
}) => {

  const handleItemClick = (notification: Notification) => {
    if (!notification.read) {
        onMarkAsRead(notification.id);
    }
    onSelectReportById(notification.reportId);
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 max-w-sm bg-white dark:bg-dark-card rounded-lg shadow-2xl border dark:border-dark-border z-50 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b dark:border-dark-border">
        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
        {notifications.some(n => !n.read) && (
            <button onClick={onMarkAllAsRead} className="text-sm text-brand-primary hover:underline">
                Mark all as read
            </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-dark-border">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <NotificationItem key={n.id} notification={n} onClick={() => handleItemClick(n)} />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <BellIcon className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};
