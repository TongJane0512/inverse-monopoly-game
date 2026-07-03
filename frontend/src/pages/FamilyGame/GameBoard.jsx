import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { familyService, gameService, taskService } from '../services/api';
import { useAuthStore, useGameStore, useNotificationStore } from '../store/index';
import io from 'socket.io-client';

let socket;

export const FamilyGame = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [game, setGame] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeGame();
    initializeSocket();
    trackLocation();

    return () => {
      if (navigator.geolocation) {
        navigator.geolocation.clearWatch();
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeGame = async () => {
    try {
      const familyResponse = await familyService.getFamily();
      setFamily(familyResponse.data);

      if (familyResponse.data.gameId) {
        const gameResponse = await gameService.getGameById(familyResponse.data.gameId);
        setGame(gameResponse.data);

        const tasksResponse = await taskService.getMyTasks();
        setTasks(tasksResponse.data);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to load game data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSocket = () => {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001');

    socket.on('connect', () => {
      console.log('Connected to server');
      if (family?.gameId) {
        socket.emit('join-game', {
          gameId: family.gameId,
          familyId: family._id,
          familyName: family.familyName,
        });
      }
    });

    socket.on('notification', (data) => {
      addNotification({
        type: 'info',
        message: data.message,
      });
    });

    socket.on('task-notification', (data) => {
      setTasks((prev) => [...prev, data.task]);
      addNotification({
        type: 'warning',
        message: `New crisis mission: ${data.task.title}`,
      });
    });
  };

  const trackLocation = () => {
    if (!navigator.geolocation) {
      addNotification({
        type: 'error',
        message: 'Geolocation not supported',
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Update location on server
        familyService.updateLocation(latitude, longitude).catch((error) => {
          console.error('Failed to update location:', error);
        });

        // Emit location to server via socket
        if (socket) {
          socket.emit('location-update', {
            gameId: family?.gameId,
            familyId: family?._id,
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        addNotification({
          type: 'error',
          message: 'Failed to access location',
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return watchId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">👨‍👩‍👧‍👦 {family?.familyName}</h1>
            <p className="text-gray-600 mt-2">📍 {game?.location.name}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-yellow-500">💰 {family?.believeValue || 0}</div>
            <p className="text-gray-600 text-sm">Believe Points</p>
          </div>
        </div>
      </div>

      {/* Game Map - Simplified version */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">🗺️ Game Board</h2>
        {game?.properties && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {game.properties.map((property, index) => (
              <div
                key={property._id || index}
                className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition"
              >
                <p className="font-bold text-sm">{property.name}</p>
                <p className="text-xs mt-2">Order: {property.order}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">⚡ Crisis Missions</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-600">No active tasks right now. Wait for the next crisis!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
              >
                <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-2">{task.description}</p>
                <div className="mt-3 flex gap-2">
                  <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    +{task.believeValueReward} points
                  </span>
                  {task.beliefRequired && (
                    <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      💜 {task.beliefRequired}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/task/${task._id}`)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Complete Mission
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Location */}
      {location && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white p-4 rounded-lg shadow-lg text-sm">
          📍 Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default FamilyGame;
