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
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setShowProfileSettings(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleProfileClose = () => {
    setShowProfileSettings(false);
  };

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <ProfileSettings 
        isOpen={showProfileSettings}
        onClose={handleProfileClose}
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
            Home
          </Link>
          <Link 
            to="/veg" 
            className={`nav-link ${isActive('/veg') ? 'active' : ''}`}
          >
            Vegetarian
          </Link>
          <Link 
            to="/non-veg" 
            className={`nav-link ${isActive('/non-veg') ? 'active' : ''}`}
          >
            Non-Veg
          </Link>
          <Link 
            to="/dairy" 
            className={`nav-link ${isActive('/dairy') ? 'active' : ''}`}
          >
            Desserts
          </Link>
          <Link 
            to="/beverages" 
            className={`nav-link ${isActive('/beverages') ? 'active' : ''}`}
          >
            Beverages
          </Link>
          
          {/* Cart Link with Count */}
          <Link 
            to="/cart" 
            className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
          >
            <span className="cart-icon">🛒</span>
            Cart 
            {totalItems > 0 && <span className="cart-count">({totalItems})</span>}
          </Link>

          {/* Single Profile/Login Button */}
          <button 
            onClick={handleProfileClick}
            className={`nav-link profile-btn ${isAuthenticated ? 'authenticated' : ''}`}
          >
            {isAuthenticated ? (
              <>
                <span className="profile-icon">👤</span>
                Profile
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;