import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Predefined admin credentials
  const predefinedAdminCredentials = {
    email: 'admin@hotel.com',
    password: 'Admin123!'
  };

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

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  const [adminLoginData, setAdminLoginData] = useState({
    email: predefinedAdminCredentials.email,
    password: predefinedAdminCredentials.password,
  });

  // Track if this was an admin login attempt
  const [isAdminLoginAttempt, setIsAdminLoginAttempt] = useState(false);

  // Auto-handle success when user becomes authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      console.log('✅ User authenticated, checking for admin redirection...');
      
      const token = localStorage.getItem('hotel_jwt');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
          );
          const userData = JSON.parse(jsonPayload);
          
          console.log('🔍 Decoded user data:', userData);
          
          // Reset forms
          setLoginData({ email: '', password: '' });
          setAdminLoginData({ 
            email: predefinedAdminCredentials.email, 
            password: predefinedAdminCredentials.password 
          });
          setRegisterData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          
          // Close modal first
          onClose();
          
          // Check if this was an admin login attempt or user has admin role
          const shouldRedirectToAdmin = isAdminLoginAttempt || 
                                      userData.role === 'ADMIN' || 
                                      userData.email === predefinedAdminCredentials.email ||
                                      adminLoginData.email === predefinedAdminCredentials.email;
          
          console.log('🔄 Should redirect to admin?', shouldRedirectToAdmin);
          
          if (shouldRedirectToAdmin) {
            console.log('👑 Redirecting to /admin');
            // Reset admin login attempt flag
            setIsAdminLoginAttempt(false);
            // Redirect to admin home page
            setTimeout(() => {
              window.location.href = '/admin';
            }, 100);
          } else {
            console.log('👤 Regular user, triggering success callback');
            if (onSuccess) {
              setTimeout(() => {
                onSuccess();
              }, 100);
            }
          }
        } catch (err) {
          console.error('❌ Error parsing token:', err);
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        }
      }
    }
  }, [isAuthenticated, isOpen, onClose, onSuccess, adminLoginData.email, isAdminLoginAttempt]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAdminLoginChange = (e) => {
    setAdminLoginData({ ...adminLoginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({ ...forgotPasswordData, [e.target.name]: e.target.value });
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
      
      console.log('🔐 Login successful, waiting for auth state update...');
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsAdminLoginAttempt(true);

    try {
      console.log('👑 Attempting admin login with:', adminLoginData);
      
      const credentials = {
        email: adminLoginData.email || predefinedAdminCredentials.email,
        password: adminLoginData.password || predefinedAdminCredentials.password
      };
      
      await login(credentials);
      
      console.log('✅ Admin login successful, waiting for auth state update...');
    } catch (err) {
      console.error('❌ Admin login error:', err);
      setError(err.response?.data?.message || err.message || 'Admin login failed. Please check your credentials.');
      setLoading(false);
      setIsAdminLoginAttempt(false);
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
      console.log('📝 Attempting registration with:', {
        fullName: registerData.fullName,
        email: registerData.email,
        password: '***',
        role: 'CUSTOMER'
      });
      
      const result = await register({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        role: 'CUSTOMER',
      });
      
      console.log('✅ Registration successful:', result);
      
      // FIX 1: After successful registration, switch to login tab instead of auto-login
      setActiveTab('login');
      setError('');
      
      // Show success message
      setError('✅ Registration successful! Please login with your credentials.');
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      
      if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        setError('Network error: Cannot connect to server. Please check if your backend is running.');
      } else if (err.response?.status === 500) {
        setError('Server error: Please try again later.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid registration data.');
      } else if (err.response?.status === 409) {
        setError('Email already registered. Please use a different email or login.');
      } else {
        setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setError(`Password reset instructions sent to ${forgotPasswordData.email}`);
      setShowForgotPassword(false);
      setForgotPasswordData({ email: '' });
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset forms when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLoginData({ email: '', password: '' });
      setAdminLoginData({ 
        email: predefinedAdminCredentials.email, 
        password: predefinedAdminCredentials.password 
      });
      setRegisterData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setForgotPasswordData({ email: '' });
      setError('');
      setLoading(false);
      setShowForgotPassword(false);
      setShowAdminLogin(false);
      setIsAdminLoginAttempt(false);
    }
  }, [isOpen]);

  // Auto-fill admin credentials when admin login is shown
  useEffect(() => {
    if (showAdminLogin) {
      setAdminLoginData({
        email: predefinedAdminCredentials.email,
        password: predefinedAdminCredentials.password
      });
    }
  }, [showAdminLogin]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {showForgotPassword ? '🔑 Forgot Password' : 
             showAdminLogin ? '👑 Admin Login' : '🔐 Authentication Required'}
          </h2>
          <p className="auth-modal-subtitle">
            {showForgotPassword 
              ? 'Enter your email to reset your password' 
              : showAdminLogin
              ? `Use: ${predefinedAdminCredentials.email} / ${predefinedAdminCredentials.password}`
              : 'Please login or create an account to continue'
            }
          </p>
        </div>

        {!showForgotPassword && !showAdminLogin && (
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
        )}

        {error && (
          <div className={`auth-modal-error ${error.includes('✅') ? 'auth-modal-success' : ''}`}>
            <span className="error-icon">{error.includes('✅') ? '✅' : '⚠️'}</span>
            {error}
          </div>
        )}

        <div className="auth-modal-content">
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="auth-modal-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Email Address</label>
                <input
                  type="email"
                  id="forgot-email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={forgotPasswordData.email}
                  onChange={handleForgotPasswordChange}
                  required
                  autoComplete="email"
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
                    Sending instructions...
                  </>
                ) : (
                  '📧 Send Reset Instructions'
                )}
              </button>

              <div className="auth-modal-footer">
                <p className="auth-modal-info">
                  Remember your password?{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => setShowForgotPassword(false)}
                    disabled={loading}
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </form>
          ) : showAdminLogin ? (
            <form onSubmit={handleAdminLogin} className="auth-modal-form">
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <input
                  type="email"
                  id="admin-email"
                  name="email"
                  placeholder="admin@hotel.com"
                  value={adminLoginData.email}
                  onChange={handleAdminLoginChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Admin Password</label>
                <input
                  type="password"
                  id="admin-password"
                  name="password"
                  placeholder="Enter admin password"
                  value={adminLoginData.password}
                  onChange={handleAdminLoginChange}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <div className="login-options">
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={() => setShowForgotPassword(true)}
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>

              <button 
                type="submit" 
                className="auth-modal-button admin-login-btn" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  '👑 Sign In as Admin'
                )}
              </button>

              <div className="predefined-credentials">
                <p style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', margin: '1rem 0' }}>
                  <strong>Predefined Credentials:</strong><br />
                  Email: {predefinedAdminCredentials.email}<br />
                  Password: {predefinedAdminCredentials.password}
                </p>
              </div>

              <div className="auth-modal-footer">
                <p className="auth-modal-info">
                  Not an admin?{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => setShowAdminLogin(false)}
                    disabled={loading}
                  >
                    Back to User Login
                  </button>
                </p>
              </div>
            </form>
          ) : activeTab === 'login' ? (
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

              <div className="login-options">
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={() => setShowForgotPassword(true)}
                  disabled={loading}
                >
                  Forgot your password?
                </button>
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

              <div className="admin-login-section">
                <div className="admin-divider">
                  <span>Admin Access</span>
                </div>
                <div className="admin-info">
                  <p className="admin-note">
                    👑 Restaurant staff and administrators
                  </p>
                  <button
                    type="button"
                    className="auth-modal-button admin-login-btn"
                    onClick={() => setShowAdminLogin(true)}
                    disabled={loading}
                  >
                    👑 Admin Login
                  </button>
                </div>
              </div>
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
                  '✨ Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        {!showForgotPassword && !showAdminLogin && (
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
        )}
      </div>
    </div>
  );
}

export default AuthModal;