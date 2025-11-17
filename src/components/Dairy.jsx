import { useState } from 'react'
import './Veg.css' // Using same CSS as Veg component

function Dairy() {
  const dairyDishes = [
    {
      id: 1,
      name: 'Gulab Jamun',
      description: 'Soft milk dumplings in sweet rose-flavored syrup',
      price: 120,
      image: '/public/dairy/gulab-jamun.jpg',
      fallback: '🍮',
      rating: 4.6,
      cookTime: '10 min'
    },
    {
      id: 2,
      name: 'Rasmalai',
      description: 'Soft cottage cheese patties in sweetened creamy milk',
      price: 150,
      image: '/public/dairy/rasmalai.jpg',
      fallback: '🥛',
      rating: 4.5,
      cookTime: '5 min'
    },
    // Add more dairy dishes here
  ]

  const [quantities, setQuantities] = useState(
    dairyDishes.reduce((acc, dish) => {
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

  return (
    <div className="veg-container">
      <div className="veg-header">
        <h1 className="veg-title">Dairy & Desserts</h1>
        <p className="veg-subtitle">Sweet treats and fresh dairy products</p>
      </div>

      <div className="dishes-grid">
        {dairyDishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <div className="card-image">
              {!imageErrors[dish.id] ? (
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="dish-image"
                  onError={() => handleImageError(dish.id, dish.image)}
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
    </div>
  )
}

export default Dairy