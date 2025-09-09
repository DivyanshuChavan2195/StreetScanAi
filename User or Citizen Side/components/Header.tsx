
import React from 'react';

const Header: React.FC = () => (
    <header className="bg-gray-800 text-white p-4 shadow-lg border-b border-gray-700">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1H8.501M12 18v-1m0-1H8.501M12 4h.01M12 20h.01M4 12H3m1-1v.01M20 12h1m-1-1v.01M6 6l-.707-.707M18 18l-.707-.707M6 18l-.707.707M18 6l-.707.707"></path></svg>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wider">Street Scan</h1>
            </div>
            <div className="hidden sm:block text-sm text-gray-400">Pimpri-Chinchwad</div>
        </div>
    </header>
);

export default Header;
