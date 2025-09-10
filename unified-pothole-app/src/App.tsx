import React, { useState, useEffect } from 'react';
import { authService, AuthState } from './auth/authService';
import { User } from './types';
import Login from './auth/Login';
import CitizenApp from './components/citizen/CitizenApp';
import EmployeeApp from './components/employee/EmployeeApp';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check authentication state on app load
    const currentAuthState = authService.getAuthState();
    setAuthState(currentAuthState);
  }, []);

  const handleAuthSuccess = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false,
    });
  };

  const handleLogout = () => {
    authService.signOut();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  // Show loading screen
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="border-4 border-gray-700 border-t-4 border-t-yellow-500 rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!authState.isAuthenticated || !authState.user) {
    return <Login onAuthSuccess={handleAuthSuccess} />;
  }

  // Route based on user role
  if (authState.user.role === 'citizen') {
    return <CitizenApp user={authState.user} onLogout={handleLogout} />;
  } else if (authState.user.role === 'employee') {
    return <EmployeeApp user={authState.user} onLogout={handleLogout} />;
  }

  // Fallback (shouldn't happen)
  return (
    <div className="min-h-screen bg-red-900 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>Unknown user role. Please log out and try again.</p>
        <button 
          onClick={handleLogout}
          className="mt-4 px-6 py-2 bg-white text-red-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default App;
