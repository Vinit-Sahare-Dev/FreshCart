import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const { totalItems } = useSelector(state => state.cart)

  const isActive = (path) => {
    return location.pathname === path
  }

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
      </div>
    </nav>
  )
}

export default Navbar