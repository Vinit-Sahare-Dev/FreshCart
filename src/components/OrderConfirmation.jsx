import React, { useEffect } from 'react';
import './OrderConfirmation.css';

function OrderConfirmation({ isOpen, onClose, orderDetails }) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      createConfetti();
    }
  }, [isOpen]);

  const createConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#2d8a2d', '#4caf50', '#81c784', '#ff6b35', '#ffd700'];

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 3;

      for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = randomInRange(0, 100) + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = randomInRange(2, 4) + 's';
        confetti.style.animationDelay = randomInRange(0, 0.5) + 's';
        
        document.querySelector('.order-confirmation-overlay')?.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
      }
    }, 50);
  };

  if (!isOpen) return null;

  const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
  const estimatedTime = new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="order-confirmation-overlay">
      <div className="order-confirmation-container">
        <button className="confirmation-close-btn" onClick={onClose}>×</button>
        
        <div className="confirmation-content">
          {/* Success Icon */}
          <div className="success-animation">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="confirmation-title">Order Placed Successfully!</h1>
          <p className="confirmation-subtitle">
            Your delicious meal is on its way 🎉
          </p>

          {/* Order Details */}
          <div className="order-details-card">
            <div className="order-detail-row">
              <span className="detail-label">Order Number</span>
              <span className="detail-value order-number">{orderNumber}</span>
            </div>
            <div className="order-detail-row">
              <span className="detail-label">Estimated Delivery</span>
              <span className="detail-value">{estimatedTime}</span>
            </div>
            <div className="order-detail-row">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value amount">₹{orderDetails.totalAmount.toFixed(2)}</span>
            </div>
            {orderDetails.discount > 0 && (
              <div className="order-detail-row savings">
                <span className="detail-label">You Saved</span>
                <span className="detail-value">₹{orderDetails.discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Order Items Summary */}
          <div className="items-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-items">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="summary-item">
                  <span className="item-emoji">
                    {item.category === 'veg' ? '🌱' : 
                     item.category === 'nonveg' ? '🍗' : '🥛'}
                  </span>
                  <span className="item-details">
                    {item.name} <span className="item-qty">× {item.quantity}</span>
                  </span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="confirmation-actions">
            <button className="track-order-btn">
              📍 Track Order
            </button>
            <button className="continue-shopping-btn" onClick={onClose}>
              🛍️ Continue Shopping
            </button>
          </div>

          {/* Additional Info */}
          <div className="order-info">
            <p className="info-text">
              ✉️ Order confirmation has been sent to your email
            </p>
            <p className="info-text">
              📱 You'll receive SMS updates about your delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;