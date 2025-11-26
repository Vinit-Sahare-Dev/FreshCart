// src/components/CartNotification.jsx
import React from 'react';
import './CartNotification.css';

function CartNotification({ show, message, item, category, onClose }) {
  if (!show) return null;

  const getCategoryConfig = (cat) => {
    switch(cat) {
      case 'veg':
        return {
          gradient: 'linear-gradient(135deg, #10b981, #059669)',
          tag: '🟢 Vegetarian',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0'
        };
      case 'nonveg':
        return {
          gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          tag: '🔴 Non-Vegetarian',
          bgColor: '#fef2f2',
          borderColor: '#fecaca'
        };
      case 'dairy':
        return {
          gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
          tag: '🥛 Dairy & Dessert',
          bgColor: '#fef7ed',
          borderColor: '#fed7aa'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
          tag: '🍽️ Item',
          bgColor: '#f9fafb',
          borderColor: '#e5e7eb'
        };
    }
  };

  const config = getCategoryConfig(category);

  return (
    <div className={`cart-notification ${show ? 'show' : ''}`}>
      <div className="notification-content">
        <div className="notification-icon" style={{ background: config.gradient }}>
          ✓
        </div>
        <div className="notification-text">
          <div className="notification-title">Added to Cart!</div>
          <div className="notification-message">{message}</div>
          {item && (
            <div className="notification-item">
              <span 
                className="category-tag" 
                style={{ 
                  background: config.bgColor, 
                  borderColor: config.borderColor,
                  color: category === 'nonveg' ? '#dc2626' : category === 'dairy' ? '#c2410c' : '#065f46'
                }}
              >
                {config.tag}
              </span>
            </div>
          )}
        </div>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
      <div 
        className="notification-progress" 
        style={{ background: config.gradient }}
      />
    </div>
  );
}

export default CartNotification;