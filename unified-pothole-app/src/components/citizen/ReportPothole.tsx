import React, { useState, useRef } from 'react';
import { View, User } from '../../types';
import { getGeoLocation } from '../../services/locationService';
import { analyzePotholeImage } from '../../services/geminiService';
import { dataStore } from '../../services/dataStore';
import { authService } from '../../auth/authService';
import Loader from '../common/Loader';

interface ReportPotholeProps {
  setView: (view: View) => void;
  user: User;
  onReportSubmitted?: () => void;
}

const ReportPothole: React.FC<ReportPotholeProps> = ({ setView, user, onReportSubmitted }) => {
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const coords = await getGeoLocation();
      setLocation(coords);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !location) {
      setError("Please provide an image and get your location.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      setAnalysisStatus('Analyzing image with AI...');
      const aiData = await analyzePotholeImage(image);
      
      if (!aiData.is_pothole) {
        setError("AI analysis determined this is not a pothole. Report cancelled.");
        setLoading(false);
        return;
      }

      setAnalysisStatus('Analysis complete. Submitting report...');
      
      // Submit to data store
      dataStore.addReport({
        location: {
          lat: location.lat,
          lng: location.lng,
          address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` // Will be improved with reverse geocoding
        },
        imageData: image,
        description: aiData.description,
        notes: notes,
        user: user,
        severity: aiData.severity,
        contains_water: aiData.contains_water
      });

      // Update user's score and reports count
      const currentScore = user.score || 0;
      const currentReports = user.reports || 0;
      authService.updateUser({
        score: currentScore + 15,
        reports: currentReports + 1
      });

      setAnalysisStatus('Report submitted successfully!');
      
      // Reset form
      setNotes('');
      setImage(null);
      setImagePreview('');
      setLocation(null);
      
      // Notify parent and navigate to map
      if (onReportSubmitted) onReportSubmitted();
      setTimeout(() => {
        setView(View.Map);
      }, 1000);

    } catch (err: any) {
      console.error("Submit Error:", err);
      setError("Failed to analyze or submit report. " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setAnalysisStatus(''), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Report a Pothole</h2>
      {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center animate-pulse">{error}</div>}
      {analysisStatus && <div className="bg-blue-500 text-white p-3 rounded-lg mb-4 text-center">{analysisStatus}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
          >
            <span>{imagePreview ? 'Change Image' : '📸 Select Pothole Image'}</span>
          </button>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleImageChange} 
            ref={fileInputRef} 
            className="hidden" 
            required 
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg w-full h-auto max-h-80 object-cover shadow-lg"/>}
        </div>
        
        <textarea 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          placeholder="Add optional notes..." 
          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow text-white" 
          rows={3}
        />
        
        <div>
          <button 
            type="button" 
            onClick={handleLocation} 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-800 disabled:cursor-wait transition-colors"
          >
            {loading && !location ? 'Fetching...' : '📍 Get Current Location'}
          </button>
          {location && <div className="text-green-400 text-center mt-2 font-semibold">✅ Location captured!</div>}
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !image || !location} 
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 text-lg rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-colors"
        >
          {loading && <Loader />}
          <span>{loading ? analysisStatus || 'Processing...' : 'Analyze & Submit Report'}</span>
        </button>
      </form>
    </div>
  );
};

export default ReportPothole;
