import { useState } from 'react'
import './Cart.css'

function Cart() {
  const [cartItems, setCartItems] = useState([
    // Sample cart items - you can replace with actual cart data
    // {
    //   id: 1,
    //   name: 'Paneer Butter Masala',
    //   price: 280,
    //   quantity: 2,
    //   image: 'public/veg/paneer-butter-masala.jpg',
    //   category: 'veg'
    // }
  ])

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty! Add some items first.')
      return
    }
    alert(`Proceeding to checkout with ${calculateItemsCount()} items. Total: ₹${calculateTotal()}`)
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <p className="cart-subtitle">Review your delicious selections before checkout</p>
        
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <span className="items-count">{calculateItemsCount()} items</span>
            <span className="total-amount">Total: ₹{calculateTotal()}</span>
          </div>
        )}
      </div>

      <div className="cart-content">
        {cartItems.length > 0 ? (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="item-img"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="item-fallback">
                      {item.category === 'veg' ? '🌱' : 
                       item.category === 'nonveg' ? '🍗' : '🥛'}
                    </div>
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">₹{item.price}</p>
                    <div className="item-category">
                      {item.category === 'veg' ? 'Vegetarian' : 
                       item.category === 'nonveg' ? 'Non-Vegetarian' : 'Dairy'}
                    </div>
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ₹{item.price * item.quantity}
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-actions">
              <button 
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              
              <div className="checkout-section">
                <div className="final-total">
                  <span className="total-label">Grand Total:</span>
                  <span className="total-value">₹{calculateTotal()}</span>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={proceedToCheckout}
                >
                  🛍️ Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your cart feels lonely</h2>
            <p className="empty-cart-text">
              Explore our delicious menu and add some items to get started!
            </p>
            <div className="empty-cart-suggestions">
              <div className="suggestion">
                <span className="suggestion-emoji">🌱</span>
                <span>Try our Vegetarian specials</span>
              </div>
              <div className="suggestion">
                <span className="suggestion-emoji">🍗</span>
                <span>Check out Non-Veg delights</span>
              </div>
              <div className="suggestion">
                <span className="suggestion-emoji">🥛</span>
                <span>Sweet Dairy desserts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart