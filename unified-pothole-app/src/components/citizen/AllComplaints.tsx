import React, { useMemo } from 'react';
import { Report, Status } from '../../types';

interface AllComplaintsProps {
  reports: Report[];
}

const AllComplaints: React.FC<AllComplaintsProps> = ({ reports }) => {
  
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reports]);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Reported: return 'text-red-400';
      case Status.UnderReview: return 'text-yellow-400';
      case Status.Fixed: return 'text-green-400';
      case Status.Assigned: return 'text-blue-400';
      case Status.Rejected: return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getDangerColor = (dangerLevel: string) => {
    switch (dangerLevel) {
      case 'Critical': return 'text-red-500 font-bold';
      case 'High': return 'text-orange-500 font-semibold';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">📜 My Pothole Reports</h2>
      <div className="space-y-4">
        {sortedReports.length > 0 ? sortedReports.map(report => (
          <div key={report.id} className="bg-gray-900/70 p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between gap-4 transition-transform hover:scale-[1.02]">
            <div className="flex-grow">
              <div className="flex items-center space-x-4 mb-2">
                <p className={`font-bold text-lg ${getDangerColor(report.dangerLevel)}`}>
                  {report.dangerLevel} Severity
                </p>
                {report.contains_water && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    💧 Contains Water
                  </span>
                )}
              </div>
              <p className="text-gray-300 mt-1 mb-2">{report.description}</p>
              <p className="text-sm text-gray-400 mb-1">
                📍 {report.location.address || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
              </p>
              {report.notes && (
                <p className="text-sm text-gray-500 italic">
                  ""{report.notes}""
                </p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-xs text-gray-500">Report ID: {report.id}</p>
                <p className="text-xs text-gray-500">
                  👍 {report.upvotes} upvotes | ⚠️ Danger Score: {report.dangerScore}/10
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 text-left md:text-right space-y-1">
              <p className={`font-semibold ${getStatusColor(report.status)}`}>
                {report.status}
              </p>
              {report.worker && (
                <p className="text-sm text-blue-400">
                  👷 Assigned to: {report.worker}
                </p>
              )}
              <p className="text-sm text-gray-400">
                {new Date(report.timestamp).toLocaleString()}
              </p>
              {report.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={report.imageUrl} 
                    alt="Pothole" 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg mb-2">No reports filed yet</p>
            <p className="text-gray-500">Start by reporting potholes in your area to help improve road safety!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllComplaints;
