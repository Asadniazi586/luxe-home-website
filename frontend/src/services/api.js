import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://luxe-home-website-backend.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Check for admin token first (from localStorage)
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      return config;
    }
    
    // Check for user token (from sessionStorage)
    const userData = sessionStorage.getItem('user_user')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;