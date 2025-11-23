import React, { useState, useRef, useEffect } from 'react';
import './AICompanion.css';

function AICompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Peko 🎉 Your friendly FreshCart assistant. I can help you with menu items, orders, and recommendations!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('peko_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('peko_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Track unread messages
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai') {
        setUnreadCount(prev => prev + 1);
      }
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Backend not running. Please start the Spring Boot server.');
          return "I'm having trouble connecting right now. Please try again in a moment! 😊";
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setError(null);
      return data.response || "Let me help with something else. What food are you looking for?";
    } catch (error) {
      console.error('AI error:', error);
      if (error.name === 'AbortError') {
        setError('Request timed out. Server might be slow.');
        return "The request took too long. Let's try again! ⏱️";
      }
      setError('Unable to reach AI service. Check if backend is running.');
      return "Oops! I couldn't process that. Try again in a moment! 🔄";
    }
  };

  const handleSendMessage = async (e, quickMessage = null) => {
    if (e) e.preventDefault();
    
    const messageToSend = quickMessage || inputValue;
    if (!messageToSend.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError(null);
    
    setTimeout(async () => {
      const responseText = await getAIResponse(messageToSend);
      const aiResponse = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(null, action);
  };

  const clearChat = () => {
    if (window.confirm('Clear all chat history?')) {
      setMessages([{
        id: 1,
        text: "Chat cleared! How can I help you today? 😊",
        sender: 'ai',
        timestamp: new Date()
      }]);
      localStorage.removeItem('peko_chat_history');
    }
  };

  const quickActions = [
    "🌱 Show veg dishes",
    "🍗 Show non-veg",
    "🥛 Show desserts",
    "💰 Today's offers"
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        className={`peko-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Peko"
        aria-label="Open Peko chat"
      >
        <span className="bubble-emoji">🤖</span>
        {unreadCount > 0 && !isOpen && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="peko-window">
          <div className="peko-header">
            <div className="header-content">
              <span className="header-emoji">🤖</span>
              <div className="header-text">
                <h3 className="peko-title">Peko AI Assistant</h3>
                <p className="peko-subtitle">Your Food Helper</p>
                <div className="peko-status">
                  <span className="status-dot"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <button
              className="peko-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Peko"
            >
              ×
            </button>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
              >
                {action}
              </button>
            ))}
          </div>

          <div className="messages-container">
            {error && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <p className="error-text">{error}</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  <span className="avatar-text">
                    {message.sender === 'ai' ? '🤖' : '👤'}
                  </span>
                </div>
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai typing">
                <div className="message-avatar">
                  <span className="avatar-text">🤖</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Peko anything... 💬"
              className="message-input"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <span>🚀</span>
            </button>
          </form>

          <div className="peko-tips">
            <p className="tips-text">
              💡 Ask about dishes, prices, delivery, or get personalized recommendations!
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AICompanion;