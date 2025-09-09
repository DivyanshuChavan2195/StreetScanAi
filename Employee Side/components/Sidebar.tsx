import React from 'react';
import { DashboardIcon, MapIcon, ChartBarIcon, UsersIcon, CogIcon, RoadIcon } from './icons/Icons';
import { Page } from '../App';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    name: Page;
    active: boolean;
    onClick: (page: Page) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, name, active, onClick }) => (
  <button
    onClick={() => onClick(name)}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-left ${
      active
        ? 'bg-brand-secondary text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

interface SidebarProps {
    activePage: Page;
    onNavClick: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavClick }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-dark-card p-4 flex flex-col justify-between border-r dark:border-dark-border">
        <div>
            <div className="flex items-center space-x-2 p-2 mb-6">
                <RoadIcon className="h-8 w-8 text-brand-primary"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">FixFirst</span>
            </div>
            <nav className="space-y-2">
                <NavItem icon={<DashboardIcon />} label="Dashboard" name="dashboard" active={activePage === 'dashboard'} onClick={onNavClick} />
                <NavItem icon={<ChartBarIcon />} label="Analytics" name="analytics" active={activePage === 'analytics'} onClick={onNavClick} />
                <NavItem icon={<MapIcon />} label="Heatmap" name="heatmap" active={activePage === 'heatmap'} onClick={onNavClick} />
                <NavItem icon={<UsersIcon />} label="Teams" name="teams" active={activePage === 'teams'} onClick={onNavClick} />
            </nav>
        </div>
        <div>
            <nav>
                <NavItem icon={<CogIcon />} label="Settings" name="settings" active={activePage === 'settings'} onClick={onNavClick} />
            </nav>
        </div>
    </aside>
  );
};
