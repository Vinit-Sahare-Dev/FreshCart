import { useState } from 'react'
import './Veg.css' // Using same CSS as Veg component

function NonVeg() {
  const nonVegDishes = [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Tender chicken in rich buttery tomato gravy',
      price: 320,
      image: '/public/nonveg/butter-chicken.jpg',
      fallback: '🍗',
      rating: 4.8,
      cookTime: '30 min'
    },
    {
      id: 2,
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with succulent chicken pieces',
      price: 280,
      image: '/public/nonveg/chicken-biryani.jpg',
      fallback: '🍚',
      rating: 4.7,
      cookTime: '35 min'
    },
    // Add more non-veg dishes here
  ]

  const [quantities, setQuantities] = useState(
    nonVegDishes.reduce((acc, dish) => {
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
        <h1 className="veg-title">Non-Veg Specials</h1>
        <p className="veg-subtitle">Premium quality meat dishes</p>
      </div>

      <div className="dishes-grid">
        {nonVegDishes.map((dish) => (
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

export default NonVeg