// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useSelector(state => state.cart);
  const { isAuthenticated, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/account');
  };

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
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

          {/* Account/Login Button */}
          {isAuthenticated ? (
            <>
              <div className="nav-link user-info">
                {user?.sub || 'User'}
              </div>
              <button 
                onClick={handleLogout}
                className="nav-link logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={handleAccountClick}
              className="nav-link login-btn"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;