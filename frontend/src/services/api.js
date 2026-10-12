import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for clear errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected network error occurred';
    if (error.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

// Health Check
export const getHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

// Profile API
export const getProfile = async () => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/profile', profileData);
  return res.data;
};

// Activities / Planner API
export const getActivities = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.crop) params.append('crop', filters.crop);
  if (filters.status) params.append('status', filters.status);
  const res = await api.get(`/activities?${params.toString()}`);
  return res.data;
};

export const getActivityStats = async () => {
  const res = await api.get('/activities/stats');
  return res.data;
};

export const createActivity = async (activityData) => {
  const res = await api.post('/activities', activityData);
  return res.data;
};

export const updateActivity = async (id, activityData) => {
  const res = await api.put(`/activities/${id}`, activityData);
  return res.data;
};

export const toggleActivity = async (id) => {
  const res = await api.patch(`/activities/${id}/toggle`);
  return res.data;
};

export const deleteActivity = async (id) => {
  await api.delete(`/activities/${id}`);
  return true;
};

// Crops Guide API
export const getCrops = async () => {
  const res = await api.get('/crops');
  return res.data;
};

export const getCropById = async (cropId) => {
  const res = await api.get(`/crops/${cropId}`);
  return res.data;
};

export const searchCrops = async (query) => {
  const res = await api.get(`/crops/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

// Assistant / Chat API
export const sendChatMessage = async (payload) => {
  const res = await api.post('/assistant/chat', payload);
  return res.data;
};

export const getChatHistory = async () => {
  const res = await api.get('/assistant/history');
  return res.data;
};

export const clearChatHistory = async () => {
  await api.delete('/assistant/history');
  return true;
};

// Vision / Disease Analysis API
export const analyzeCropImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/vision/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getSampleDiseaseCases = async () => {
  const res = await api.get('/vision/samples');
  return res.data;
};

export default api;

