// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useSelector(state => state.cart);
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
          className="nav-link cart-link"
        >
          <span className="cart-icon">🛒</span>
          Cart {totalItems > 0 && <span className="cart-count">({totalItems})</span>}
        </Link>

        {isAuthenticated ? (
          <>
            <span className="nav-link user-info">
              👤 {user?.sub || 'User'}
            </span>
            <button 
              onClick={handleLogout}
              className="nav-link logout-btn"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              🔐 Login
            </Link>
            <Link 
              to="/register" 
              className={`nav-link register-link ${isActive('/register') ? 'active' : ''}`}
            >
              ✨ Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

