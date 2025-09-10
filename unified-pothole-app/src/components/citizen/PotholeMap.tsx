import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Report, Status } from '../../types';
import { generateRepairPlan } from '../../services/geminiService';

interface PotholeMapProps {
  reports: Report[];
}

// Simple modal for displaying repair plans
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = 
({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const PotholeMap: React.FC<PotholeMapProps> = ({ reports }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const leaflet = await import('leaflet');
        setL(leaflet.default);
      }
    };
    loadLeaflet();
  }, []);

  const getRepairPlan = useCallback(async (report: Report) => {
    setIsModalOpen(true);
    setModalContent({ 
      title: 'Generating Plan...', 
      body: '<div class="flex justify-center p-4"><div class="border-4 border-solid border-gray-300 border-t-4 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div></div>'
    });

    try {
      const plan = await generateRepairPlan(report);
      setModalContent({ title: '✨ AI Repair Plan', body: plan });
    } catch (err) {
      console.error("Repair Plan Error:", err);
      setModalContent({ 
        title: 'Error', 
        body: '<p>Could not generate a repair plan at this time. The API key might be missing or invalid.</p>' 
      });
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || map) return;

    const newMap = L.map(mapRef.current).setView([18.62, 73.81], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, [L]);

  // Add markers for reports
  useEffect(() => {
    if (!L || !map || !reports.length) return;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const createIcon = (color: string) => L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" class="w-8 h-8 drop-shadow-lg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="white" opacity="0.7"/></svg>`,
      className: 'custom-leaflet-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const getMarkerColor = (status: Status) => {
      switch (status) {
        case Status.Reported: return '#ef4444'; // red-500
        case Status.UnderReview: return '#f59e0b'; // amber-500
        case Status.Fixed: return '#22c55e'; // green-500
        default: return '#6b7280'; // gray-500
      }
    };

    reports.forEach(report => {
      if (report.location?.lat && report.location?.lng) {
        const marker = L.marker([report.location.lat, report.location.lng], { 
          icon: createIcon(getMarkerColor(report.status))
        });

        const popupContent = `
          <div class="p-2 text-gray-100" style="background: #1f2937; border-radius: 8px;">
            <h3 class="font-bold text-base text-yellow-400 mb-2">Severity: ${report.dangerLevel}</h3>
            <p class="mb-1"><strong>Status:</strong> ${report.status}</p>
            <p class="text-sm mb-3"><strong>Description:</strong> ${report.description || 'N/A'}</p>
            <button onclick="window.showRepairPlan('${report.id}')" 
                    class="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors">
              ✨ Suggest Repair Plan
            </button>
          </div>
        `;

        marker.bindPopup(popupContent).addTo(map);
      }
    });

    // Set up global function for repair plan button
    (window as any).showRepairPlan = (reportId: string) => {
      const report = reports.find(r => r.id === reportId);
      if (report) {
        getRepairPlan(report);
      }
    };

  }, [L, map, reports, getRepairPlan]);

  if (!L) {
    return (
      <div className="bg-gray-800 p-4 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-4 text-yellow-400 text-center">Pothole Hotspot Map</h2>
        <div className="bg-gray-700 rounded-lg h-96 md:h-[600px] flex items-center justify-center">
          <div className="text-white text-center">
            <div className="border-4 border-gray-400 border-t-4 border-t-yellow-500 rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
            <p>Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-2xl relative">
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        <div dangerouslySetInnerHTML={{ __html: modalContent.body }} />
      </Modal>
      
      <h2 className="text-3xl font-bold mb-4 text-yellow-400 text-center">Pothole Hotspot Map</h2>
      <div 
        ref={mapRef}
        className="bg-gray-700 rounded-lg h-96 md:h-[600px] z-0 shadow-inner"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default PotholeMap;
