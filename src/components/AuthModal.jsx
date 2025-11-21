// src/components/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Auto-handle success when user becomes authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      console.log('User authenticated, triggering success callback');
      // Reset forms
      setLoginData({ email: '', password: '' });
      setRegisterData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      // Close modal and trigger success
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isAuthenticated, isOpen, onClose, onSuccess]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      });
      
      console.log('Login successful, waiting for auth state update...');
      // The useEffect above will handle the success callback automatically
    } catch (err) {
      console.error('Login error:', err);
      console.error('Login error details:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!registerData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration with:', {
        fullName: registerData.fullName,
        email: registerData.email,
        password: '***', // Don't log actual password
        role: 'CUSTOMER'
      });
      
      // Register the user
      const result = await register({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        role: 'CUSTOMER',
      });
      
      console.log('Registration successful:', result);
      console.log('Registration successful, waiting for auth state update...');
      // The useEffect above will handle the success callback automatically
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Registration error details:', {
        message: err.message,
        response: err.response,
        config: err.config,
        stack: err.stack
      });
      
      if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        setError('Network error: Cannot connect to server. Please check if your backend is running.');
      } else if (err.response?.status === 500) {
        setError('Server error: Please try again later.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid registration data.');
      } else {
        setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset forms when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLoginData({ email: '', password: '' });
      setRegisterData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">🔐 Authentication Required</h2>
          <p className="auth-modal-subtitle">Please login or create an account to continue</p>
        </div>

        <div className="auth-modal-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="auth-modal-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="auth-modal-content">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-modal-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="auth-modal-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  '🔓 Sign In'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-modal-form">
              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>
                <input
                  type="text"
                  id="register-name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={registerData.fullName}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email Address</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  placeholder="Create a password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  minLength="6"
                  autoComplete="new-password"
                  disabled={loading}
                />
                <small className="password-hint">Must be at least 6 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm">Confirm Password</label>
                <input
                  type="password"
                  id="register-confirm"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="auth-modal-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating account...
                  </>
                ) : (
                  '✨ Create Account & Continue'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="auth-modal-footer">
          <p className="auth-modal-info">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;