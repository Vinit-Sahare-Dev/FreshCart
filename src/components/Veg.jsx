import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from './cartSlice'
import dishService from '../services/dishService'
import './Veg.css'

function Veg() {
  const dispatch = useDispatch()

  // Popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupItem, setPopupItem] = useState(null)

  // Dishes state - Initialize with fallback data
  const fallbackVegDishes = [
    {
      id: 1,
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese in rich tomato gravy with butter',
      price: 280,
      image: '/veg/paneer-butter-masala.jpg',
      fallback: '🧀',
      rating: 4.5,
      cookTime: '25 min'
    },
    {
      id: 2,
      name: 'Vegetable Biryani',
      description: 'Fragrant basmati rice with mixed vegetables and spices',
      price: 220,
      image: '/veg/vegbiryani.jpg',
      fallback: '🍚',
      rating: 4.3,
      cookTime: '30 min'
    },
    {
      id: 3,
      name: 'Palak Paneer',
      description: 'Cottage cheese in creamy spinach gravy',
      price: 260,
      image: '/veg/palak-paneer.jpg',
      fallback: '🥬',
      rating: 4.4,
      cookTime: '20 min'
    },
    {
      id: 4,
      name: 'Masala Dosa',
      description: 'Crispy rice crepe with spiced potato filling',
      price: 120,
      image: '/veg/masala-dosa.jpg',
      fallback: '🥞',
      rating: 4.7,
      cookTime: '10 min'
    },
    {
      id: 5,
      name: 'Chole Bhature',
      description: 'Spicy chickpeas with fluffy fried bread',
      price: 180,
      image: '/veg/chole-bhature.jpg',
      fallback: '🥘',
      rating: 4.6,
      cookTime: '15 min'
    },
    {
      id: 6,
      name: 'Vegetable Korma',
      description: 'Mixed vegetables in rich cashew gravy',
      price: 240,
      image: '/veg/vegkorma.jpg',
      fallback: '🥗',
      rating: 4.2,
      cookTime: '25 min'
    },
    {
      id: 7,
      name: 'Aloo Gobi',
      description: 'Potato and cauliflower cooked with Indian spices',
      price: 160,
      image: '/veg/aloo-gobi.jpg',
      fallback: '🥔',
      rating: 4.1,
      cookTime: '20 min'
    },
    {
      id: 8,
      name: 'Baingan Bharta',
      description: 'Smoky roasted eggplant mashed with spices',
      price: 190,
      image: '/veg/baingan-bharta.jpg',
      fallback: '🍆',
      rating: 4.3,
      cookTime: '25 min'
    },
    {
      id: 9,
      name: 'Malai Kofta',
      description: 'Creamy vegetable dumplings in rich gravy',
      price: 290,
      image: '/veg/malai-kofta.jpg',
      fallback: '🍡',
      rating: 4.6,
      cookTime: '30 min'
    },
    {
      id: 10,
      name: 'Dal Makhani',
      description: 'Creamy black lentils simmered overnight',
      price: 200,
      image: '/veg/dal-makhani.jpg',
      fallback: '🫘',
      rating: 4.5,
      cookTime: '15 min'
    },
    {
      id: 11,
      name: 'Mutter Paneer',
      description: 'Cottage cheese with green peas in tomato gravy',
      price: 250,
      image: '/veg/mutter-paneer.jpg',
      fallback: '🧀',
      rating: 4.4,
      cookTime: '20 min'
    },
    {
      id: 12,
      name: 'Vegetable Jalfrezi',
      description: 'Stir-fried vegetables in spicy tomato sauce',
      price: 210,
      image: '/veg/veg-jalfrezi.jpg',
      fallback: '🥘',
      rating: 4.2,
      cookTime: '18 min'
    },
    {
      id: 13,
      name: 'Rajma Masala',
      description: 'Kidney beans in rich onion-tomato gravy',
      price: 170,
      image: '/veg/rajma-masala.jpg',
      fallback: '🫘',
      rating: 4.3,
      cookTime: '20 min'
    },
    {
      id: 14,
      name: 'Gobi Manchurian',
      description: 'Crispy cauliflower in tangy Chinese sauce',
      price: 190,
      image: '/veg/gobi-manchurian.jpg',
      fallback: '🥦',
      rating: 4.5,
      cookTime: '15 min'
    },
    {
      id: 15,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese cubes with spices',
      price: 270,
      image: '/veg/paneer-tikka.jpg',
      fallback: '🔥',
      rating: 4.7,
      cookTime: '12 min'
    },
    {
      id: 16,
      name: 'Vegetable Pulao',
      description: 'Fragrant rice with assorted vegetables',
      price: 150,
      image: '/veg/veg-pulao.jpg',
      fallback: '🍚',
      rating: 4.2,
      cookTime: '15 min'
    },
    {
      id: 17,
      name: 'Aloo Matar',
      description: 'Potatoes and peas in spicy gravy',
      price: 140,
      image: '/veg/aloo-matar.jpg',
      fallback: '🥔',
      rating: 4.0,
      cookTime: '18 min'
    },
    {
      id: 18,
      name: 'Bhindi Masala',
      description: 'Okra cooked with onions and spices',
      price: 160,
      image: '/veg/bhindi-masala.jpg',
      fallback: '🥬',
      rating: 4.3,
      cookTime: '15 min'
    },
    {
      id: 19,
      name: 'Mushroom Matar',
      description: 'Mushrooms and peas in creamy gravy',
      price: 230,
      image: '/veg/mushroom-matar.jpg',
      fallback: '🍄',
      rating: 4.4,
      cookTime: '20 min'
    },
    {
      id: 20,
      name: 'Vegetable Handi',
      description: 'Mixed vegetables cooked in clay pot',
      price: 260,
      image: '/veg/veg-handi.jpg',
      fallback: '🍲',
      rating: 4.5,
      cookTime: '25 min'
    }
  ]

  const [vegDishes, setVegDishes] = useState(fallbackVegDishes)

  // Try to fetch from backend but don't block rendering
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        console.log('Fetching veg dishes from backend...')
        const data = await dishService.getDishesByCategory('veg')
        console.log('Successfully fetched veg dishes:', data)
        if (data && data.length > 0) {
          setVegDishes(data)
        }
      } catch (error) {
        console.warn('Backend unavailable, using fallback data:', error.message)
      }
    }
    fetchDishes()
  }, [])

  // Initialize quantities when vegDishes changes
  useEffect(() => {
    setQuantities(vegDishes.reduce((acc, dish) => {
      acc[dish.id] = 1
      return acc
    }, {}))
  }, [vegDishes])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Calculate total pages
  const totalPages = Math.ceil(vegDishes.length / itemsPerPage)

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = vegDishes.slice(indexOfFirstItem, indexOfLastItem)

  // Use currentItems directly if from backend, else format static data
  const formattedDishes = vegDishes.length > 0 ? currentItems : currentItems.map(dish => ({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    image: dish.imageUrl || 'public/veg/default.jpg', // Assuming imageUrl from backend
    fallback: '🥗',
    rating: dish.rating || 4.5,
    cookTime: dish.cookTime || '25 min'
  }))

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [quantities, setQuantities] = useState(
    vegDishes.reduce((acc, dish) => {
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
      category: 'veg',
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
                  <span className="veg-tag">🟢 Vegetarian</span>
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
        <h1 className="veg-title">Vegetarian Delights</h1>
        <p className="veg-subtitle">Fresh, healthy and delicious vegetarian meals</p>
        
        {/* Page Info */}
        <div className="page-info">
          Page {currentPage} of {totalPages} • Showing {currentItems.length} of {vegDishes.length} items
        </div>
      </div>

      <div className="dishes-grid">
        {currentItems.map((dish) => (
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

      {/* Pagination Controls */}
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

export default Veg