// src/services/authService.js
import axiosInstance from '../config/axios.config';

class AuthService {
  async register(userData) {
    const response = await axiosInstance.post('/auth/register', userData);
    // Make sure to store the token after registration too
    if (response.data.token) {
      localStorage.setItem('hotel_jwt', response.data.token);
    }
    return response.data;
  }

  async login(credentials) {
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('hotel_jwt', response.data.token);
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('hotel_jwt');
  }

  getCurrentUser() {
    const token = localStorage.getItem('hotel_jwt');
    if (!token) return null;
    
    try {
      // Decode JWT token (basic decoding)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('hotel_jwt');
  }

  // Add this method to get the token
  getToken() {
    return localStorage.getItem('hotel_jwt');
  }
}

export default new AuthService();