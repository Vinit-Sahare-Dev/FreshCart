import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/freshcart') {
      return location.pathname === '/freshcart' || location.pathname === '/freshcart/'
    }
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/freshcart">
          <span className="brand-icon">🛒</span>
          FreshCart
        </Link>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/freshcart" 
          className={`nav-link ${isActive('/freshcart') ? 'active' : ''}`}
        >
          🏠 Home
        </Link>
        <Link 
          to="/freshcart/veg" 
          className={`nav-link ${isActive('/freshcart/veg') ? 'active' : ''}`}
        >
          🌱 Vegetarian
        </Link>
        <Link 
          to="/freshcart/non-veg" 
          className={`nav-link ${isActive('/freshcart/non-veg') ? 'active' : ''}`}
        >
          🍗 Non-Veg
        </Link>
        <Link 
          to="/freshcart/dairy" 
          className={`nav-link ${isActive('/freshcart/dairy') ? 'active' : ''}`}
        >
          🥛 Dairy
        </Link>
        <Link 
          to="/freshcart/cart" 
          className="nav-link cart-link"
        >
          <span className="cart-icon">🛒</span>
          Cart
        </Link>
      </div>
    </nav>
  )
}

export default Navbar