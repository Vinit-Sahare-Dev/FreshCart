import { useState } from 'react'
import './Veg.css'

function Veg() {
  const vegDishes = [
    {
      id: 1,
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese in rich tomato gravy with butter',
      price: 280,
      image: '/public/veg/paneer-butter-masala.jpg',
      fallback: '🧀',
      rating: 4.5,
      cookTime: '25 min'
    },
    {
      id: 2,
      name: 'Vegetable Biryani',
      description: 'Fragrant basmati rice with mixed vegetables and spices',
      price: 220,
      image: '/public/veg/vegbiryani.jpg',
      fallback: '🍚',
      rating: 4.3,
      cookTime: '30 min'
    },
    {
      id: 3,
      name: 'Palak Paneer',
      description: 'Cottage cheese in creamy spinach gravy',
      price: 260,
      image: '/public/veg/palak-paneer.jpg',
      fallback: '🥬',
      rating: 4.4,
      cookTime: '20 min'
    },
 
    {
    id: 4,
      name: 'Masala Dosa',
      description: 'Crispy rice crepe with spiced potato filling',
      price: 120,
      image: '/public/veg/masala-dosa.jpg',
      fallback: '🥞',
      rating: 4.7,
      cookTime: '10 min'
    },
    {
      id: 5,
      name: 'Chole Bhature',
      description: 'Spicy chickpeas with fluffy fried bread',
      price: 180,
      image: '/public/veg/chole-bhature.jpg',
      fallback: '🥘',
      rating: 4.6,
      cookTime: '15 min'
    },
    {
      id: 6,
      name: 'Vegetable Korma',
      description: 'Mixed vegetables in rich cashew gravy',
      price: 240,
      image: '/public/veg/vegkorma.jpg',
      fallback: '🥗',
      rating: 4.2,
      cookTime: '25 min'
    },
    {
      id: 7,
      name: 'Aloo Gobi',
      description: 'Potato and cauliflower cooked with Indian spices',
      price: 160,
      image: '/public/veg/aloo-gobi.jpg',
      fallback: '🥔',
      rating: 4.1,
      cookTime: '20 min'
    },
    {
      id: 8,
      name: 'Baingan Bharta',
      description: 'Smoky roasted eggplant mashed with spices',
      price: 190,
      image: '/public/veg/baingan-bharta.jpg',
      fallback: '🍆',
      rating: 4.3,
      cookTime: '25 min'
    },
    {
      id: 9,
      name: 'Malai Kofta',
      description: 'Creamy vegetable dumplings in rich gravy',
      price: 290,
      image: '/public/veg/malai-kofta.jpg',
      fallback: '🍡',
      rating: 4.6,
      cookTime: '30 min'
    },
    {
      id: 10,
      name: 'Dal Makhani',
      description: 'Creamy black lentils simmered overnight',
      price: 200,
      image: '/public/veg/dal-makhani.jpg',
      fallback: '🫘',
      rating: 4.5,
      cookTime: '15 min'
    },
    {
      id: 11,
      name: 'Mutter Paneer',
      description: 'Cottage cheese with green peas in tomato gravy',
      price: 250,
      image: '/public/veg/mutter-paneer.jpg',
      fallback: '🧀',
      rating: 4.4,
      cookTime: '20 min'
    },
    {
      id: 12,
      name: 'Vegetable Jalfrezi',
      description: 'Stir-fried vegetables in spicy tomato sauce',
      price: 210,
      image: '/public/veg/veg-jalfrezi.jpg',
      fallback: '🥘',
      rating: 4.2,
      cookTime: '18 min'
    },
    {
      id: 13,
      name: 'Rajma Masala',
      description: 'Kidney beans in rich onion-tomato gravy',
      price: 170,
      image: '/public/veg/rajma-masala.jpg',
      fallback: '🫘',
      rating: 4.3,
      cookTime: '20 min'
    },
    {
      id: 14,
      name: 'Gobi Manchurian',
      description: 'Crispy cauliflower in tangy Chinese sauce',
      price: 190,
      image: '/public/veg/gobi-manchurian.jpg',
      fallback: '🥦',
      rating: 4.5,
      cookTime: '15 min'
    },
    {
      id: 15,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese cubes with spices',
      price: 270,
      image: '/public/veg/paneer-tikka.jpg',
      fallback: '🔥',
      rating: 4.7,
      cookTime: '12 min'
    },
    {
      id: 16,
      name: 'Vegetable Pulao',
      description: 'Fragrant rice with assorted vegetables',
      price: 150,
      image: '/public/veg/veg-pulao.jpg',
      fallback: '🍚',
      rating: 4.2,
      cookTime: '15 min'
    },
    {
      id: 17,
      name: 'Aloo Matar',
      description: 'Potatoes and peas in spicy gravy',
      price: 140,
      image: '/public/veg/aloo-matar.jpg',
      fallback: '🥔',
      rating: 4.0,
      cookTime: '18 min'
    },
    {
      id: 18,
      name: 'Bhindi Masala',
      description: 'Okra cooked with onions and spices',
      price: 160,
      image: '/public/veg/bhindi-masala.jpg',
      fallback: '🥬',
      rating: 4.3,
      cookTime: '15 min'
    },
    {
      id: 19,
      name: 'Mushroom Matar',
      description: 'Mushrooms and peas in creamy gravy',
      price: 230,
      image: '/public/veg/mushroom-matar.jpg',
      fallback: '🍄',
      rating: 4.4,
      cookTime: '20 min'
    },
    {
      id: 20,
      name: 'Vegetable Handi',
      description: 'Mixed vegetables cooked in clay pot',
      price: 260,
      image: '/public/veg/veg-handi.jpg',
      fallback: '🍲',
      rating: 4.5,
      cookTime: '25 min'
    }
  ]

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Calculate total pages
  const totalPages = Math.ceil(vegDishes.length / itemsPerPage)

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = vegDishes.slice(indexOfFirstItem, indexOfLastItem)

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const [quantities, setQuantities] = useState(
    vegDishes.reduce((acc, dish) => {
      acc[dish.id] = 1
      return acc
    }, {})
  )

  const [imageErrors, setImageErrors] = useState({})

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

  const addToCart = (dish) => {
    const quantity = quantities[dish.id]
    const item = {
      ...dish,
      quantity: quantity,
      totalPrice: dish.price * quantity
    }
    console.log('Added to cart:', item)
    alert(`Added ${quantity} ${dish.name} to cart!`)
  }

  const handleImageError = (dishId, imageSrc) => {
    setImageErrors(prev => ({
      ...prev,
      [dishId]: true
    }))
  }

  const handleImageLoad = (dishId) => {
    setImageErrors(prev => ({
      ...prev,
      [dishId]: false
    }))
  }

  // Generate page numbers for pagination
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="veg-container">
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
              {!imageErrors[dish.id] ? (
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="dish-image"
                  onError={() => handleImageError(dish.id, dish.image)}
                  onLoad={() => handleImageLoad(dish.id)}
                />
              ) : (
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
                  onClick={() => addToCart(dish)}
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
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => goToPage(number)}
              >
                {number}
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