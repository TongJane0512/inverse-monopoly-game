import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/api';
import { useNotificationStore } from '../../store/index';

export const LiveMap = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotificationStore();

  const loadLocations = useCallback(async () => {
    try {
      const response = await adminService.getFamilyLocations();
      setLocations(response.data);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to load family locations',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    loadLocations();
    const interval = setInterval(loadLocations, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [loadLocations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🗺️ Live Family Locations</h2>

      {/* Family List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location) => (
            <div
              key={location.familyId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <h3 className="font-bold text-gray-800">{location.familyName}</h3>
              <p className="text-gray-600 text-sm mt-2">
                📍 {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-yellow-600 font-semibold">
                  💰 {location.believeValue} pts
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    location.status === 'in_progress'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {location.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note: Google Maps integration would go here */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 Tip: To integrate Google Maps, add your API key to .env and uncomment the GoogleMap component
        </p>
      </div>
    </div>
  );
};

export default LiveMap;
