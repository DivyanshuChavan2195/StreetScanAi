
import React, { useMemo } from 'react';
import { Pothole, PotholeStatus } from '../types';

interface AllComplaintsProps {
    potholes: Pothole[];
}

const AllComplaints: React.FC<AllComplaintsProps> = ({ potholes }) => {
    
    const sortedPotholes = useMemo(() => {
        return [...potholes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [potholes]);

    const getStatusColor = (status: PotholeStatus) => {
        switch (status) {
            case 'Reported': return 'text-red-400';
            case 'Under Review': return 'text-yellow-400';
            case 'Repaired': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">📜 All Pothole Reports</h2>
            <div className="space-y-4">
                {sortedPotholes.length > 0 ? sortedPotholes.map(p => (
                    <div key={p.id} className="bg-gray-900/70 p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between gap-4 transition-transform hover:scale-[1.02]">
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-gray-100">Severity: {p.severity}</p>
                            <p className="text-gray-300 mt-1">{p.description}</p>
                            <p className="text-xs text-gray-500 mt-2">ID: {p.id}</p>
                        </div>
                        <div className="flex-shrink-0 text-left md:text-right space-y-1">
                            <p className={`font-semibold ${getStatusColor(p.status)}`}>{p.status}</p>
                            <p className="text-sm text-gray-400">
                                {p.timestamp ? p.timestamp.toLocaleString() : 'No date'}
                            </p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-400 py-5">No reports have been filed yet.</p>
                )}
            </div>
        </div>
    );
};

export default AllComplaints;
