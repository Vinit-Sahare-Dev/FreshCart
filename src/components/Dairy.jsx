import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from './cartSlice'
import './Veg.css'

function Dairy() {
  const dispatch = useDispatch()

  // Popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupItem, setPopupItem] = useState(null)

  const dairyDishes = [
    {
      id: 1,
      name: 'Gulab Jamun',
      description: 'Soft milk dumplings in sweet rose-flavored syrup',
      price: 120,
      image: 'public/dairy/gulab-jamun.jpg',
      fallback: '🍮',
      rating: 4.6,
      cookTime: '10 min'
    },
    {
      id: 2,
      name: 'Rasmalai',
      description: 'Soft cottage cheese patties in sweetened creamy milk',
      price: 150,
      image: 'public/dairy/rasmalai.jpg',
      fallback: '🥛',
      rating: 4.5,
      cookTime: '5 min'
    },
    {
      id: 3,
      name: 'Kheer',
      description: 'Creamy rice pudding with nuts and cardamom',
      price: 100,
      image: 'public/dairy/kheer.jpg',
      fallback: '🍚',
      rating: 4.4,
      cookTime: '15 min'
    },
    {
      id: 4,
      name: 'Rasgulla',
      description: 'Spongy cottage cheese balls in light sugar syrup',
      price: 110,
      image: 'public/dairy/rasgulla.jpg',
      fallback: '⚪',
      rating: 4.7,
      cookTime: '8 min'
    },
    {
      id: 5,
      name: 'Peda',
      description: 'Sweet milk fudge with saffron and cardamom',
      price: 180,
      image: 'public/dairy/peda.jpg',
      fallback: '🍬',
      rating: 4.3,
      cookTime: '12 min'
    }
  ]

  const [quantities, setQuantities] = useState(
    dairyDishes.reduce((acc, dish) => {
      acc[dish.id] = 1
      return acc
    }, {})
  )

  const [imageErrors, setImageErrors] = useState({})
  const [imageLoaded, setImageLoaded] = useState({})

  const increaseQuantity = (dishId) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: prev[dishId] + 1
    }))
  }

  const decreaseQuantity = (dishId) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: Math.max(1, prev[dishId] - 1)
    }))
  }

  // Show popup function
  const showAddToCartPopup = (message, item) => {
    setPopupMessage(message)
    setPopupItem(item)
    setShowPopup(true)
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowPopup(false)
    }, 3000)
  }

  const addToCartHandler = (dish) => {
    const quantity = quantities[dish.id]
    const cartItem = {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      category: 'dairy',
      quantity: quantity
    }
    
    dispatch(addToCart(cartItem))
    
    // Show beautiful popup instead of alert
    showAddToCartPopup(`Added ${quantity} ${dish.name} to cart!`, dish)
  }

  const handleImageError = (dishId) => {
    console.log(`Image failed to load for dish ${dishId}`)
    setImageErrors(prev => ({
      ...prev,
      [dishId]: true
    }))
  }

  const handleImageLoad = (dishId) => {
    console.log(`Image loaded successfully for dish ${dishId}`)
    setImageLoaded(prev => ({
      ...prev,
      [dishId]: true
    }))
    setImageErrors(prev => ({
      ...prev,
      [dishId]: false
    }))
  }

  return (
    <div className="veg-container">
      {/* Beautiful Popup Notification */}
      {showPopup && (
        <div className="cart-popup show">
          <div className="popup-content">
            <div className="popup-icon">✅</div>
            <div className="popup-text">
              <div className="popup-title">Added to Cart!</div>
              <div className="popup-message">{popupMessage}</div>
              {popupItem && (
                <div className="popup-item">
                  <span className="dairy-tag">🥛 Dairy & Dessert</span>
                </div>
              )}
            </div>
            <button 
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
          </div>
          <div className="popup-progress"></div>
        </div>
      )}

      <div className="veg-header">
        <h1 className="veg-title">Dairy & Desserts</h1>
        <p className="veg-subtitle">Sweet treats and fresh dairy products</p>
      </div>

      <div className="dishes-grid">
        {dairyDishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <div className="card-image">
              {/* Always try to load image first */}
              <img 
                src={dish.image} 
                alt={dish.name}
                className="dish-image"
                onError={() => handleImageError(dish.id)}
                onLoad={() => handleImageLoad(dish.id)}
                style={{ 
                  display: imageErrors[dish.id] ? 'none' : 'block'
                }}
              />
              
              {/* Show fallback only if image fails to load */}
              {imageErrors[dish.id] && (
                <div className="image-fallback">
                  <span className="fallback-emoji">{dish.fallback}</span>
                  <span className="fallback-text">{dish.name}</span>
                </div>
              )}
            </div>
            
            <div className="card-content">
              <div className="dish-header">
                <h3 className="dish-name">{dish.name}</h3>
                <div className="dish-rating">
                  <span className="rating-star">⭐</span>
                  <span className="rating-value">{dish.rating}</span>
                </div>
              </div>
              
              <p className="dish-description">{dish.description}</p>
              
              <div className="dish-meta">
                <span className="cook-time">⏱️ {dish.cookTime}</span>
                {imageErrors[dish.id] && (
                  <span className="image-status">📷 Image not available</span>
                )}
              </div>
              
              <div className="dish-footer">
                <div className="price-section">
                  <span className="price">₹{dish.price}</span>
                  <div className="total-price">
                    ₹{dish.price * quantities[dish.id]}
                  </div>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    className="btn btn-outline"
                    onClick={() => decreaseQuantity(dish.id)}
                    disabled={quantities[dish.id] <= 1}
                  >
                    -
                  </button>
                  <span className="quantity">{quantities[dish.id]}</span>
                  <button 
                    className="btn btn-outline"
                    onClick={() => increaseQuantity(dish.id)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="btn btn-primary add-to-cart-btn"
                  onClick={() => addToCartHandler(dish)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dairy