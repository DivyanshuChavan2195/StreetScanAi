import React, { useMemo } from 'react';
import { User } from '../../types';

interface LeaderboardProps {
  users: User[];
  currentUser: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUser }) => {
  
  const sortedUsers = useMemo(() => {
    return [...users]
      .filter(user => user.role === 'citizen' && typeof user.score === 'number')
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [users]);

  const currentUserRank = useMemo(() => {
    const index = sortedUsers.findIndex(user => user.uid === currentUser.uid);
    return index >= 0 ? index + 1 : null;
  }, [sortedUsers, currentUser.uid]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈'; 
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-8 text-yellow-400 text-center">🏆 Citizen Leaderboard</h2>
      
      {/* Current User Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl mb-6">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-2">Your Stats</h3>
          <div className="flex justify-center items-center space-x-6">
            <div>
              <p className="text-2xl font-bold">{currentUser.score || 0}</p>
              <p className="text-sm opacity-90">Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{currentUser.reports || 0}</p>
              <p className="text-sm opacity-90">Reports</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {currentUserRank ? `#${currentUserRank}` : 'N/A'}
              </p>
              <p className="text-sm opacity-90">Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {sortedUsers.length > 0 ? sortedUsers.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.uid === currentUser.uid;
          
          return (
            <div 
              key={user.uid} 
              className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-[1.02] ${
                isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50' 
                  : 'bg-gray-900/70 hover:bg-gray-900'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-center min-w-[60px]">
                  <div className="text-2xl">{getRankIcon(rank)}</div>
                  <div className={`text-lg font-bold ${getRankColor(rank)}`}>
                    #{rank}
                  </div>
                </div>
                
                <div>
                  <h3 className={`font-bold text-lg ${isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                    {user.name} {isCurrentUser && '(You)'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {user.reports || 0} reports submitted
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-2xl font-bold ${getRankColor(rank)}`}>
                  {user.score || 0}
                </p>
                <p className="text-sm text-gray-400">points</p>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-gray-400 text-lg mb-2">No citizens on the leaderboard yet</p>
            <p className="text-gray-500">Be the first to report potholes and earn points!</p>
          </div>
        )}
      </div>

      {/* Scoring Info */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
        <h4 className="text-lg font-semibold text-yellow-400 mb-2">💡 How to Earn Points</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <span className="text-green-400 font-semibold">+15 points:</span> Report a verified pothole
          </div>
          <div>
            <span className="text-blue-400 font-semibold">+5 points:</span> Each upvote on your report
          </div>
          <div>
            <span className="text-purple-400 font-semibold">+10 points:</span> Report gets fixed
          </div>
          <div>
            <span className="text-yellow-400 font-semibold">+20 points:</span> Report critical safety issues
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
