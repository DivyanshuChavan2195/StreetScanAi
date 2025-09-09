
import React, { useEffect, useRef } from 'react';
import { Report, DangerLevel } from '../types';
import L from 'leaflet';

interface MapViewProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

const DANGER_COLORS: Record<DangerLevel, string> = {
  [DangerLevel.Low]: '#22c55e',       // green-500
  [DangerLevel.Medium]: '#f59e0b',    // yellow-500
  [DangerLevel.High]: '#f97316',      // orange-500
  [DangerLevel.Critical]: '#dc2626', // red-600
};


const createPulsingIcon = (report: Report) => {
    const color = DANGER_COLORS[report.dangerLevel];
    const size = 12 + report.dangerScore / 10;
    const isCritical = report.dangerLevel === DangerLevel.Critical;

    const animation = isCritical ? 
        `@keyframes pulse-animation-${report.id} { 0% { box-shadow: 0 0 0 0 ${color}99; } 70% { box-shadow: 0 0 0 ${size*1.5}px ${color}00; } 100% { box-shadow: 0 0 0 0 ${color}00; } }` : '';
    
    return L.divIcon({
        html: `
            <style>${animation}</style>
            <div style="
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 5px black;
                animation: ${isCritical ? `pulse-animation-${report.id} 2s infinite` : 'none'};
            "></div>
        `,
        className: '', // important to clear default styling
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

export const MapView: React.FC<MapViewProps> = ({ reports, onSelectReport }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([34.0522, -118.2437], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        reports.forEach(report => {
            const marker = L.marker([report.location.lat, report.location.lng], {
                icon: createPulsingIcon(report)
            }).addTo(mapRef.current!);
            
            marker.bindTooltip(`
                <div>
                    <strong>${report.location.address}</strong><br/>
                    Danger Score: ${report.dangerScore.toFixed(1)}
                </div>
            `);

            marker.on('click', () => onSelectReport(report));
            markersRef.current.push(marker);
        });
    }
  }, [reports, onSelectReport]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-4 left-4 bg-white/80 dark:bg-dark-card/80 p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-bold mb-2 text-sm">Legend</h4>
        <div className="space-y-1">
          {Object.entries(DANGER_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: color}}></div>
              <span className="text-xs font-medium">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};