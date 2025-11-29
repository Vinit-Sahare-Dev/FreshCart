import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from './cartSlice'
import './nonveg.css'

function NonVeg() {
  const dispatch = useDispatch()

  // Popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupItem, setPopupItem] = useState(null)

  const nonVegDishes = [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Tender chicken in rich buttery tomato gravy',
      price: 320,
      image: '/nonveg/butter-chicken.jpg',
      fallback: '🍗',
      rating: 4.8,
      cookTime: '30 min'
    },
    {
      id: 2,
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with succulent chicken pieces',
      price: 280,
      image: '/nonveg/chicken-biryani.jpg',
      fallback: '🍚',
      rating: 4.7,
      cookTime: '35 min'
    },
    {
      id: 3,
      name: 'Mutton Rogan Josh',
      description: 'Kashmiri style lamb curry with aromatic spices',
      price: 450,
      image: '/nonveg/mutton-rogan-josh.jpg',
      fallback: '🥩',
      rating: 4.6,
      cookTime: '45 min'
    },
    {
      id: 4,
      name: 'Fish Curry',
      description: 'Spicy coastal style fish in coconut gravy',
      price: 380,
      image: '/nonveg/fish-curry.jpg',
      fallback: '🐟',
      rating: 4.5,
      cookTime: '25 min'
    },
    {
      id: 5,
      name: 'Chicken Tikka Masala',
      description: 'Grilled chicken chunks in creamy tomato sauce',
      price: 350,
      image: '/nonveg/chicken-tikka-masala.jpeg',
      fallback: '🍢',
      rating: 4.7,
      cookTime: '30 min'
    },
    {
      id: 6,
      name: 'Prawn Fry',
      description: 'Crispy fried prawns with Indian spices',
      price: 420,
      image: '/nonveg/prawn-fry.JPG',
      fallback: '🦐',
      rating: 4.4,
      cookTime: '20 min'
    },
    {
      id: 7,
      name: 'Egg Curry',
      description: 'Boiled eggs in flavorful onion-tomato gravy',
      price: 180,
      image: '/nonveg/egg-curry.jpeg',
      fallback: '🥚',
      rating: 4.3,
      cookTime: '15 min'
    },
    {
      id: 8,
      name: 'Chicken Korma',
      description: 'Mild and creamy chicken curry with nuts',
      price: 340,
      image: '/nonveg/chicken-korma.jpg',
      fallback: '🍛',
      rating: 4.6,
      cookTime: '35 min'
    },
    {
      id: 9,
      name: 'Mutton Biryani',
      description: 'Aromatic rice with tender mutton pieces',
      price: 380,
      image: '/nonveg/mutton-biryani.jpg',
      fallback: '🍖',
      rating: 4.8,
      cookTime: '50 min'
    },
    {
      id: 10,
      name: 'Chilli Chicken',
      description: 'Indo-Chinese style spicy chicken',
      price: 290,
      image: '/nonveg/chilli-chicken.jpg',
      fallback: '🌶️',
      rating: 4.5,
      cookTime: '20 min'
    },
    {
      id: 11,
      name: 'Fish Fry',
      description: 'Crispy marinated fish fillets',
      price: 320,
      image: '/nonveg/fish-fry.jpg',
      fallback: '🐠',
      rating: 4.4,
      cookTime: '18 min'
    },
    {
      id: 12,
      name: 'Chicken 65',
      description: 'Spicy deep-fried chicken appetizer',
      price: 260,
      image: '/nonveg/chicken-65.jpeg',
      fallback: '🔥',
      rating: 4.6,
      cookTime: '15 min'
    }
  ]

  const [quantities, setQuantities] = useState(
    nonVegDishes.reduce((acc, dish) => {
      acc[dish.id] = 1
      return acc
    }, {})
  )

  const [imageErrors, setImageErrors] = useState({})
  const [imageLoaded, setImageLoaded] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Calculate pagination
  const totalPages = Math.ceil(nonVegDishes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentDishes = nonVegDishes.slice(startIndex, startIndex + itemsPerPage)

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
      category: 'nonveg',
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

  // Generate page numbers for pagination
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
    <div className="nonveg-container">
      {/* Beautiful Popup Notification with Red Theme */}
      {showPopup && (
        <div className="nonveg-cart-popup show">
          <div className="nonveg-popup-content">
            <div className="nonveg-popup-icon">✅</div>
            <div className="nonveg-popup-text">
              <div className="nonveg-popup-title">Added to Cart!</div>
              <div className="nonveg-popup-message">{popupMessage}</div>
              {popupItem && (
                <div className="nonveg-popup-item">
                  <span className="nonveg-tag">🔴 Non-Vegetarian</span>
                </div>
              )}
            </div>
            <button 
              className="nonveg-popup-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
          </div>
          <div className="nonveg-popup-progress"></div>
        </div>
      )}

      <div className="nonveg-header">
        <h1 className="nonveg-title">Non-Veg Specials</h1>
        <p className="nonveg-subtitle">Premium quality meat dishes</p>
        <div className="page-info">
          Page {currentPage} of {totalPages} • Showing {currentDishes.length} of {nonVegDishes.length} dishes
        </div>
      </div>

      <div className="nonveg-dishes-grid">
        {currentDishes.map((dish) => (
          <div key={dish.id} className="nonveg-dish-card">
            <div className="nonveg-badge">Non-Veg</div>
            <div className="nonveg-card-image">
              {/* Always try to load image first */}
              <img 
                src={dish.image} 
                alt={dish.name}
                className="nonveg-dish-image"
                onError={() => handleImageError(dish.id)}
                onLoad={() => handleImageLoad(dish.id)}
                style={{ 
                  display: imageErrors[dish.id] ? 'none' : 'block'
                }}
              />
              
              {/* Show fallback only if image fails to load */}
              {imageErrors[dish.id] && (
                <div className="nonveg-image-fallback">
                  <span className="nonveg-fallback-emoji">{dish.fallback}</span>
                  <span className="nonveg-fallback-text">{dish.name}</span>
                </div>
              )}
            </div>
            
            <div className="nonveg-card-content">
              <div className="nonveg-dish-header">
                <h3 className="nonveg-dish-name">{dish.name}</h3>
                <div className="nonveg-dish-rating">
                  <span className="nonveg-rating-star">⭐</span>
                  <span className="rating-value">{dish.rating}</span>
                </div>
              </div>
              
              <p className="nonveg-dish-description">{dish.description}</p>
              
              <div className="nonveg-dish-meta">
                <span className="nonveg-cook-time">⏱️ {dish.cookTime}</span>
                {imageErrors[dish.id] && (
                  <span className="image-status">📷 Image not available</span>
                )}
              </div>
              
              <div className="nonveg-dish-footer">
                <div className="nonveg-price-section">
                  <span className="nonveg-price">₹{dish.price}</span>
                  <div className="nonveg-total-price">
                    ₹{dish.price * quantities[dish.id]}
                  </div>
                </div>
                
                <div className="nonveg-quantity-controls">
                  <button 
                    className="nonveg-btn nonveg-btn-outline"
                    onClick={() => decreaseQuantity(dish.id)}
                    disabled={quantities[dish.id] <= 1}
                  >
                    -
                  </button>
                  <span className="nonveg-quantity">{quantities[dish.id]}</span>
                  <button 
                    className="nonveg-btn nonveg-btn-outline"
                    onClick={() => increaseQuantity(dish.id)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="nonveg-btn nonveg-btn-primary nonveg-add-to-cart-btn"
                  onClick={() => addToCartHandler(dish)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="nonveg-pagination">
          <button 
            className="nonveg-pagination-btn prev-next"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="nonveg-page-numbers">
            {getPageNumbers().map(page => (
              <button
                key={page}
                className={`nonveg-pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="nonveg-pagination-btn prev-next"
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

export default NonVeg