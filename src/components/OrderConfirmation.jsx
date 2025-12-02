import React, { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './OrderConfirmation.css';

const MySwal = withReactContent(Swal);

function OrderConfirmation({ isOpen, onClose, orderDetails }) {
  const hasShownRef = useRef(false);
  const currentAlertRef = useRef(null);

  useEffect(() => {
    // Only show if open, has order details, and hasn't shown yet
    if (isOpen && orderDetails && !hasShownRef.current) {
      hasShownRef.current = true;
      showOrderConfirmation();
    }

    // Reset the flag when component closes
    return () => {
      if (!isOpen) {
        hasShownRef.current = false;
        // Close any existing alert
        if (currentAlertRef.current) {
          MySwal.close();
          currentAlertRef.current = null;
        }
      }
    };
  }, [isOpen, orderDetails]);

  const createConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#2d8a2d', '#4caf50', '#81c784', '#ff6b35', '#ffd700'];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      for (let i = 0; i < 3; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.top = '-10px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10001';
        confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear ${Math.random() * 0.5}s forwards`;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }
    }, 50);
  };

  const showOrderConfirmation = () => {
    const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
    const estimatedTime = new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const itemsHTML = orderDetails.items.map(item => `
      <div class="summary-item">
        <span class="item-emoji">${item.category === 'veg' ? '🌱' : item.category === 'nonveg' ? '🍗' : '🥛'}</span>
        <span class="item-details">${item.name} <span class="item-qty">× ${item.quantity}</span></span>
        <span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    const discountHTML = orderDetails.discount > 0 ? `
      <div class="order-detail-row savings">
        <span class="detail-label">You Saved</span>
        <span class="detail-value">₹${orderDetails.discount.toFixed(2)}</span>
      </div>
    ` : '';

    const alertPromise = MySwal.fire({
      title: '<div class="confirmation-title">Order Placed Successfully!</div>',
      html: `
        <div class="confirmation-content">
          <div class="success-animation">
            <div class="success-checkmark">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>
          </div>

          <p class="confirmation-subtitle">Your delicious meal is on its way 🎉</p>

          <div class="order-details-card">
            <div class="order-detail-row">
              <span class="detail-label">Order Number</span>
              <span class="detail-value order-number">${orderNumber}</span>
            </div>
            <div class="order-detail-row">
              <span class="detail-label">Estimated Delivery</span>
              <span class="detail-value">${estimatedTime}</span>
            </div>
            <div class="order-detail-row">
              <span class="detail-label">Total Amount</span>
              <span class="detail-value amount">₹${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
            ${discountHTML}
          </div>

          <div class="items-summary">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-items">${itemsHTML}</div>
          </div>

          <div class="order-info">
            <p class="info-text">✉️ Order confirmation sent to your email</p>
            <p class="info-text">📱 SMS updates about delivery</p>
          </div>
        </div>
      `,
      showConfirmButton: true,
      showDenyButton: true,
      showCloseButton: true,
      confirmButtonText: 'Track Order',
      denyButtonText: 'Continue Shopping',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'order-confirmation-popup',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-html-container-custom',
        confirmButton: 'track-order-btn',
        denyButton: 'continue-shopping-btn',
        closeButton: 'sweet-alert-close-btn'
      },
      buttonsStyling: false,
      width: '600px',
      padding: '3rem 2.5rem',
      didOpen: createConfetti
    });

    currentAlertRef.current = alertPromise;

    alertPromise.then((result) => {
      currentAlertRef.current = null;
      onClose();
      if (result.isConfirmed) {
        console.log('Track order clicked');
      } else if (result.isDenied) {
        console.log('Continue shopping clicked');
      }
    });
  };

  return null;
}

export default React.memo(OrderConfirmation);