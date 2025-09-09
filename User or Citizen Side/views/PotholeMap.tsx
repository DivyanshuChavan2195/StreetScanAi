
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import { Pothole, PotholeStatus } from '../types';
import { generateRepairPlan } from '../services/geminiService';
import Modal from '../components/Modal';
import Loader from '../components/Loader';

// Define PopupContent as a separate component to be rendered into popups
const PopupContent: React.FC<{ pothole: Pothole; onSuggestPlan: (pothole: Pothole) => void }> = ({ pothole, onSuggestPlan }) => (
    <div className="space-y-2 text-gray-100">
        <h3 className="font-bold text-base text-yellow-400">Severity: {pothole.severity}</h3>
        <p><strong>Status:</strong> {pothole.status}</p>
        <p className="text-sm"><strong>Description:</strong> {pothole.description || 'N/A'}</p>
        <button 
            onClick={() => onSuggestPlan(pothole)} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-3 rounded-lg mt-2 transition-colors"
        >
            ✨ Suggest Repair Plan
        </button>
    </div>
);

const PotholeMap: React.FC<{ potholes: Pothole[] }> = ({ potholes }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });
    
    const getRepairPlan = useCallback(async (pothole: Pothole) => {
        setIsModalOpen(true);
        setModalContent({ 
            title: 'Generating Plan...', 
            body: '<div class="flex justify-center p-4"><div class="border-5 border-solid border-gray-700 border-t-5 border-t-amber-500 rounded-full w-12 h-12 animate-spin"></div></div>'
        });

        try {
            const plan = await generateRepairPlan(pothole);
            setModalContent({ title: '✨ AI Repair Plan', body: plan });
        } catch (err) {
            console.error("Repair Plan Error:", err);
            setModalContent({ title: 'Error', body: '<p>Could not generate a repair plan at this time. The API key might be missing or invalid.</p>' });
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) return; // Initialize map only once

        mapRef.current = L.map('map-container').setView([18.62, 73.81], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(mapRef.current);

        markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }, []);

    useEffect(() => {
        if (!markersLayerRef.current || !mapRef.current) return;

        const createIcon = (color: string) => L.divIcon({
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" class="w-8 h-8 drop-shadow-lg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="white" opacity="0.7"/></svg>`,
            className: 'custom-leaflet-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        const icons: Record<PotholeStatus, L.DivIcon> = {
            Reported: createIcon('#ef4444'), // red-500
            'Under Review': createIcon('#f59e0b'), // amber-500
            Repaired: createIcon('#22c55e'), // green-500
        };

        markersLayerRef.current.clearLayers();
        potholes.forEach(pothole => {
            if (pothole.location?.lat && pothole.location?.lng) {
                const marker = L.marker([pothole.location.lat, pothole.location.lng], { 
                    icon: icons[pothole.status] || createIcon('grey') 
                });

                const popupNode = document.createElement('div');
                const root = createRoot(popupNode);
                root.render(<PopupContent pothole={pothole} onSuggestPlan={getRepairPlan} />);
                
                marker.bindPopup(popupNode).addTo(markersLayerRef.current!);
            }
        });

    }, [potholes, getRepairPlan]);

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
            <div id="map-container" className="bg-gray-700 rounded-lg h-96 md:h-[600px] z-0 shadow-inner"></div>
        </div>
    );
};

export default PotholeMap;
