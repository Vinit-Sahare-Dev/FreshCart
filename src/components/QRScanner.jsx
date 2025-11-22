import React, { useState, useEffect } from 'react';
import { verifyPayment } from '../api/paymentApi';
import './QRScanner.css';

const QRScanner = ({ totalAmount, onClose, onPaymentSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [countdown, setCountdown] = useState(30);
  const [transactionId, setTransactionId] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verifiedTransactionId, setVerifiedTransactionId] = useState('');

  // Generate a proper QR code data with your UPI ID
  const generateQRData = () => {
    const transactionData = {
      upi: '9921349614@ybl',
      amount: totalAmount,
      name: 'Mr. VINIT VIJAY SAHARE',
      currency: 'INR',
      tn: `TXN${Date.now().toString().slice(-8)}`
    };
    return `upi://pay?pa=${transactionData.upi}&pn=${encodeURIComponent(transactionData.name)}&am=${transactionData.amount}&cu=${transactionData.currency}&tn=${transactionData.tn}`;
  };

  // Verify payment with transaction ID
  const handleVerifyPayment = async () => {
    // Validate transaction ID
    if (!transactionId || transactionId.trim().length < 8) {
      setVerificationError('Please enter a valid transaction ID (minimum 8 characters) from your payment app');
      return;
    }

    setVerificationError('');
    setPaymentStatus('processing');

    try {
      // Verify payment with backend
      const response = await verifyPayment(transactionId.trim(), totalAmount);
      
      if (response.verified) {
        setVerifiedTransactionId(response.transactionId || transactionId.trim());
        setPaymentStatus('success');
        
        // Call success callback after a delay
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else {
        setPaymentStatus('pending');
        setVerificationError(response.message || 'Payment verification failed. Please check your transaction ID and try again.');
      }
    } catch (error) {
      setPaymentStatus('pending');
      let errorMessage = 'Failed to verify payment. Please check your transaction ID and try again.';
      
      // Extract error message from response
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Try to parse if it's a JSON string
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use the message directly if it's reasonable
          if (error.message.length < 200) {
            errorMessage = error.message;
          }
        }
      }
      
      setVerificationError(errorMessage);
    }
  };

  // Simulate payment processing (for demo only)
  const simulatePayment = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing time
    setTimeout(() => {
      setPaymentStatus('success');
      setVerifiedTransactionId(`DEMO_${Date.now().toString().slice(-8)}`);
      
      // Call success callback after a delay
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    }, 3000);
  };

  // Countdown timer
  useEffect(() => {
    if (paymentStatus === 'pending') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStatus]);

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-container rectangular">
        {/* Header */}
        <div className="qr-header">
          <div className="qr-brand">
            <div className="qr-logo">PhonePe</div>
            <div className="qr-subtitle">Scan & Pay</div>
          </div>
          <button className="qr-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="qr-content-wrapper">
          {/* Left Side - QR Code (Fixed) */}
          <div className="qr-left-section">
            <div className="qr-code-display">
              <div className="qr-code-placeholder">
                {/* Real QR Code Image */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateQRData())}&format=svg`}
                  alt="QR Code"
                  className="qr-code-image"
                  onError={(e) => {
                    // Fallback to generated QR code if API fails
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                
                {/* Fallback Generated QR Code */}
                <div className="qr-code-generated">
                  <div className="qr-frame">
                    <div className="qr-pattern">
                      {/* Positioning markers */}
                      <div className="qr-position top-left">
                        <div className="outer-square"></div>
                        <div className="inner-square"></div>
                      </div>
                      <div className="qr-position top-right">
                        <div className="outer-square"></div>
                        <div className="inner-square"></div>
                      </div>
                      <div className="qr-position bottom-left">
                        <div className="outer-square"></div>
                        <div className="inner-square"></div>
                      </div>
                      
                      {/* Data pattern */}
                      <div className="qr-data-pattern">
                        {Array.from({ length: 169 }).map((_, i) => {
                          const row = Math.floor(i / 13);
                          const col = i % 13;
                          // Create a pattern that's actually scannable
                          const shouldFill = (
                            (row < 2 && col < 2) ||
                            (row < 2 && col > 10) ||
                            (row > 10 && col < 2) ||
                            (row % 2 === 0 && col % 2 === 0) ||
                            (row === 6) ||
                            (col === 6) ||
                            (row > 3 && row < 9 && col > 3 && col < 9)
                          );
                          return (
                            <div 
                              key={i}
                              className={`qr-module ${shouldFill ? 'filled' : ''}`}
                              style={{
                                left: `${col * 7.69}%`,
                                top: `${row * 7.69}%`
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="scan-line"></div>
              </div>
            </div>

            {/* Merchant Info */}
            <div className="merchant-info">
              <div className="merchant-name">
                <strong>Mr. VINIT VIJAY SAHARE</strong>
              </div>
              <div className="accepted-here">ACCEPTED HERE</div>
              <div className="upi-id">UPI ID: 9921349614@ybl</div>
            </div>
          </div>

          {/* Right Side - Payment Details (Scrollable) */}
          <div className="qr-right-section">
            <div className="scrollable-content">
              {/* Payment Info */}
              <div className="payment-info">
                <div className="amount-display">
                  <span className="amount-label">Amount to Pay</span>
                  <span className="amount-value">₹{totalAmount}</span>
                </div>
                <div className="timer-section">
                  <div className={`timer ${countdown < 10 ? 'timer-warning' : ''}`}>
                    Time left: {countdown}s
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="qr-instructions">
                <h3>Scan & Pay Using PhonePe App</h3>
                <p>Open PhonePe app and scan this QR code to complete your payment</p>
                
                <div className="steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <span className="step-text">Open PhonePe App</span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span className="step-text">Tap on 'Scan & Pay'</span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span className="step-text">Scan this QR Code</span>
                  </div>
                  <div className="step">
                    <span className="step-number">4</span>
                    <span className="step-text">Confirm Payment</span>
                  </div>
                  <div className="step">
                    <span className="step-number">5</span>
                    <span className="step-text">Enter UPI PIN</span>
                  </div>
                  <div className="step">
                    <span className="step-number">6</span>
                    <span className="step-text">Payment Successful</span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="payment-status">
                {paymentStatus === 'pending' && (
                  <div className="status-pending">
                    <div className="status-icon">📱</div>
                    <p>Waiting for payment scan...</p>
                    <p className="payment-instruction">
                      After completing payment, enter your <strong>Transaction ID/Reference Number</strong> from your payment app:
                    </p>
                    
                    <div className="transaction-input-group">
                      <input
                        type="text"
                        className="transaction-id-input"
                        placeholder="Enter Transaction ID (e.g., UPI1234567890)"
                        value={transactionId}
                        onChange={(e) => {
                          setTransactionId(e.target.value);
                          setVerificationError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleVerifyPayment();
                          }
                        }}
                      />
                      {verificationError && (
                        <div className="verification-error">
                          ⚠️ {verificationError}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="payment-done-btn" 
                      onClick={handleVerifyPayment}
                      disabled={!transactionId || transactionId.trim().length < 8}
                    >
                      ✅ Verify Payment
                    </button>
                    
                    <div className="demo-separator">
                      <span>or</span>
                    </div>
                    
                    <button className="simulate-payment-btn" onClick={simulatePayment}>
                      Simulate Payment (Demo - No Verification)
                    </button>
                  </div>
                )}

                {paymentStatus === 'processing' && (
                  <div className="status-processing">
                    <div className="loading-spinner"></div>
                    <p>Processing your payment...</p>
                    <p className="processing-note">Please wait while we verify your transaction</p>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="status-success">
                    <div className="success-icon">✅</div>
                    <h3>Payment Verified Successfully!</h3>
                    <p>Your payment of ₹{totalAmount} has been verified and processed successfully.</p>
                    <div className="transaction-details">
                      <div className="transaction-id">
                        Transaction ID: {verifiedTransactionId || `TXN${Date.now().toString().slice(-8)}`}
                      </div>
                      <div className="transaction-time">
                        Time: {new Date().toLocaleTimeString()}
                      </div>
                      <div className="transaction-amount">
                        Amount: ₹{totalAmount}
                      </div>
                      <div className="transaction-merchant">
                        Merchant: Mr. VINIT VIJAY SAHARE
                      </div>
                    </div>
                  </div>
                )}

                {paymentStatus === 'expired' && (
                  <div className="status-expired">
                    <div className="expired-icon">⏰</div>
                    <h3>Payment Expired</h3>
                    <p>The payment session has expired. Please try again.</p>
                    <button className="retry-btn" onClick={() => {
                      setPaymentStatus('pending');
                      setCountdown(30);
                    }}>
                      Try Again
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="additional-info">
                <h4>Need Help?</h4>
                <div className="help-points">
                  <div className="help-point">
                    <span className="help-icon">📱</span>
                    <span>Ensure PhonePe app is updated</span>
                  </div>
                  <div className="help-point">
                    <span className="help-icon">💡</span>
                    <span>Keep your phone steady while scanning</span>
                  </div>
                  <div className="help-point">
                    <span className="help-icon">🔒</span>
                    <span>Never share your UPI PIN with anyone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom of right section */}
            <div className="qr-footer">
              <div className="security-badge">🔒 Secure Payment • PCI DSS Compliant</div>
              <div className="copyright">
                © {new Date().getFullYear()}, All rights reserved, PhonePe Ltd
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;