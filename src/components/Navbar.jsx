// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import ProfileSettings from './ProfileSettings';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useSelector(state => state.cart);
  const { isAuthenticated, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setShowProfileSettings(false);
    navigate('/');
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowProfileSettings(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowProfileSettings(true);
  };

  // Get first letter for avatar
  const getAvatarLetter = () => {
    const email = user?.sub || user?.email || 'Account';
    if (email === 'Account') return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
      
      {/* Profile Settings Modal */}
      <ProfileSettings 
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        user={user}
        logout={handleLogout}
      />

      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <span className="brand-icon">🛒</span>
            FreshCart
          </Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
          <Link 
            to="/veg" 
            className={`nav-link ${isActive('/veg') ? 'active' : ''}`}
          >
            🌱 Vegetarian
          </Link>
          <Link 
            to="/non-veg" 
            className={`nav-link ${isActive('/non-veg') ? 'active' : ''}`}
          >
            🍗 Non-Veg
          </Link>
          <Link 
            to="/dairy" 
            className={`nav-link ${isActive('/dairy') ? 'active' : ''}`}
          >
            🥛 Dairy
          </Link>
          <Link 
            to="/cart" 
            className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
          >
            <span className="cart-icon">🛒</span>
            Cart {totalItems > 0 && <span className="cart-count">({totalItems})</span>}
          </Link>

{isAuthenticated ? (
  <button
    onClick={handleAccountClick}
    className={`nav-link ${isActive('/account') ? 'active' : ''}`}
    aria-label="Open Profile Settings"
    title="Profile"
  >
  👤
  <span className="profile-caret">▼</span>
  Profile
  </button>
) : (
  <button 
    onClick={handleAccountClick}
    className={`nav-link ${isActive('/account') ? 'active' : ''}`}
  >
    👤 Account
  </button>
)}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
