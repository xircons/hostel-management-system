import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import './Booking.css';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    // Step 1: Room & Dates
    roomId: searchParams.get('room') || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    
    // Step 2: Guest Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    
    // Step 3: Payment
    paymentMethod: 'promptpay',
    promptpayId: '',
    
    // Step 4: Confirmation
    specialRequests: ''
  });

  // Payment state
  const [paymentState, setPaymentState] = useState('awaiting'); // awaiting, processing, success, error
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const canvasRef = useRef(null);

  const rooms = [
    { id: 1, name: "Cozy Dormitory", price: 25, type: "Dormitory" },
    { id: 2, name: "Private Single", price: 45, type: "Private" },
    { id: 3, name: "Family Suite", price: 85, type: "Family" },
    { id: 4, name: "Deluxe Double", price: 65, type: "Private" },
    { id: 5, name: "Budget Dormitory", price: 20, type: "Dormitory" },
    { id: 6, name: "Executive Suite", price: 120, type: "Family" }
  ];

  const selectedRoom = rooms.find(room => room.id.toString() === bookingData.roomId);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    return selectedRoom.price * nights;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', bookingData);
    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };

  // Payment functions
  useEffect(() => {
    if (currentStep === 3 && paymentState === 'awaiting') {
      generateQRCode();
    }
  }, [currentStep, paymentState]);

  // Regenerate QR code on window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (currentStep === 3 && paymentState === 'awaiting') {
        generateQRCode();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep, paymentState]);

  const generateQRCode = async () => {
    try {
      const qrString = `00020101021229370016A0000006770101110113006681234567890254040005303764540500${calculateTotal().toFixed(2)}5802TH6304`;
      
      // Calculate responsive QR size
      const getQRSize = () => {
        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 480) {
          return Math.min(280, viewportWidth * 0.6);
        } else if (viewportWidth <= 768) {
          return Math.min(320, viewportWidth * 0.7);
        } else {
          return Math.min(400, viewportWidth * 0.8);
        }
      };
      
      const qrSize = getQRSize();
      
      const qrDataURL = await QRCode.toDataURL(qrString, {
        width: qrSize,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
      });

      setQrCodeDataURL(qrDataURL);

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match QR size
        canvas.width = qrSize;
        canvas.height = qrSize;
        
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
          drawPromptPayLogo(ctx, qrSize, qrSize);
        };
        qrImage.src = qrDataURL;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setPaymentState('error');
    }
  };

  const drawPromptPayLogo = (ctx, width, height) => {
    const logoSize = Math.min(width, height) * 0.15; // 15% of QR size
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create image element for Thai QR logo
    const logoImage = new Image();
    logoImage.crossOrigin = 'anonymous';
    
    logoImage.onload = () => {
      // // White background circle
      // ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      // ctx.beginPath();
      // ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
      // ctx.fill();
      
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
      
      ctx.fillStyle = '#1E40AF';
      ctx.font = 'bold 28px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P', centerX, centerY);
    };
    
    // Load the official Thai QR Payment logo
    logoImage.src = 'https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png';
  };


  const handlePaymentComplete = () => {
    setPaymentState('processing');
    
    // Simulate processing
    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        nextStep();
      }, 2000);
    }, 1500);
  };

  const handleSaveQR = async () => {
    setIsDownloading(true);
    
    try {
      if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = `promptpay-qr-BK${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleCopyID = async () => {
    try {
      await navigator.clipboard.writeText('0066812345678');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusIcon = () => {
    switch (paymentState) {
      case 'awaiting':
        return <div className="status-icon status-icon-clock"></div>;
      case 'processing':
        return <div className="status-icon status-icon-spinner"></div>;
      case 'success':
        return <div className="status-icon status-icon-check"></div>;
      case 'error':
      case 'expired':
        return <div className="status-icon status-icon-error"></div>;
      default:
        return <div className="status-icon status-icon-clock"></div>;
    }
  };

  const getStatusMessage = () => {
    switch (paymentState) {
      case 'awaiting':
        return 'Awaiting Payment';
      case 'processing':
        return 'Verifying Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Error';
      case 'expired':
        return 'Payment Expired';
      default:
        return 'Awaiting Payment';
    }
  };

  const getStatusClass = () => {
    switch (paymentState) {
      case 'awaiting':
        return 'status-banner-awaiting';
      case 'processing':
        return 'status-banner-processing';
      case 'success':
        return 'status-banner-success';
      case 'error':
      case 'expired':
        return 'status-banner-error';
      default:
        return 'status-banner-awaiting';
    }
  };

  const steps = [
    { number: 1, title: 'Room & Dates', description: 'Select your room and dates' },
    { number: 2, title: 'Guest Details', description: 'Enter your information' },
    { number: 3, title: 'Payment', description: 'Choose payment method' },
    { number: 4, title: 'Confirmation', description: 'Review and confirm' }
  ];

  return (
    <div className="booking-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Book Your Stay</h1>
          <p className="page-subtitle">
            Complete your reservation in just a few simple steps
          </p>
        </div>

        <div className="booking-content">
          {/* Progress Steps */}
          <div className="steps-container">
            <div className="steps">
              {steps.map((step) => (
                <div 
                  key={step.number} 
                  className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                >
                  <div className="step-number">
                    {currentStep > step.number ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                      </svg>
                    ) : step.number}
                  </div>
                  <div className="step-info">
                    <div className="step-title">{step.title}</div>
                    <div className="step-description">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-form-container">
            <form onSubmit={handleSubmit} className="booking-form">
              
              {/* Step 1: Room & Dates */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h2 className="step-title">Select Room & Dates</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Room Type</label>
                    <select 
                      className="form-select"
                      value={bookingData.roomId}
                      onChange={(e) => handleInputChange('roomId', e.target.value)}
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name} - ${room.price}/night ({room.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Check-in Date</label>
                      <input 
                        type="date"
                        className="form-input"
                        value={bookingData.checkIn}
                        onChange={(e) => handleInputChange('checkIn', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Check-out Date</label>
                      <input 
                        type="date"
                        className="form-input"
                        value={bookingData.checkOut}
                        onChange={(e) => handleInputChange('checkOut', e.target.value)}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Number of Guests</label>
                    <select 
                      className="form-select"
                      value={bookingData.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                      required
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Details */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2 className="step-title">Guest Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text"
                        className="form-input"
                        value={bookingData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text"
                        className="form-input"
                        value={bookingData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email"
                        className="form-input"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="tel"
                        className="form-input"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nationality</label>
                    <input 
                      type="text"
                      className="form-input"
                      value={bookingData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="form-step">
                  <div className="payment-interface">
                    <div className="payment-container">

                        {/* Main Payment Card */}
                        <div className="payment-card">
                          
                          {/* QR Code Area */}
                        <div className="qr-section">
                          <div className="qr-container">
                            {/* QR Code Card */}
                            <div className="qr-card">
                              <div className="qr-wrapper">
                                <canvas 
                                  ref={canvasRef}
                                  className="qr-code"
                                />
                              </div>
                            </div>

                            {/* Action Buttons Below QR */}
                            <div className="qr-actions">
                              <button
                                onClick={handleSaveQR}
                                disabled={isDownloading}
                                className="action-button action-button-secondary"
                              >
                                <div className="action-icon action-icon-download"></div>
                                {isDownloading ? 'Saving...' : 'Download'}
                              </button>
                              
                              <button
                                onClick={handleCopyID}
                                className="action-button action-button-secondary"
                              >
                                <div className="action-icon action-icon-copy"></div>
                                Copy ID
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Transaction Details Card */}
                        <div className="transaction-details">
                          <div className="transaction-card">
                            
                            {/* Total Amount */}
                            <div className="transaction-row">
                              <span className="transaction-label">Total Amount</span>
                              <span className="transaction-value">{calculateTotal()} THB</span>
                            </div>

                            {/* PromptPay ID */}
                            <div className="transaction-row">
                              <span className="transaction-label">PromptPay ID</span>
                              <span className="transaction-value">0066812345678</span>
                            </div>

                            {/* Transaction Ref */}
                            <div className="transaction-row">
                              <span className="transaction-label">Transaction Ref</span>
                              <span className="transaction-value">BK{Date.now()}</span>
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

                      {/* Trust Badges Footer */}
                      {/* <div className="trust-badges">
                        <div className="trust-badge">
                          <div className="trust-icon trust-icon-shield"></div>
                          <span className="trust-text">Secure Payment</span>
                        </div>
                        <div className="trust-badge">
                          <div className="trust-icon trust-icon-check"></div>
                          <span className="trust-text">No Hidden Fees</span>
                        </div>
                      </div> */}

                      {/* Copy Success Feedback */}
                      {isCopied && (
                        <div className="copy-feedback">
                          <div className="copy-icon"></div>
                          Copied!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="form-step">
                  <h2 className="step-title">Review & Confirm</h2>
                  
                  <div className="booking-summary">
                    <div className="summary-section">
                      <h3>Room Details</h3>
                      <p><strong>Room:</strong> {selectedRoom?.name}</p>
                      <p><strong>Type:</strong> {selectedRoom?.type}</p>
                      <p><strong>Check-in:</strong> {bookingData.checkIn}</p>
                      <p><strong>Check-out:</strong> {bookingData.checkOut}</p>
                      <p><strong>Guests:</strong> {bookingData.guests}</p>
                    </div>

                    <div className="summary-section">
                      <h3>Guest Information</h3>
                      <p><strong>Name:</strong> {bookingData.firstName} {bookingData.lastName}</p>
                      <p><strong>Email:</strong> {bookingData.email}</p>
                      <p><strong>Phone:</strong> {bookingData.phone}</p>
                      <p><strong>Nationality:</strong> {bookingData.nationality}</p>
                    </div>

                    <div className="summary-section">
                      <h3>Payment Summary</h3>
                      <div className="price-breakdown">
                        <div className="price-line">
                          <span>Room Rate (${selectedRoom?.price}/night)</span>
                          <span>${calculateTotal()}</span>
                        </div>
                        <div className="price-line total">
                          <span><strong>Total Amount</strong></span>
                          <span><strong>${calculateTotal()}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Requests (Optional)</label>
                    <textarea 
                      className="form-textarea"
                      value={bookingData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 4 ? (
                  currentStep === 3 ? (
                    paymentState === 'awaiting' ? (
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={handlePaymentComplete}
                      >
                        I've Completed Payment
                      </button>
                    ) : paymentState === 'processing' ? (
                      <div className="processing-button">
                        <div className="processing-spinner"></div>
                        Verifying Payment...
                      </div>
                    ) : paymentState === 'success' ? (
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={nextStep}
                      >
                        Next Step
                      </button>
                    ) : paymentState === 'expired' ? (
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => window.location.reload()}
                      >
                        Start New Booking
                      </button>
                    ) : null
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Next Step
                    </button>
                  )
                ) : (
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
