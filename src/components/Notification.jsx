// src/components/Notification.jsx
import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ message, type = 'success', isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <span className="notification-icon">{icons[type]}</span>
        <p className="notification-message">{message}</p>
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="notification-progress"></div>
    </div>
  );
}

export default Notification;