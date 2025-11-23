// src/config/axios.config.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: false, // Changed to false - use Authorization header instead
});

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotel_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - server not responding';
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      error.message = 'Network error - cannot connect to server. Please check if backend is running on http://localhost:8080';
    } else if (error.response?.status === 401) {
      localStorage.removeItem('hotel_jwt');
      window.location.href = '/';
    } else if (error.response?.status === 403) {
      error.message = 'Access denied';
    } else if (error.response?.status === 500) {
      error.message = error.response.data?.message || 'Server error occurred';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };