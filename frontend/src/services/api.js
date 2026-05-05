import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/token', formData);
    return response.data;
  },
  register: async (email, password) => {
    const response = await api.post('/register', { email, password });
    return response.data;
  },
};

export const fileService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  listFiles: async () => {
    const response = await api.get('/files');
    return response.data;
  },
};

export const chatService = {
  sendMessage: async (fileId, content) => {
    const response = await api.post(`/chat/${fileId}`, { content, role: 'user', file_id: fileId });
    return response.data;
  },
  getHistory: async (fileId) => {
    const response = await api.get(`/chat/${fileId}/history`);
    return response.data;
  },
};

export default api;
