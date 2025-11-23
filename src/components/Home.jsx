import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Home.css'

function Home() {
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Check for profile saved message from sessionStorage
    const profileSavedMessage = sessionStorage.getItem('profileSavedMessage')
    if (profileSavedMessage) {
      setShowNotification(true)
      // Clear the message from sessionStorage
      sessionStorage.removeItem('profileSavedMessage')
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])
  const categories = [
    {
      name: 'Vegetarian Delights',
      path: '/freshcart/veg',
      image: '🥗',
      description: 'Fresh plant-based meals'
    },
    {
      name: 'Non-Veg Specials',
      path: '/freshcart/non-veg',
      image: '🍗',
      description: 'Premium meat dishes'
    },
    {
      name: 'Dairy & Desserts',
      path: '/freshcart/dairy',
      image: '🍦',
      description: 'Sweet treats & more'
    }
  ]

  return (
    <div className="home-container">
      {/* Profile Saved Notification */}
      {showNotification && (
        <div className="notification-banner success">
          <div className="notification-content">
            <span className="notification-icon">✓</span>
            <span className="notification-text">Profile updated successfully!</span>
            <button 
              className="notification-close" 
              onClick={() => setShowNotification(false)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="home-hero">
        <h1 className="home-hero-title">
          Restaurant Quality Food <span className="hero-highlight">Delivered</span>
        </h1>
        <p className="home-hero-subtitle">
          Experience chef-crafted meals delivered hot and fresh to your doorstep. From gourmet dishes to comfort food.
        </p>
        <button className="home-shop-button">
          Order Now 🚀
        </button>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="section-title">
          Explore Our Menu
        </h2>
        <div className="home-category-grid">
          {categories.map((category, index) => (
            <div key={index} className="home-category-card">
              <div className="home-category-icon">
                {category.image}
              </div>
              <h3 className="home-category-title">{category.name}</h3>
              <p className="home-category-desc">{category.description}</p>
              <Link to={category.path} className="home-category-link">
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features-grid">
        <div className="home-feature-item">
          <div className="home-feature-icon">
            <span>🚀</span>
          </div>
          <h3 className="home-feature-title">Fast Delivery</h3>
          <p className="home-feature-desc">30-minutes or free</p>
        </div>
        <div className="home-feature-item">
          <div className="home-feature-icon">
            <span>👨‍🍳</span>
          </div>
          <h3 className="home-feature-title">Chef Crafted</h3>
          <p className="home-feature-desc">Restaurant quality meals</p>
        </div>
        <div className="home-feature-item">
          <div className="home-feature-icon">
            <span>💳</span>
          </div>
          <h3 className="home-feature-title">Secure Payment</h3>
          <p className="home-feature-desc">100% secure transactions</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">FreshCart</h3>
              <p className="footer-desc">
                Delivering restaurant-quality meals to your doorstep. Fresh, fast, and delicious.
              </p>
              <div className="social-links">
                <a href="https://github.com/Vinit-Sahare-Dev" className="social-link" aria-label="GitHub">
                  <span className="social-icon">🐙</span>
                  GitHub
                </a>
                <a href="https://linkedin.com/in/vinit-sahare" className="social-link" aria-label="LinkedIn">
                  <span className="social-icon">💼</span>
                  LinkedIn
                </a>
                <a href="mailto:vinit.sahare@email.com" className="social-link" aria-label="Email">
                  <span className="social-icon">📧</span>
                  Email
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/freshcart/veg">Vegetarian</Link></li>
                <li><Link to="/freshcart/non-veg">Non-Veg</Link></li>
                <li><Link to="/freshcart/dairy">Dairy</Link></li>
                <li><Link to="/freshcart/cart">Cart</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">Support</h4>
              <ul className="footer-links">
                <li><a href="/help">Help Center</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/careers">Careers</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">Contact Info</h4>
              <div className="contact-info">
                <p>📞 +1 (555) 123-4567</p>
                <p>📧 hello@foodexpress.com</p>
                <p>📍 123 Food Street, Flavor City</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 FreshCart. All rights reserved. | Crafted with ❤️ by Vinit Sahare</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home