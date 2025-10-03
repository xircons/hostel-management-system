import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { usePayment } from '../contexts/PaymentContext';
import './QRPaymentStep.css';

const QRPaymentStep = ({ 
  amount = 0, 
  onPaymentComplete, 
  onNext,
  onPrevious 
}) => {
  // Payment context
  const {
    paymentState,
    paymentData,
    qrDataURL,
    setPaymentState,
    setPaymentData,
    setQRData
  } = usePayment();

  // Local state
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const canvasRef = useRef(null);
  const qrGeneratedRef = useRef(false);

  // Generate transaction reference
  const generateTransactionRef = useCallback(() => {
    const timestamp = Date.now();
    return `BK${timestamp}`;
  }, []);

  // Calculate responsive QR size
  const getQRSize = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space considering padding and other elements
    const availableWidth = Math.min(viewportWidth * 0.8, 400);
    const availableHeight = Math.min(viewportHeight * 0.4, 400);
    
    // Use the smaller dimension to ensure it fits in viewport
    const maxSize = Math.min(availableWidth, availableHeight);
    
    // Responsive breakpoints
    if (viewportWidth <= 360) {
      return Math.min(maxSize, 200);
    } else if (viewportWidth <= 480) {
      return Math.min(maxSize, 250);
    } else if (viewportWidth <= 768) {
      return Math.min(maxSize, 300);
    } else if (viewportWidth <= 1200) {
      return Math.min(maxSize, 350);
    } else {
      return Math.min(maxSize, 400);
    }
  }, []);

  // Generate QR Code
  const generateQRCode = useCallback(async () => {
    if (paymentState === 'success') {
      return; // Don't regenerate if payment is successful
    }
    
    try {
      const qrSize = getQRSize();
      const transactionRef = generateTransactionRef();
      
      // Update payment data with current transaction reference
      setPaymentData({
        amount,
        reference: transactionRef,
        timestamp: new Date().toISOString()
      });

      // Generate PromptPay QR string
      const qrString = `00020101021229370016A0000006770101110113006681234567890254040005303764540500${amount.toFixed(2)}5802TH6304`;
      
      const qrDataURL = await QRCode.toDataURL(qrString, {
        width: qrSize,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
      });

      setQRData(qrDataURL);

      // Draw QR code on canvas with Thai QR logo overlay
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match QR size (perfect 1:1 aspect ratio)
        const qrSize = getQRSize();
        canvas.width = qrSize;
        canvas.height = qrSize;
        
        // Set canvas background to white to prevent flash
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, qrSize, qrSize);
        
        const qrImage = new Image();
        qrImage.onload = () => {
          // Draw QR code maintaining 1:1 aspect ratio
          ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
          drawPromptPayLogo(ctx, qrSize, qrSize);
          qrGeneratedRef.current = true;
        };
        qrImage.src = qrDataURL;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setPaymentState('error');
    }
  }, [amount, paymentState, getQRSize, generateTransactionRef, setPaymentData, setQRData, setPaymentState]);

  // Draw PromptPay logo overlay
  const drawPromptPayLogo = useCallback((ctx, width, height) => {
    const logoSize = Math.min(width, height) * 0.15; // 15% of QR size
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create image element for Thai QR logo
    const logoImage = new Image();
    logoImage.crossOrigin = 'anonymous';
    
    logoImage.onload = () => {
      // Draw the Thai QR logo
      const logoX = centerX - logoSize / 2;
      const logoY = centerY - logoSize / 2;
      ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
    };
    
    logoImage.onerror = () => {
      // Fallback to simple "P" if image fails to load
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 28px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P', centerX, centerY);
    };
    
    // Load the official Thai QR Payment logo
    logoImage.src = 'https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png';
  }, []);

  // Handle payment completion
  const handlePaymentComplete = useCallback(() => {
    setPaymentState('processing');
    
    // Simulate processing
    setTimeout(() => {
      setPaymentState('success');
      
      if (onPaymentComplete) {
        onPaymentComplete({
          amount: paymentData.amount || amount,
          reference: paymentData.reference,
          promptpayId: paymentData.promptpayId,
          timestamp: new Date().toISOString()
        });
      }
    }, 1500);
  }, [setPaymentState, onPaymentComplete, paymentData, amount]);

  // Handle QR download
  const handleSaveQR = useCallback(async () => {
    setIsDownloading(true);
    
    try {
      if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = `promptpay-qr-${paymentData.reference || 'BK' + Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  }, [paymentData.reference]);

  // Handle copy PromptPay ID
  const handleCopyID = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(paymentData.promptpayId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [paymentData.promptpayId]);

  // Check payment status (placeholder for backend verification)
  const checkPaymentStatus = useCallback(async () => {
    // This would typically make an API call to verify payment status
    // For now, we'll just return the current state
    return paymentState;
  }, [paymentState]);

  // Effect to generate QR code when component mounts or amount changes
  useEffect(() => {
    if (paymentState !== 'success' && amount > 0) {
      generateQRCode();
    }
  }, [amount, paymentState, generateQRCode]);

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (paymentState !== 'success' && qrGeneratedRef.current) {
        generateQRCode();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [paymentState, generateQRCode]);

  // Effect to check if canvas is empty and regenerate if needed
  useEffect(() => {
    const checkCanvas = () => {
      if (canvasRef.current && paymentState !== 'success') {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const isEmpty = imageData.data.every(pixel => pixel === 0);
        
        if (isEmpty) {
          generateQRCode();
        }
      }
    };

    const timer = setTimeout(checkCanvas, 1000);
    return () => clearTimeout(timer);
  }, [paymentState, generateQRCode]);

  // Render payment confirmed summary
  if (paymentState === 'success') {
    return (
      <div className="qr-payment-step">
        <div className="payment-confirmed-card">
            <div className="confirmed-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="confirmed-title">Payment Confirmed!</h2>
            <p className="confirmed-message">
              Your payment has been successfully processed. You can now proceed to the next step.
            </p>
            
            <div className="payment-summary">
              <div className="summary-row">
                <span className="summary-label">Amount Paid:</span>
                <span className="summary-value">{paymentData.amount || amount} THB</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Transaction Ref:</span>
                <span className="summary-value">{paymentData.reference}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Payment Method:</span>
                <span className="summary-value">PromptPay</span>
              </div>
            </div>

            <button 
              onClick={onNext}
              className="btn btn-primary btn-large"
            >
              Continue to Confirmation
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-payment-step">
      <div className="payment-card">
          
          {/* QR Code Section */}
          <div className="qr-section">
            <div className="qr-container">
              <div className="qr-card">
                <div className="qr-wrapper">
                  <canvas 
                    ref={canvasRef}
                    className="qr-code"
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="qr-actions">
                <button
                  onClick={handleSaveQR}
                  disabled={isDownloading || paymentState !== 'awaiting'}
                  className="action-button action-button-secondary"
                >
                  <div className="action-icon action-icon-download"></div>
                  {isDownloading ? 'Saving...' : 'Download QR'}
                </button>
                
                <button
                  onClick={handleCopyID}
                  disabled={paymentState !== 'awaiting'}
                  className="action-button action-button-secondary"
                >
                  <div className="action-icon action-icon-copy"></div>
                  Copy ID
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="transaction-details">
            <div className="transaction-card">
              
              {/* Total Amount */}
              <div className="transaction-row">
                <span className="transaction-label">Total Amount</span>
                <span className="transaction-value">{amount} THB</span>
              </div>

              {/* PromptPay ID */}
              <div className="transaction-row">
                <span className="transaction-label">PromptPay ID</span>
                <span className="transaction-value">{paymentData.promptpayId}</span>
              </div>

              {/* Transaction Ref */}
              <div className="transaction-row">
                <span className="transaction-label">Transaction Ref</span>
                <span className="transaction-value">{paymentData.reference || generateTransactionRef()}</span>
              </div>

              {/* Divider */}
              <div className="transaction-divider"></div>

              {/* Secure Payment */}
              <div className="transaction-row">
                <div className="transaction-label-with-icon">
                  <div className="transaction-icon transaction-icon-shield"></div>
                  <span className="transaction-label">Secure Payment</span>
                </div>
                <span className="transaction-badge">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="help-section">
            <div className="help-content">
              
              {/* Step 1 */}
              <div className="help-step">
                <div className="help-step-number">1</div>
                <div className="help-step-content">
                  <div className="help-step-title">Open your banking app</div>
                  <div className="help-step-description">SCB Easy, K PLUS, or any Banking app</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="help-step">
                <div className="help-step-number">2</div>
                <div className="help-step-content">
                  <div className="help-step-title">Scan QR code</div>
                  <div className="help-step-description">Use the scan function in your app</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="help-step">
                <div className="help-step-number">3</div>
                <div className="help-step-content">
                  <div className="help-step-title">Confirm payment</div>
                  <div className="help-step-description">Check amount and authorize transaction</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Copy Success Feedback */}
        {isCopied && (
          <div className="copy-feedback">
            <div className="copy-icon"></div>
            Copied!
          </div>
        )}
    </div>
  );
};

export default QRPaymentStep;
