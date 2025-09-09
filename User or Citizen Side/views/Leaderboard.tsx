
import React, { useMemo } from 'react';
import { User } from '../types';

interface LeaderboardProps {
    users: User[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => (b.score || 0) - (a.score || 0));
    }, [users]);

    const getTrophy = (index: number) => {
        if (index === 0) return '🏆';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}`;
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">🏆 Top Reporters 🏆</h2>
            <div className="space-y-3">
                {sortedUsers.length > 0 ? sortedUsers.map((user, index) => (
                    <div key={user.uid} className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${index < 3 ? 'bg-gray-700 border-l-4 border-yellow-400' : 'bg-gray-900/50'}`}>
                        <div className="flex items-center space-x-4">
                            <span className="text-xl font-bold w-8 text-center text-yellow-300">{getTrophy(index)}</span>
                            <div>
                                <p className="font-semibold text-lg truncate text-gray-100" title={user.uid}>{`User-${user.uid.substring(user.uid.length - 6)}`}</p>
                                <p className="text-sm text-gray-400">Reports: {user.reports || 0}</p>
                            </div>
                        </div>
                        <div className="text-xl font-bold text-yellow-400">{user.score || 0} pts</div>
                    </div>
                )) : (
                     <p className="text-center text-gray-400 py-5">Leaderboard is empty. Be the first to report a pothole!</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
