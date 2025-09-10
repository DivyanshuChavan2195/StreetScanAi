import React, { useState, useEffect, useCallback } from 'react';
import { View, User, Report } from '../../types';
import { dataStore } from '../../services/dataStore';
import { authService } from '../../auth/authService';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import PotholeMap from './PotholeMap';
import ReportPothole from './ReportPothole';
import Leaderboard from './Leaderboard';
import AllComplaints from './AllComplaints';
import Loader from '../common/Loader';

interface CitizenAppProps {
  user: User;
  onLogout: () => void;
}

const CitizenApp: React.FC<CitizenAppProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<View>(View.Map);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load data on component mount
  useEffect(() => {
    setLoading(true);
    try {
      // Load reports from data store
      const allReports = dataStore.getAllReports();
      setReports(allReports);

      // Load users for leaderboard
      const citizens = authService.getCitizens();
      setUsers(citizens);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to data store changes
  useEffect(() => {
    const unsubscribe = dataStore.subscribe((updatedReports) => {
      setReports(updatedReports);
    });

    return unsubscribe;
  }, []);

  const handleReportSubmitted = useCallback(() => {
    // Refresh data after new report
    const allReports = dataStore.getAllReports();
    setReports(allReports);
    
    // Update users to reflect new score
    const citizens = authService.getCitizens();
    setUsers(citizens);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.Map:
        return <PotholeMap reports={reports} />;
      case View.Report:
        return <ReportPothole setView={setCurrentView} user={user} onReportSubmitted={handleReportSubmitted} />;
      case View.Leaderboard:
        return <Leaderboard users={users} currentUser={user} />;
      case View.Complaints:
        return <AllComplaints reports={reports.filter(r => r.user.id === user.uid)} />;
      default:
        return <PotholeMap reports={reports} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <Loader />
        <p className="mt-4 text-lg">Loading Street Scan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-900 text-white p-5 text-center">
        <div>
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-white text-red-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header user={user} onLogout={onLogout} />
      <Navbar setView={setCurrentView} currentView={currentView} />
      <main className="p-4 md:p-6 flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default CitizenApp;
