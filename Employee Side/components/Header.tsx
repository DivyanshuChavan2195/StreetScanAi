
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, MenuIcon } from './icons/Icons';
import { Notification } from '../types';
import { NotificationMenu } from './NotificationMenu';

interface HeaderProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectReportById: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onSelectReportById }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  }
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-dark-card shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b dark:border-dark-border">
        <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">FixFirst Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-bg border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={handleToggleMenu} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg relative">
              <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-dark-card"></span>
                </span>
              )}
            </button>
            {isMenuOpen && (
              <NotificationMenu
                notifications={notifications}
                onClose={() => setIsMenuOpen(false)}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                onSelectReportById={onSelectReportById}
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <img
              className="h-9 w-9 rounded-full object-cover"
              src="https://picsum.photos/id/237/100/100"
              alt="User"
            />
            <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Municipal Dept.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
