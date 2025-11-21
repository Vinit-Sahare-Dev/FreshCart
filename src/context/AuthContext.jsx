import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authApi';

const AuthContext = createContext(null);

const STORAGE_KEY = 'hotel_jwt';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (storedToken) {
      setToken(storedToken);
      // TODO: Optionally decode JWT or fetch current user profile
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    const response = await apiLogin({ email, password });
    if (response?.token) {
      setToken(response.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, response.token);
      }
      // Basic user object; replace with decoded JWT or profile response later
      setUser({ email });
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleRegister = async (payload) => {
    await apiRegister(payload);
    // After registration, you can decide to auto-login or redirect to login page
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}