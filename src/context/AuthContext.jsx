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
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser();
          console.log('✅ User authenticated:', userData);
          setUser(userData);
          
          // Load saved profile from localStorage
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            console.log('✅ Loaded saved profile:', profile);
            setUserProfile(profile);
          }
        } else {
          console.log('ℹ️ No authenticated user found');
        }
      } catch (err) {
        console.error('❌ Error initializing auth:', err);
        // Clear invalid token
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Add this function to check user role
  const getUserRole = () => {
    return user?.role || 'CUSTOMER';
  };

  // Add this function to check if user is admin
  const isAdmin = () => {
    return getUserRole() === 'ADMIN';
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      const response = await authService.login(credentials);
      console.log('✅ Login response:', response);
      
      const userData = authService.getCurrentUser();
      console.log('✅ User data from token:', userData);
      
      if (userData) {
        setUser(userData);
        
        // Load or create profile
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.id === userData.sub || profile.email === userData.sub) {
            setUserProfile(profile);
          }
        } else {
          // Create initial profile
          const initialProfile = {
            id: userData.sub,
            email: userData.sub,
            name: response.user?.fullName || 'User',
            fullName: response.user?.fullName || 'User',
            role: userData.role || 'CUSTOMER'
          };
          setUserProfile(initialProfile);
          localStorage.setItem('userProfile', JSON.stringify(initialProfile));
        }

        // Return user data with role for redirection logic
        return {
          ...response,
          user: {
            ...response.user,
            role: userData.role || 'CUSTOMER'
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration for:', userData.email);
      const response = await authService.register(userData);
      console.log('✅ Registration response:', response);
      
      const userDataFromToken = authService.getCurrentUser();
      console.log('✅ User data from token:', userDataFromToken);
      
      if (userDataFromToken) {
        setUser(userDataFromToken);
        
        // Create initial profile
        const initialProfile = {
          id: userDataFromToken.sub,
          email: userDataFromToken.sub,
          name: userData.fullName || 'User',
          fullName: userData.fullName || 'User',
          phone: userData.phone || '',
          city: userData.city || '',
          role: userDataFromToken.role || 'CUSTOMER'
        };
        setUserProfile(initialProfile);
        localStorage.setItem('userProfile', JSON.stringify(initialProfile));
      }
      
      return response;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    authService.logout();
    setUser(null);
    setUserProfile(null);
    // Clear all user-specific data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('userProfile') || key.startsWith('cart_') || key.startsWith('freshcart_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  const updateUserProfile = (profileData) => {
    console.log('📝 Updating user profile:', profileData);
    setUserProfile(profileData);
    try {
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      console.log('✅ Profile saved to localStorage');
    } catch (err) {
      console.error('❌ Error saving profile:', err);
    }
  };

  const saveCartToDatabase = async (cartItems) => {
    if (!user) {
      console.log('ℹ️ No user logged in, cannot save cart');
      return;
    }
    try {
      const cartKey = `cart_${user.sub || user.id}`;
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log('✅ Cart saved for user:', user.sub || user.id);
    } catch (err) {
      console.error('❌ Error saving cart:', err);
    }
  };

  const getCartFromDatabase = async () => {
    if (!user) {
      console.log('ℹ️ No user logged in, cannot load cart');
      return [];
    }
    try {
      const cartKey = `cart_${user.sub || user.id}`;
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        console.log('✅ Cart loaded for user:', user.sub || user.id);
        return JSON.parse(savedCart);
      }
      return [];
    } catch (err) {
      console.error('❌ Error loading cart:', err);
      return [];
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    getUserRole,
    login,
    register,
    logout,
    updateUserProfile,
    saveCartToDatabase,
    getCartFromDatabase,
    setUser,
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading FreshCart...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}