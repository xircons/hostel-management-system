import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRPayment = ({ 
  amount = 0, 
  bookingId = 'BK001', 
  onPaymentComplete, 
  onSaveQR,
  onBack,
  onNext 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const canvasRef = useRef(null);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Handle timeout - could redirect or show error
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate QR code with logo
  useEffect(() => {
    generateQRCode();
  }, [amount, bookingId]);

  const generateQRCode = async () => {
    try {
      // PromptPay QR Code Data Format
      // Format: 00020101021229370016A00000067701011101130066812345678902540400053037645405000.005802TH6304
      const promptPayData = {
        // Thai QR Code Standard
        payloadFormatIndicator: '01',
        pointOfInitiationMethod: '12',
        // Merchant Account Information
        merchantAccountInfo: {
          globalUniqueIdentifier: 'A000000677010111',
          merchantId: '6681234567890' // Replace with actual merchant ID
        },
        // Transaction Currency (THB = 764)
        transactionCurrency: '764',
        // Transaction Amount
        transactionAmount: amount.toFixed(2),
        // Country Code (TH = 764)
        countryCode: 'TH',
        // CRC (Checksum) - This would be calculated in real implementation
        crc: '6304'
      };

      // Convert to QR string format (simplified for demo)
      const qrString = `00020101021229370016A0000006770101110113006681234567890254040005303764540500${amount.toFixed(2)}5802TH6304`;

      // Generate QR code
      const qrDataURL = await QRCode.toDataURL(qrString, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      setQrCodeDataURL(qrDataURL);

      // Draw QR code with logo overlay
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Create image from QR code data URL
        const qrImage = new Image();
        qrImage.onload = () => {
          // Draw QR code
          ctx.drawImage(qrImage, 0, 0, 280, 280);
          
          // Draw logo overlay in center
          drawPromptPayLogo(ctx, 280, 280);
        };
        qrImage.src = qrDataURL;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const drawPromptPayLogo = (ctx, width, height) => {
    const logoSize = 60;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw white background circle for logo
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw PromptPay "P" logo
    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', centerX, centerY);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSaveQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `promptpay-qr-${bookingId}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      
      if (onSaveQR) {
        onSaveQR(qrCodeDataURL);
      }
    }
  };

  const handlePaymentComplete = () => {
    if (onPaymentComplete) {
      onPaymentComplete({
        bookingId,
        amount,
        paymentMethod: 'promptpay',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>QR PAYMENT</h1>
          <div style={styles.promptPayBrand}>
            <span style={styles.promptPayText}>PromptPay</span>
            <div style={styles.promptPayLogo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.promptPayLogoSmall}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Timer Warning */}
        <div style={styles.timerContainer}>
          <span style={styles.timerText}>
            Please pay within 10 minutes. 
            <span style={styles.timeRemaining}>Time remaining {formatTime(timeRemaining)}</span>
          </span>
        </div>

        {/* QR Code */}
        <div style={styles.qrContainer}>
          <canvas 
            ref={canvasRef}
            width={280}
            height={280}
            style={styles.qrCode}
          />
        </div>

        {/* Instructions */}
        <div style={styles.instructions}>
          <p style={styles.instructionText}>
            Please scan the QR code using compatible PromptPay app to continue payment
          </p>
        </div>

        {/* Save QR Button */}
        <div style={styles.buttonContainer}>
          <button 
            onClick={handleSaveQR}
            style={styles.saveButton}
          >
            SAVE QR
          </button>
        </div>

        {/* Payment Complete Button (for demo) */}
        <div style={styles.paymentCompleteContainer}>
          <button 
            onClick={handlePaymentComplete}
            style={styles.paymentCompleteButton}
          >
            Payment Complete (Demo)
          </button>
        </div>

        {/* Navigation */}
        <div style={styles.navigation}>
          {onBack && (
            <button onClick={onBack} style={styles.navButton}>
              ← Back
            </button>
          )}
          {onNext && (
            <button onClick={onNext} style={styles.navButton}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  header: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px'
  },
  
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#000000',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  
  promptPayBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  promptPayText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000'
  },
  
  promptPayLogo: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3B82F6',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF'
  },
  
  headerRight: {
    display: 'flex',
    alignItems: 'center'
  },
  
  promptPayLogoSmall: {
    width: '24px',
    height: '24px',
    backgroundColor: '#F3F4F6',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3B82F6',
    border: '1px solid #E5E7EB'
  },
  
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
    maxWidth: '400px',
    width: '100%'
  },
  
  timerContainer: {
    textAlign: 'center',
    padding: '12px 24px',
    backgroundColor: '#FEF3C7',
    borderRadius: '12px',
    border: '2px solid #F59E0B'
  },
  
  timerText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#92400E',
    margin: 0
  },
  
  timeRemaining: {
    color: '#DC2626',
    fontWeight: '700'
  },
  
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB'
  },
  
  qrCode: {
    borderRadius: '8px'
  },
  
  instructions: {
    textAlign: 'center',
    maxWidth: '320px'
  },
  
  instructionText: {
    fontSize: '16px',
    color: '#374151',
    lineHeight: '1.5',
    margin: 0,
    fontWeight: '500'
  },
  
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  
  saveButton: {
    backgroundColor: '#0D9488',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  
  paymentCompleteContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px'
  },
  
  paymentCompleteButton: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  
  navigation: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px'
  },
  
  navButton: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default QRPayment;
