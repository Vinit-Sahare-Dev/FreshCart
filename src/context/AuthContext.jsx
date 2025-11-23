// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      if (authService.isAuthenticated()) {
        const userData = authService.getCurrentUser();
        setUser(userData);
        
        // Load saved profile from localStorage
        try {
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
          }
        } catch (err) {
          console.error('Error loading saved profile:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const userData = authService.getCurrentUser();
    setUser(userData);
    
    // Load saved profile from localStorage after login
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (err) {
      console.error('Error loading saved profile:', err);
    }
    
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // After successful registration, get user from token
    const userDataFromToken = authService.getCurrentUser();
    setUser(userDataFromToken);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserProfile(null);
  };

  const updateUserProfile = (profileData) => {
    setUserProfile(profileData);
    try {
      localStorage.setItem('userProfile', JSON.stringify(profileData));
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const saveCartToDatabase = async (cartItems) => {
    if (!user) return;
    try {
      // Save cart to localStorage for now (can be extended to backend)
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
      console.log('Cart saved to database');
    } catch (err) {
      console.error('Error saving cart:', err);
    }
  };

  const getCartFromDatabase = async () => {
    if (!user) return [];
    try {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error('Error loading cart:', err);
      return [];
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserProfile,
    saveCartToDatabase,
    getCartFromDatabase,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}