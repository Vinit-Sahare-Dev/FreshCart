import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/freshcart">FoodExpress</Link>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/freshcart" 
          className={`nav-link ${location.pathname === '/freshcart' || location.pathname === '/freshcart/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/freshcart/veg" 
          className={`nav-link ${location.pathname === '/freshcart/veg' ? 'active' : ''}`}
        >
          Vegetarian
        </Link>
        <Link 
          to="/freshcart/non-veg" 
          className={`nav-link ${location.pathname === '/freshcart/non-veg' ? 'active' : ''}`}
        >
          Non-Veg
        </Link>
        <Link 
          to="/freshcart/dairy" 
          className={`nav-link ${location.pathname === '/freshcart/dairy' ? 'active' : ''}`}
        >
          Dairy
        </Link>
        <Link 
          to="/freshcart/cart" 
          className="nav-link cart-link"
        >
          🛒 Cart
        </Link>
      </div>
    </nav>
  )
}

export default Navbar