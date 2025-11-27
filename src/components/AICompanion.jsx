import React, { useState, useRef, useEffect } from 'react';
import './AICompanion.css';

function AICompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Peko, your FreshCart AI assistant powered by ChatGPT. Ask me anything about our menu, get recommendations, or help with ordering!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          sessionId: sessionId
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Backend not running. Please start the Spring Boot server.');
          return "I'm currently offline. Please make sure the backend server is running on http://localhost:8080";
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setError(null);
      
      if (data.error) {
        return "I encountered an issue. Please try rephrasing your question.";
      }
      
      return data.response || "I'm here to help! Ask me about our delicious menu items.";
    } catch (error) {
      console.error('AI error:', error);
      if (error.name === 'AbortError') {
        setError('Request timed out. Server might be processing...');
        return "The request took too long. Please try a simpler question.";
      }
      setError('Unable to reach AI service. Check if backend is running.');
      return "I'm temporarily unavailable. Please try again in a moment!";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
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
    
    // Simulate thinking delay for better UX
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
    }, 800);
  };

  const clearConversation = async () => {
    try {
      await fetch(`http://localhost:8080/api/ai/session/${sessionId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error clearing session:', err);
    }
    
    setMessages([
      {
        id: 1,
        text: "Conversation cleared! How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const quickActions = [
    { icon: '🌱', text: 'Show veg dishes', query: 'What vegetarian dishes do you have?' },
    { icon: '🍗', text: 'Non-veg options', query: 'Tell me about your non-veg dishes' },
    { icon: '🍿', text: 'Snack menu', query: 'What snacks are available?' },
    { icon: '💰', text: 'Budget meals', query: 'Show me dishes under ₹150' },
  ];

  const handleQuickAction = (query) => {
    setInputValue(query);
  };

  return (
    <>
      <button
        className={`peko-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Peko AI"
        aria-label="Open Peko AI chat"
      >
        <span className="bubble-emoji">🤖</span>
        <span className="bubble-label">AI Chat</span>
      </button>

      {isOpen && (
        <div className="peko-window">
          <div className="peko-header">
            <div className="header-content">
              <h3 className="peko-title">Peko AI Assistant</h3>
              <p className="peko-subtitle">Powered by ChatGPT</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="peko-clear-btn"
                onClick={clearConversation}
                aria-label="Clear conversation"
                title="Clear conversation"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                
              </button>
              <button
                className="peko-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Peko"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="messages-container">
            {error && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <p className="error-text">{error}</p>
              </div>
            )}

            {messages.length === 1 && (
              <div className="quick-actions" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem',
                padding: '0.5rem'
              }}>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: '#6b7280', 
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  Quick actions:
                </p>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                      border: '1px solid rgba(5, 150, 105, 0.2)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#047857'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
                    <span>{action.text}</span>
                  </button>
                ))}
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
            <p className="tips-text">
              💡 Powered by ChatGPT | Ask about menu, prices, recommendations & more!
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AICompanion;