import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  // Use admin token for /admin routes
  if (config.url.includes('/admin') && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  // Otherwise use regular token
  else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;