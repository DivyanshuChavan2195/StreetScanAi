
import React from 'react';
import { View } from '../types';

interface NavbarProps {
    setView: (view: View) => void;
    currentView: View;
}

const Navbar: React.FC<NavbarProps> = ({ setView, currentView }) => {
    const baseClasses = "flex-1 text-center py-3 px-2 sm:px-4 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75";
    const activeClasses = "bg-yellow-500 text-gray-900 shadow-lg";
    const inactiveClasses = "bg-gray-700 hover:bg-gray-600";

    const navItems = [
        { view: View.Map, label: '🗺️ Map' },
        { view: View.Report, label: '📸 Report' },
        { view: View.Leaderboard, label: '🏆 Leaderboard' },
        { view: View.Complaints, label: '📜 Reports' },
    ];

    return (
        <nav className="bg-gray-800 p-2 sticky top-0 z-20 shadow-md">
            <div className="container mx-auto flex justify-around space-x-1 sm:space-x-2 text-sm sm:text-base">
                {navItems.map(item => (
                    <button 
                        key={item.view} 
                        onClick={() => setView(item.view)} 
                        className={`${baseClasses} ${currentView === item.view ? activeClasses : inactiveClasses}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
