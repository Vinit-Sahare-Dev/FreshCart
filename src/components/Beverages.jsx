// src/components/Beverages.jsx
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from './cartSlice'
import dishService from '../services/dishService'
import './Beverages.css'

function Beverages() {
  const dispatch = useDispatch()

  // Popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupItem, setPopupItem] = useState(null)

  // Beverages state - Initialize with mixed cold and hot beverages, water first
  const fallbackBeverages = [
    // Water always first
    {
      id: 1,
      name: 'Mineral Water',
      description: 'Pure mineral water, 500ml bottle',
      price: 20,
      image: '/beverages/water.jpg',
      fallback: '💧',
      rating: 4.8,
      category: 'cold',
      type: 'water',
      isCold: true
    },
    // Mixed cold and hot beverages
    {
      id: 2,
      name: 'Filter Coffee',
      description: 'South Indian style filter coffee',
      price: 70,
      image: '/beverages/filter-coffee.jpg',
      fallback: '☕',
      rating: 4.7,
      category: 'hot',
      type: 'coffee',
      isCold: false
    },
    {
      id: 3,
      name: 'Iced Coffee',
      description: 'Chilled coffee with ice and milk',
      price: 100,
      image: '/beverages/iced-coffee.jpg',
      fallback: '🥤',
      rating: 4.5,
      category: 'cold',
      type: 'coffee',
      isCold: true
    },
    {
      id: 4,
      name: 'Green Tea',
      description: 'Healthy green tea with antioxidants',
      price: 50,
      image: '/beverages/green-tea.jpg',
      fallback: '🍵',
      rating: 4.5,
      category: 'hot',
      type: 'tea',
      isCold: false
    },
    {
      id: 5,
      name: 'Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 90,
      image: '/beverages/orange-juice.jpg',
      fallback: '🍊',
      rating: 4.7,
      category: 'cold',
      type: 'juice',
      isCold: true
    },
    {
      id: 6,
      name: 'Cappuccino',
      description: 'Espresso with steamed milk foam',
      price: 120,
      image: '/beverages/cappuccino.jpg',
      fallback: '☕',
      rating: 4.6,
      category: 'hot',
      type: 'coffee',
      isCold: false
    },
    {
      id: 7,
      name: 'Apple Juice',
      description: 'Sweet and refreshing apple juice',
      price: 80,
      image: '/beverages/apple-juice.jpg',
      fallback: '🍎',
      rating: 4.5,
      category: 'cold',
      type: 'juice',
      isCold: true
    },
    {
      id: 8,
      name: 'Black Tea',
      description: 'Strong black tea with milk option',
      price: 40,
      image: '/beverages/black-tea.jpg',
      fallback: '☕',
      rating: 4.6,
      category: 'hot',
      type: 'tea',
      isCold: false
    },
    {
      id: 9,
      name: 'Coca Cola',
      description: 'Classic Coca Cola, 300ml can',
      price: 50,
      image: '/beverages/coca-cola.jpg',
      fallback: '🥤',
      rating: 4.8,
      category: 'cold',
      type: 'soft-drink',
      isCold: true
    },
    {
      id: 10,
      name: 'Herbal Tea',
      description: 'Soothing chamomile and mint herbal tea',
      price: 60,
      image: '/beverages/herbal-tea.jpg',
      fallback: '🌿',
      rating: 4.4,
      category: 'hot',
      type: 'tea',
      isCold: false
    },
    {
      id: 11,
      name: 'Pepsi',
      description: 'Refreshing Pepsi, 300ml can',
      price: 45,
      image: '/beverages/pepsi.jpg',
      fallback: '🥤',
      rating: 4.7,
      category: 'cold',
      type: 'soft-drink',
      isCold: true
    },
    {
      id: 12,
      name: 'Hot Milk',
      description: 'Warm milk with honey option',
      price: 40,
      image: '/beverages/hot-milk.jpg',
      fallback: '🥛',
      rating: 4.2,
      category: 'hot',
      type: 'milk',
      isCold: false
    },
    {
      id: 13,
      name: 'Berry Smoothie',
      description: 'Mixed berry smoothie with yogurt',
      price: 150,
      image: '/beverages/berry-smoothie.jpg',
      fallback: '🍓',
      rating: 4.6,
      category: 'cold',
      type: 'smoothie',
      isCold: true
    },
    {
      id: 14,
      name: 'Badam Milk',
      description: 'Almond flavored warm milk drink',
      price: 80,
      image: '/beverages/badam-milk.jpg',
      fallback: '🌰',
      rating: 4.6,
      category: 'hot',
      type: 'milk',
      isCold: false
    },
    {
      id: 15,
      name: 'Mango Smoothie',
      description: 'Creamy mango smoothie',
      price: 140,
      image: '/beverages/mango-smoothie.jpg',
      fallback: '🥭',
      rating: 4.8,
      category: 'cold',
      type: 'smoothie',
      isCold: true
    },
    {
      id: 16,
      name: 'Hot Chocolate',
      description: 'Rich cocoa with steamed milk and marshmallows',
      price: 110,
      image: '/beverages/hot-chocolate.jpg',
      fallback: '☕',
      rating: 4.8,
      category: 'hot',
      type: 'hot-chocolate',
      isCold: false
    },
    {
      id: 17,
      name: 'Red Bull',
      description: 'Energy drink, 250ml can',
      price: 120,
      image: '/beverages/red-bull.jpg',
      fallback: '⚡',
      rating: 4.3,
      category: 'cold',
      type: 'energy-drink',
      isCold: true
    },
    {
      id: 18,
      name: 'White Hot Chocolate',
      description: 'Creamy white chocolate drink',
      price: 130,
      image: '/beverages/white-hot-chocolate.jpg',
      fallback: '☕',
      rating: 4.5,
      category: 'hot',
      type: 'hot-chocolate',
      isCold: false
    },
    {
      id: 19,
      name: 'Monster Energy',
      description: 'Green energy drink, 500ml can',
      price: 150,
      image: '/beverages/monster.jpg',
      fallback: '⚡',
      rating: 4.4,
      category: 'cold',
      type: 'energy-drink',
      isCold: true
    },
    {
      id: 20,
      name: 'Fresh Lime Soda',
      description: 'Sparkling soda with fresh lime and mint',
      price: 60,
      image: '/beverages/lime-soda.jpg',
      fallback: '🥤',
      rating: 4.3,
      category: 'normal',
      type: 'soda',
      isCold: false
    },
    {
      id: 21,
      name: 'Chocolate Milkshake',
      description: 'Rich chocolate milkshake with cream',
      price: 130,
      image: '/beverages/chocolate-milkshake.jpg',
      fallback: '🍫',
      rating: 4.7,
      category: 'cold',
      type: 'milkshake',
      isCold: true
    },
    {
      id: 22,
      name: 'Mango Lassi',
      description: 'Creamy yogurt drink with sweet mango pulp',
      price: 120,
      image: '/beverages/mango-lassi.jpg',
      fallback: '🥭',
      rating: 4.7,
      category: 'normal',
      type: 'lassi',
      isCold: false
    },
    {
      id: 23,
      name: 'Vanilla Milkshake',
      description: 'Creamy vanilla milkshake',
      price: 120,
      image: '/beverages/vanilla-milkshake.jpg',
      fallback: '🍦',
      rating: 4.6,
      category: 'cold',
      type: 'milkshake',
      isCold: true
    },
    {
      id: 24,
      name: 'Sweet Lassi',
      description: 'Refreshing sweet yogurt drink',
      price: 100,
      image: '/beverages/sweet-lassi.jpg',
      fallback: '🥛',
      rating: 4.5,
      category: 'normal',
      type: 'lassi',
      isCold: false
    }
  ]

  const [beverages, setBeverages] = useState(fallbackBeverages)
  const [temperatureFilter, setTemperatureFilter] = useState('all') // 'all', 'hot', 'cold', 'normal'
  const [typeFilter, setTypeFilter] = useState('all') // 'all', 'water', 'tea', 'coffee', etc.

  // Filter beverages based on temperature and type
  const filteredBeverages = beverages.filter(beverage => {
    const temperatureMatch = temperatureFilter === 'all' || beverage.category === temperatureFilter
    const typeMatch = typeFilter === 'all' || beverage.type === typeFilter
    return temperatureMatch && typeMatch
  })

  // Try to fetch from backend but don't block rendering
  useEffect(() => {
    const fetchBeverages = async () => {
      try {
        console.log('Fetching beverages from backend...')
        const data = await dishService.getDishesByCategory('beverages')
        console.log('Successfully fetched beverages:', data)
        if (data && data.length > 0) {
          setBeverages(data)
        }
      } catch (error) {
        console.warn('Backend unavailable, using fallback data:', error.message)
      }
    }
    fetchBeverages()
  }, [])

  // Initialize quantities when beverages changes
  useEffect(() => {
    setQuantities(beverages.reduce((acc, beverage) => {
      acc[beverage.id] = 1
      return acc
    }, {}))
  }, [beverages])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Calculate total pages
  const totalPages = Math.ceil(filteredBeverages.length / itemsPerPage)

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBeverages.slice(indexOfFirstItem, indexOfLastItem)

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
    beverages.reduce((acc, beverage) => {
      acc[beverage.id] = 1
      return acc
    }, {})
  )

  const [imageErrors, setImageErrors] = useState({})

  const increaseQuantity = (beverageId) => {
    setQuantities(prev => ({
      ...prev,
      [beverageId]: prev[beverageId] + 1
    }))
  }

  const decreaseQuantity = (beverageId) => {
    setQuantities(prev => ({
      ...prev,
      [beverageId]: Math.max(1, prev[beverageId] - 1)
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

  const addToCartHandler = (beverage) => {
    const quantity = quantities[beverage.id]
    const cartItem = {
      id: beverage.id,
      name: beverage.name,
      price: beverage.price,
      image: beverage.image,
      category: 'beverages',
      quantity: quantity
    }
    
    dispatch(addToCart(cartItem))
    
    // Show beautiful popup instead of alert
    showAddToCartPopup(`Added ${quantity} ${beverage.name} to cart!`, beverage)
  }

  const handleImageError = (beverageId) => {
    console.log(`Image failed to load for beverage ${beverageId}`)
    setImageErrors(prev => ({
      ...prev,
      [beverageId]: true
    }))
  }

  const handleImageLoad = (beverageId) => {
    setImageErrors(prev => ({
      ...prev,
      [beverageId]: false
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

  // Get unique types for filter
  const beverageTypes = [...new Set(beverages.map(b => b.type))]

  return (
    <div className="beverages-container">
      {/* Beautiful Popup Notification */}
      {showPopup && (
        <div className="cart-popup show">
          <div className="popup-content">
            <div className="popup-icon">🥤</div>
            <div className="popup-text">
              <div className="popup-title">Added to Cart!</div>
              <div className="popup-message">{popupMessage}</div>
              {popupItem && (
                <div className="popup-item">
                  <span className="temp-tag">
                    {popupItem.isCold ? '❄️ Cold Drink' : popupItem.category === 'hot' ? '🔥 Hot Drink' : '🌡️ Normal Drink'}
                  </span>
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

      <div className="beverages-header">
        <h1 className="beverages-title">Refreshing Beverages</h1>
        <p className="beverages-subtitle">Quench your thirst with our delicious drinks</p>
        
        {/* Filters */}
        <div className="beverages-filters">
          <div className="filter-group">
            <label>Temperature:</label>
            <select 
              value={temperatureFilter} 
              onChange={(e) => {
                setTemperatureFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="filter-select"
            >
              <option value="all">All Temperatures</option>
              <option value="hot">🔥 Hot Drinks</option>
              <option value="cold">❄️ Cold Drinks</option>
              <option value="normal">🌡️ Normal Drinks</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Type:</label>
            <select 
              value={typeFilter} 
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {beverageTypes.map(type => (
                <option key={type} value={type}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Page Info */}
        <div className="page-info">
          Page {currentPage} of {totalPages} • Showing {currentItems.length} of {filteredBeverages.length} items
        </div>
      </div>

      <div className="beverages-grid">
        {currentItems.map((beverage) => (
          <div key={beverage.id} className="beverage-card">
            <div className="card-image">
              <img 
                src={beverage.image} 
                alt={beverage.name}
                className="beverage-image"
                onError={() => handleImageError(beverage.id)}
                onLoad={() => handleImageLoad(beverage.id)}
                style={{ 
                  display: imageErrors[beverage.id] ? 'none' : 'block'
                }}
              />
              
              {/* Show fallback only if image fails to load */}
              {imageErrors[beverage.id] && (
                <div className="image-fallback">
                  <span className="fallback-emoji">{beverage.fallback}</span>
                  <span className="fallback-text">{beverage.name}</span>
                </div>
              )}

              {/* Temperature Badge Only */}
              <div className="beverage-badges">
                <span className={`temp-badge ${beverage.category}`}>
                  {beverage.category === 'hot' ? '🔥 Hot' : beverage.category === 'cold' ? '❄️ Cold' : '🌡️ Normal'}
                </span>
              </div>
            </div>
            
            <div className="card-content">
              <div className="beverage-header">
                <h3 className="beverage-name">{beverage.name}</h3>
                <div className="beverage-rating">
                  <span className="rating-star">⭐</span>
                  <span className="rating-value">{beverage.rating}</span>
                </div>
              </div>
              
              <p className="beverage-description">{beverage.description}</p>
              
              <div className="beverage-meta">
                <span className="beverage-type">Type: {beverage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
              </div>
              
              <div className="beverage-footer">
                <div className="price-section">
                  <span className="price">₹{beverage.price}</span>
                  <div className="total-price">
                    ₹{beverage.price * quantities[beverage.id]}
                  </div>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    className="btn btn-outline"
                    onClick={() => decreaseQuantity(beverage.id)}
                    disabled={quantities[beverage.id] <= 1}
                  >
                    -
                  </button>
                  <span className="quantity">{quantities[beverage.id]}</span>
                  <button 
                    className="btn btn-outline"
                    onClick={() => increaseQuantity(beverage.id)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="btn btn-primary add-to-cart-btn"
                  onClick={() => addToCartHandler(beverage)}
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

export default Beverages