import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from './cartSlice'
import './Veg.css'

function Snacks() {
  const dispatch = useDispatch()

  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupItem, setPopupItem] = useState(null)

  const snacksDishes = [
    {
      id: 1,
      name: 'Samosa',
      description: 'Crispy fried pastry with spiced potato filling',
      price: 40,
      image: '/snacks/samosa.jpg',
      fallback: '🥟',
      rating: 4.6,
      cookTime: '10 min'
    },
    {
      id: 2,
      name: 'Pakora Mix',
      description: 'Assorted vegetable fritters with chutney',
      price: 80,
      image: '/snacks/pakora.jpg',
      fallback: '🍤',
      rating: 4.5,
      cookTime: '12 min'
    },
    {
      id: 3,
      name: 'Spring Rolls',
      description: 'Crispy rolls filled with vegetables',
      price: 120,
      image: '/snacks/spring-rolls.jpg',
      fallback: '🌯',
      rating: 4.4,
      cookTime: '15 min'
    },
    {
      id: 4,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese with spices',
      price: 180,
      image: '/snacks/paneer-tikka.jpg',
      fallback: '🔥',
      rating: 4.7,
      cookTime: '12 min'
    },
    {
      id: 5,
      name: 'Aloo Tikki',
      description: 'Spiced potato patties with chutneys',
      price: 60,
      image: '/snacks/aloo-tikki.jpg',
      fallback: '🥔',
      rating: 4.3,
      cookTime: '10 min'
    },
    {
      id: 6,
      name: 'Vada Pav',
      description: 'Mumbai street food - potato fritter in bun',
      price: 50,
      image: '/snacks/vada-pav.jpg',
      fallback: '🍔',
      rating: 4.5,
      cookTime: '8 min'
    },
    {
      id: 7,
      name: 'Pani Puri',
      description: 'Crispy puris with tangy flavored water',
      price: 60,
      image: '/snacks/pani-puri.jpg',
      fallback: '⚪',
      rating: 4.8,
      cookTime: '5 min'
    },
    {
      id: 8,
      name: 'Dhokla',
      description: 'Steamed savory cake from fermented batter',
      price: 80,
      image: '/snacks/dhokla.jpg',
      fallback: '🧇',
      rating: 4.4,
      cookTime: '15 min'
    },
    {
      id: 9,
      name: 'Kachori',
      description: 'Spicy lentil-filled fried bread',
      price: 50,
      image: '/snacks/kachori.jpg',
      fallback: '🥯',
      rating: 4.6,
      cookTime: '10 min'
    },
    {
      id: 10,
      name: 'Bhel Puri',
      description: 'Puffed rice with vegetables and chutney',
      price: 70,
      image: '/snacks/bhel-puri.jpg',
      fallback: '🥗',
      rating: 4.5,
      cookTime: '5 min'
    },
    {
      id: 11,
      name: 'Corn Chaat',
      description: 'Spiced sweet corn with tangy dressing',
      price: 90,
      image: '/snacks/corn-chaat.jpg',
      fallback: '🌽',
      rating: 4.3,
      cookTime: '8 min'
    },
    {
      id: 12,
      name: 'Momos (Veg)',
      description: 'Steamed dumplings with spicy sauce',
      price: 100,
      image: '/snacks/momos.jpg',
      fallback: '🥟',
      rating: 4.7,
      cookTime: '12 min'
    },
    {
      id: 13,
      name: 'French Fries',
      description: 'Crispy golden potato fries',
      price: 80,
      image: '/snacks/french-fries.jpg',
      fallback: '🍟',
      rating: 4.4,
      cookTime: '10 min'
    },
    {
      id: 14,
      name: 'Nachos',
      description: 'Tortilla chips with cheese and salsa',
      price: 150,
      image: '/snacks/nachos.jpg',
      fallback: '🧀',
      rating: 4.6,
      cookTime: '8 min'
    },
    {
      id: 15,
      name: 'Pav Bhaji',
      description: 'Spiced vegetable curry with butter bread',
      price: 120,
      image: '/snacks/pav-bhaji.jpg',
      fallback: '🍲',
      rating: 4.8,
      cookTime: '15 min'
    },
    {
      id: 16,
      name: 'Cheese Balls',
      description: 'Crispy fried cheese-filled balls',
      price: 140,
      image: '/snacks/cheese-balls.jpg',
      fallback: '🧀',
      rating: 4.5,
      cookTime: '10 min'
    }
  ]

  const [quantities, setQuantities] = useState(
    snacksDishes.reduce((acc, dish) => {
      acc[dish.id] = 1
      return acc
    }, {})
  )

  const [imageErrors, setImageErrors] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const totalPages = Math.ceil(snacksDishes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentDishes = snacksDishes.slice(startIndex, startIndex + itemsPerPage)

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

  const showAddToCartPopup = (message, item) => {
    setPopupMessage(message)
    setPopupItem(item)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  const addToCartHandler = (dish) => {
    const quantity = quantities[dish.id]
    const cartItem = {
      id: dish.id + 10000, // Offset to avoid ID conflicts
      name: dish.name,
      price: dish.price,
      image: dish.image,
      category: 'snacks',
      quantity: quantity
    }
    
    dispatch(addToCart(cartItem))
    showAddToCartPopup(`Added ${quantity} ${dish.name} to cart!`, dish)
  }

  const handleImageError = (dishId) => {
    setImageErrors(prev => ({ ...prev, [dishId]: true }))
  }

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="veg-container snacks-container">
      {showPopup && (
        <div className="cart-popup show snacks-popup">
          <div className="popup-content">
            <div className="popup-icon snacks-icon">✅</div>
            <div className="popup-text">
              <div className="popup-title">Added to Cart!</div>
              <div className="popup-message">{popupMessage}</div>
              {popupItem && (
                <div className="popup-item">
                  <span className="snacks-tag">🍿 Snack</span>
                </div>
              )}
            </div>
            <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
          </div>
          <div className="popup-progress snacks-progress"></div>
        </div>
      )}

      <div className="veg-header snacks-header">
        <h1 className="veg-title snacks-title">Snacks & Appetizers</h1>
        <p className="veg-subtitle">Quick bites and delicious starters</p>
        <div className="page-info">
          Page {currentPage} of {totalPages} • Showing {currentDishes.length} of {snacksDishes.length} items
        </div>
      </div>

      <div className="dishes-grid">
        {currentDishes.map((dish) => (
          <div key={dish.id} className="dish-card snacks-card">
            <div className="card-image">
              <img 
                src={dish.image} 
                alt={dish.name}
                className="dish-image"
                onError={() => handleImageError(dish.id)}
                style={{ display: imageErrors[dish.id] ? 'none' : 'block' }}
              />
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
                <div className="dish-rating snacks-rating">
                  <span className="rating-star">⭐</span>
                  <span className="rating-value">{dish.rating}</span>
                </div>
              </div>
              
              <p className="dish-description">{dish.description}</p>
              
              <div className="dish-meta">
                <span className="cook-time">⏱️ {dish.cookTime}</span>
              </div>
              
              <div className="dish-footer">
                <div className="price-section">
                  <span className="price">₹{dish.price}</span>
                  <div className="total-price snacks-total">
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
                  className="btn btn-primary add-to-cart-btn snacks-btn"
                  onClick={() => addToCartHandler(dish)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn prev-next"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {getPageNumbers().map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-btn prev-next"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Snacks