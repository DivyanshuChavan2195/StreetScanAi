
import React, { useEffect, useMemo, useRef } from 'react';
import { Report } from '../types';
import { FlameIcon } from './icons/Icons';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapPageProps {
  reports: Report[];
}

export const HeatmapPage: React.FC<HeatmapPageProps> = ({ reports }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const heatLayerRef = useRef<L.HeatLayer | null>(null);

    const heatData = useMemo(() => {
        return reports.map(report => [
            report.location.lat, 
            report.location.lng,
            report.dangerScore / 100 // Intensity (0.0 to 1.0)
        ] as [number, number, number]);
    }, [reports]);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [34.0522, -118.2437],
                zoom: 12
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapRef.current);

            // @ts-ignore - leaflet.heat types might not be perfectly aligned
            heatLayerRef.current = L.heatLayer(heatData, {
                radius: 25,
                blur: 15,
                maxZoom: 18,
                gradient: { 0.2: 'blue', 0.4: 'cyan', 0.6: 'yellow', 0.8: 'orange', 1.0: 'red' }
            }).addTo(mapRef.current);
        }
    }, []); 

    useEffect(() => {
        if (heatLayerRef.current) {
            // @ts-ignore
            heatLayerRef.current.setLatLngs(heatData);
        }
    }, [heatData]);

    return (
        <div className="container mx-auto">
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
                <FlameIcon className="w-8 h-8 mr-3 text-orange-500" />
                Pothole Danger Heatmap
            </h1>
            <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-4">
                 <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-inner mx-auto max-w-full" style={{ aspectRatio: `1200/800` }}>
                    <div ref={mapContainerRef} className="w-full h-full z-0" />
                    {/* Heatmap Legend */}
                    <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-dark-card/80 p-3 rounded-lg shadow-lg z-[1000]">
                        <h4 className="font-bold mb-2 text-sm text-gray-900 dark:text-white">Heatmap Intensity</h4>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Low</span>
                            <div className="w-24 h-4 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-600"></div>
                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">High</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};