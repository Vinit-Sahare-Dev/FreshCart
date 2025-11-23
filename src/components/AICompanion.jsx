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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call Spring AI backend
  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Backend not running. Please start the Spring Boot server.');
          return "Backend service not available. Please refresh and try again.";
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
        return "Request timed out. Please try again.";
      }
      setError('Unable to reach AI service. Check if backend is running.');
      return "Sorry, I couldn't process that. Try again in a moment!";
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
    setError(null);
    
    // Get AI response from Spring backend
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

  return (
    <>
      {/* Peko Chat Bubble Button */}
      <button
        className={`peko-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Peko"
        aria-label="Open Peko chat"
      >
        <span className="bubble-emoji">PEKO</span>
        <span className="bubble-label">Chat</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="peko-window">
          <div className="peko-header">
            <div className="header-content">
              <h3 className="peko-title">Peko</h3>
              <p className="peko-subtitle">Food Assistant</p>
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
                <span className="error-icon">⚠️</span>
                <p className="error-text">{error}</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  <span className="avatar-text">{message.sender === 'ai' ? 'P' : '👤'}</span>
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
                  <span className="avatar-text">P</span>
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
              placeholder="Ask Peko anything..."
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
            <p className="tips-text">Try asking about veg, non-veg, desserts, or how to order!</p>
          </div>
        </div>
      )}
    </>
  );
}

export default AICompanion;
