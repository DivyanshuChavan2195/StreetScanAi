export const getGeoLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error("Geolocation is not supported by your browser."));
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                reject(new Error("Unable to retrieve your location. Please enable location services."));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
};

// Helper function to get readable address from coordinates
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        // Using a free service for reverse geocoding (Nominatim)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
        // Fallback to coordinates if geocoding fails
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
};
