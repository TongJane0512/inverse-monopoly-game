import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (email, password, name, phone) =>
    api.post('/auth/register', { email, password, name, phone }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () =>
    api.get('/auth/me'),
  updateProfile: (data) =>
    api.put('/auth/profile', data),
};

export const familyService = {
  createFamily: (data) =>
    api.post('/family', data),
  getFamily: () =>
    api.get('/family'),
  updateFamily: (data) =>
    api.put('/family', data),
  updateLocation: (latitude, longitude) =>
    api.put('/family/location', { latitude, longitude }),
  getFamilyRankings: (gameId) =>
    api.get(`/family/rankings?gameId=${gameId}`),
};

export const gameService = {
  getAllGames: () =>
    api.get('/game'),
  getGameById: (gameId) =>
    api.get(`/game/${gameId}`),
  registerForGame: (gameId) =>
    api.post('/game/register', { gameId }),
  startGame: (gameId) =>
    api.post('/game/start', { gameId }),
  endGame: (gameId) =>
    api.post('/game/end', { gameId }),
  getGameStats: (gameId) =>
    api.get(`/game/${gameId}/stats`),
};

export const taskService = {
  getMyTasks: () =>
    api.get('/task/my-tasks'),
  submitTask: (taskId, data) =>
    api.post('/task/submit', { taskId, ...data }),
  getAllTasks: (gameId) =>
    api.get(`/task?gameId=${gameId}`),
  createTask: (data) =>
    api.post('/task', data),
  assignTask: (taskId, familyIds) =>
    api.post('/task/assign', { taskId, familyIds }),
};

export const videoService = {
  reviewSubmission: (data) =>
    api.post('/video/review', data),
  getPendingSubmissions: (gameId) =>
    api.get(`/video/pending?gameId=${gameId}`),
  getSubmissionDetails: (submissionId) =>
    api.get(`/video/${submissionId}`),
  getSubmissionStats: (gameId) =>
    api.get(`/video/stats?gameId=${gameId}`),
};

export const adminService = {
  getDashboardStats: (gameId) =>
    api.get(`/admin/dashboard?gameId=${gameId}`),
  getAllFamilies: (gameId, page = 1, limit = 10) =>
    api.get(`/admin/families?gameId=${gameId}&page=${page}&limit=${limit}`),
  getAllSubmissions: (gameId, reviewStatus, page = 1, limit = 10) =>
    api.get(`/admin/submissions?gameId=${gameId}&reviewStatus=${reviewStatus}&page=${page}&limit=${limit}`),
  sendNotification: (data) =>
    api.post('/admin/notify', data),
  getFamilyLocations: (gameId) =>
    api.get(`/admin/locations?gameId=${gameId}`),
  exportGameData: (gameId) =>
    api.get(`/admin/export/${gameId}`),
};

export default api;
