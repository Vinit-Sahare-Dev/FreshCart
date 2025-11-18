import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from './cartSlice'
import QRScanner from './QRScanner'
import './Cart.css'

function Cart() {
  const dispatch = useDispatch()
  const { items: cartItems, totalAmount, totalItems } = useSelector(state => state.cart)
  
  // QR Scanner state
  const [showQRScanner, setShowQRScanner] = useState(false)

  const removeFromCartHandler = (itemId) => {
    dispatch(removeFromCart(itemId))
  }

  const updateQuantityHandler = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity({ itemId, quantity: newQuantity }))
  }

  const clearCartHandler = () => {
    dispatch(clearCart())
  }

  const handlePaymentSuccess = () => {
    setShowQRScanner(false)
    // Clear cart after successful payment
    dispatch(clearCart())
    // You can add a success notification here
    console.log('Payment successful! Order placed.')
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty! Add some items first.')
      return
    }
    setShowQRScanner(true)
  }

  return (
    <div className="cart-container">
      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          totalAmount={totalAmount}
          onClose={() => setShowQRScanner(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <div className="cart-header">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <p className="cart-subtitle">Review your delicious selections before checkout</p>
        
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <span className="items-count">{totalItems} items</span>
            <span className="total-amount">Total: ₹{totalAmount}</span>
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
                        onClick={() => updateQuantityHandler(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantityHandler(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ₹{item.price * item.quantity}
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCartHandler(item.id)}
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
                onClick={clearCartHandler}
              >
                Clear Cart
              </button>
              
              <div className="checkout-section">
                <div className="final-total">
                  <span className="total-label">Grand Total:</span>
                  <span className="total-value">₹{totalAmount}</span>
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