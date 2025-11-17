

function Cart() {
  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <p className="cart-subtitle">Review your items before checkout</p>
      </div>
      
      <div className="cart-content">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-text">Add some delicious items from our menu!</p>
        </div>
      </div>
    </div>
  )
}

export default Cart