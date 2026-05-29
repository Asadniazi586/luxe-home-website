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

// Add token to requests - check which token to use based on path
api.interceptors.request.use(
  (config) => {
    // Check if it's an admin request
    const isAdminRequest = config.url.includes('/admin') || window.location.pathname.startsWith('/admin')
    
    const token = isAdminRequest 
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('user_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;