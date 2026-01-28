import axios from 'axios';

// When using Supabase, we mostly interact via the supabase client in api/supabase.ts.
// This axios instance is kept as a fallback for custom endpoints if you deploy a separate backend.
const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : window.location.origin; // Use the same origin for relative API calls if needed

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb-access-token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request. Redirecting to login if necessary.');
    }
    return Promise.reject(error);
  }
);