// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        setShowAuthModal(true);
        setAccessDenied(false);
      } else if (requireAdmin) {
        // Check if user is admin
        const token = localStorage.getItem('hotel_jwt');
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            const userData = JSON.parse(jsonPayload);
            
            const isAdmin = userData.role === 'ADMIN' || userData.email === 'admin@hotel.com';
            
            if (!isAdmin) {
              setAccessDenied(true);
            }
          } catch (err) {
            console.error('Error checking admin status:', err);
            setAccessDenied(true);
          }
        } else {
          setAccessDenied(true);
        }
      }
    }
  }, [isAuthenticated, loading, requireAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-large"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Administrator access required for this page
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            window.location.href = '/';
          }}
          onSuccess={() => {
            setShowAuthModal(false);
            // The AuthModal will handle admin redirection automatically
          }}
        />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to access this page
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Login / Register
            </button>
          </div>
        </div>
      </>
    );
  }

  return children;
}

export default ProtectedRoute;