import axios from 'axios';

// In production, this would ideally come from an environment variable
// Use a fallback for local development
const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : 'https://api.your-production-domain.com';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Add interceptor to include token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb-access-token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Session expired. Please log in again.');
      // Optional: window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);