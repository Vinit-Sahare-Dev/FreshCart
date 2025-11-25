import React, { useState, useRef, useEffect } from 'react';
import './AICompanion.css';

function AICompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Peko, your FreshCart food assistant. Ask me about veg, non-veg, desserts, pricing, or how to order!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fallback AI responses when backend is unavailable
  const getFallbackResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Food categories
    if (msg.includes('veg') && !msg.includes('non')) {
      return "We have amazing vegetarian dishes! Try our Paneer Butter Masala (₹280), Vegetable Biryani (₹220), or Palak Paneer (₹260). All fresh and delicious! 🌱";
    }
    if (msg.includes('non-veg') || msg.includes('nonveg') || msg.includes('chicken') || msg.includes('meat')) {
      return "Our non-veg menu is fantastic! Popular items: Butter Chicken (₹320), Chicken Biryani (₹280), and Mutton Rogan Josh (₹450). 🍗";
    }
    if (msg.includes('dairy') || msg.includes('dessert') || msg.includes('sweet')) {
      return "Sweet cravings? Try our Gulab Jamun (₹120), Rasmalai (₹150), or Kheer (₹100). Perfect for dessert! 🍮";
    }
    
    // Pricing
    if (msg.includes('price') || msg.includes('cost') || msg.includes('expensive') || msg.includes('cheap')) {
      return "Our prices range from ₹100-₹450. Budget-friendly options start at ₹100 for desserts, ₹120 for veg dishes, and ₹260+ for non-veg. We offer great value! 💰";
    }
    
    // Ordering
    if (msg.includes('order') || msg.includes('buy') || msg.includes('purchase')) {
      return "Ordering is easy! Browse our menu, add items to cart, and checkout. We accept all major payment methods. Free delivery over ₹500! 🛒";
    }
    if (msg.includes('delivery') || msg.includes('time') || msg.includes('fast')) {
      return "We deliver in 30-45 minutes! Hot and fresh to your doorstep. Free delivery on orders over ₹500. 🚀";
    }
    if (msg.includes('payment') || msg.includes('pay')) {
      return "We accept UPI, cards, net banking, and cash on delivery. All transactions are 100% secure! 💳";
    }
    
    // Recommendations
    if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best') || msg.includes('popular')) {
      return "Top picks: Butter Chicken (₹320), Paneer Butter Masala (₹280), and Chicken Biryani (₹280). Customer favorites! ⭐";
    }
    if (msg.includes('spicy') || msg.includes('mild')) {
      return "We can customize spice levels! Just mention in order notes: mild, medium, or spicy. We'll make it perfect for you! 🌶️";
    }
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! Welcome to FreshCart! How can I help you today? Ask me about our menu, prices, or delivery! 😊";
    }
    if (msg.includes('thanks') || msg.includes('thank')) {
      return "You're welcome! Enjoy your meal! Let me know if you need anything else. 🙏";
    }
    
    // Help
    if (msg.includes('help')) {
      return "I can help with: Menu items (veg/non-veg/dairy), Prices, Ordering process, Delivery info, Payment methods. What would you like to know? 🤔";
    }
    
    // Default
    return "I can help you with our vegetarian, non-veg, and dessert menu, pricing, ordering, and delivery. What would you like to know? 🍽️";
  };

  // Call Spring AI backend
  const getAIResponse = async (userMessage) => {
    // If backend was previously unavailable, try fallback first
    if (!backendAvailable) {
      return getFallbackResponse(userMessage);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404 || response.status === 503) {
          setBackendAvailable(false);
          setError('Using offline mode - backend unavailable');
          return getFallbackResponse(userMessage);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setError(null);
      setBackendAvailable(true);
      return data.response || getFallbackResponse(userMessage);
    } catch (error) {
      console.warn('AI backend error, using fallback:', error.message);
      
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        setError('Timeout - using offline mode');
      } else {
        setError('Backend offline - using local responses');
      }
      
      setBackendAvailable(false);
      return getFallbackResponse(userMessage);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    const messageToSend = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Get AI response
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

  const quickQuestions = [
    "Show me veg dishes",
    "Non-veg menu",
    "Desserts available",
    "How to order?",
    "Delivery time?",
    "Best dishes"
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    // Auto-submit after a brief delay
    setTimeout(() => {
      const event = { preventDefault: () => {} };
      handleSendMessage(event);
    }, 100);
  };

  return (
    <>
      {/* Peko Chat Bubble Button */}
      <button
        className={`peko-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Peko"
        aria-label="Open Peko chat"
      >
        <span className="bubble-emoji">🤖</span>
        <span className="bubble-label">Peko AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="peko-window">
          <div className="peko-header">
            <div className="header-content">
              <h3 className="peko-title">Peko AI Assistant</h3>
              <p className="peko-subtitle">
                {backendAvailable ? '🟢 Online' : '🟡 Offline Mode'}
              </p>
            </div>
            <button
              className="peko-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Peko"
            >
              ✕
            </button>
          </div>

          <div className="messages-container">
            {error && (
              <div className="error-banner">
                <span className="error-icon">ℹ️</span>
                <p className="error-text">{error}</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  <span className="avatar-text">{message.sender === 'ai' ? '🤖' : '👤'}</span>
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

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="quick-questions">
              <p className="quick-title">Quick questions:</p>
              <div className="quick-buttons">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="quick-btn"
                    onClick={() => handleQuickQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="message-input"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <span>➤</span>
            </button>
          </form>

          <div className="peko-tips">
            <p className="tips-text">
              💡 Ask about menu, prices, ordering, or delivery!
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .quick-questions {
          padding: 1rem;
          background: linear-gradient(to bottom, #fafbfc, #f0f2ff);
          border-top: 1px solid #e5e7eb;
        }
        .quick-title {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .quick-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .quick-btn {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
          font-weight: 500;
        }
        .quick-btn:hover {
          background: #059669;
          color: white;
          border-color: #059669;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}

export default AICompanion;