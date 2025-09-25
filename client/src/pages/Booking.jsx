import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Step 4: Confirmation
    specialRequests: ''
  });

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
                  <h2 className="step-title">Payment Information</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select 
                      className="form-select"
                      value={bookingData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  {bookingData.paymentMethod === 'card' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input 
                          type="text"
                          className="form-input"
                          value={bookingData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Expiry Date</label>
                          <input 
                            type="text"
                            className="form-input"
                            value={bookingData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input 
                            type="text"
                            className="form-input"
                            value={bookingData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input 
                          type="text"
                          className="form-input"
                          value={bookingData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
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
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next Step
                  </button>
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
