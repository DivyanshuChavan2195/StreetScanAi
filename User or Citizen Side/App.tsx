
import React, { useState, useCallback } from 'react';
import { View, Pothole, User, AnalyzedPotholeData } from './types';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PotholeMap from './views/PotholeMap';
import ReportPothole from './views/ReportPothole';
import Leaderboard from './views/Leaderboard';
import AllComplaints from './views/AllComplaints';
import Loader from './components/Loader';

// MOCK DATA
const MOCK_USERS: User[] = [
  { uid: 'user-alpha-001', score: 120, reports: 8 },
  { uid: 'user-beta-002', score: 90, reports: 6 },
  { uid: 'user-gamma-003', score: 45, reports: 3 },
];

const MOCK_POTHOLES: Pothole[] = [
  { id: 'ph-1', location: { lat: 18.6295, lng: 73.8213 }, notes: 'Near the main junction, very deep.', timestamp: new Date(Date.now() - 86400000), status: 'Reported', reporterId: 'user-alpha-001', severity: 'High', contains_water: true, description: 'Large, water-filled pothole causing traffic slowdowns.' },
  { id: 'ph-2', location: { lat: 18.6180, lng: 73.8050 }, notes: '', timestamp: new Date(Date.now() - 172800000), status: 'Repaired', reporterId: 'user-beta-002', severity: 'Medium', contains_water: false, description: 'Cluster of smaller potholes on a residential street.' },
  { id: 'ph-3', location: { lat: 18.6350, lng: 73.8150 }, notes: 'School zone.', timestamp: new Date(Date.now() - 43200000), status: 'Under Review', reporterId: 'user-alpha-001', severity: 'Medium', contains_water: false, description: 'Pothole forming near a speed bump.' },
];

const MOCK_CURRENT_USER = { uid: 'user-delta-004' }; // Mock a signed-in user

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Map);
  const [potholes, setPotholes] = useState<Pothole[]>(MOCK_POTHOLES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const addPothole = useCallback((aiData: AnalyzedPotholeData, location: { lat: number, lng: number }, notes: string) => {
    setPotholes(prevPotholes => {
      const newPothole: Pothole = {
        id: `ph-${Date.now()}`,
        location,
        notes,
        timestamp: new Date(),
        status: 'Reported',
        reporterId: MOCK_CURRENT_USER.uid,
        severity: aiData.severity,
        contains_water: aiData.contains_water,
        description: aiData.description,
      };
      return [newPothole, ...prevPotholes];
    });

    setUsers(prevUsers => {
      const userIndex = prevUsers.findIndex(u => u.uid === MOCK_CURRENT_USER.uid);
      if (userIndex > -1) {
        const updatedUsers = [...prevUsers];
        const user = updatedUsers[userIndex];
        updatedUsers[userIndex] = { ...user, score: user.score + 15, reports: user.reports + 1 };
        return updatedUsers;
      } else {
        return [...prevUsers, { uid: MOCK_CURRENT_USER.uid, score: 15, reports: 1 }];
      }
    });

    setCurrentView(View.Map);
  }, []);


  const renderView = () => {
    switch (currentView) {
      case View.Map:
        return <PotholeMap potholes={potholes} />;
      case View.Report:
        return <ReportPothole setView={setCurrentView} onPotholeReported={addPothole} />;
      case View.Leaderboard:
        return <Leaderboard users={users} />;
      case View.Complaints:
        return <AllComplaints potholes={potholes} />;
      default:
        return <PotholeMap potholes={potholes} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <Loader />
        <p className="mt-4 text-lg">Initializing Street Scan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-900 text-white p-5 text-center">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <Navbar setView={setCurrentView} currentView={currentView} />
      <main className="p-4 md:p-6 flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
