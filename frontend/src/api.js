// src/api.js
import axios from 'axios';

// 1️⃣ Use environment variable if set, else fallback to live backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://coderush-platform.onrender.com/api';

// 2️⃣ Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// 3️⃣ Automatically attach tokens
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');        // normal user
  const adminToken = localStorage.getItem('adminToken'); // admin

  // Admin routes
  if (config.url.includes('/admin') && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  // User routes
  else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;