import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { PaymentProvider } from '../contexts/PaymentContext';
import QRPaymentStep from '../components/QRPaymentStep';
import RoomRow from '../components/RoomRow';
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


  const rooms = [
    { 
      id: 1, 
      name: "Standard King Bed Room", 
      price: 531, 
      type: "Private",
      size: "15m²",
      capacity: 2,
      amenities: ["เครื่องปรับอากาศ", "ปลั๊กใกล้เตียง", "พื้นกระเบื้อง/หินอ่อน", "โต๊ะทำงาน", "มุ้ง", "พัดลม", "เครื่องอบผ้า", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "ราวแขวนเสื้อผ้า"],
      description: "Comfortable private room with king-size bed, air conditioning, and shared bathroom facilities. Located on upper floor with stair access only.",
      available: true,
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276200.jpg?k=23e9769ddc55635cebd1c6b315734f46f9fe6e73c2bdf145e162b10659171f51&o="
    },
    { 
      id: 2, 
      name: "Female Dormitory 4-Bed", 
      price: 216, 
      type: "Dormitory",
      size: "15m²",
      capacity: 4,
      amenities: ["ชุดผ้าสำหรับห้องพัก", "พัดลม", "เครื่องอบผ้า", "พื้นกระเบื้อง/หินอ่อน", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "มุ้ง", "ปลั๊กใกล้เตียง", "เครื่องปรับอากาศ"],
      description: "Comfortable female-only dormitory with 4 beds, air conditioning, and shared bathroom facilities.",
      available: true,
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276533.jpg?k=652f3d9b297cabc399e4e20bbf879430eb3d294fc5c544ff8bdf0090cbbf2798&o="
    },
    { 
      id: 3, 
      name: "Mixed Dormitory 4-Bed", 
      price: 216, 
      type: "Dormitory",
      size: "15m²",
      capacity: 4,
      amenities: ["ชุดผ้าสำหรับห้องพัก", "พัดลม", "เครื่องอบผ้า", "พื้นกระเบื้อง/หินอ่อน", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "มุ้ง", "ปลั๊กใกล้เตียง", "เครื่องปรับอากาศ"],
      description: "Comfortable mixed dormitory with 4 beds, air conditioning, and shared bathroom facilities.",
      available: true,
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276494.jpg?k=fa258523250cc272021978eca8489404a422b425991d2aee3e3cd5bcd2fb71ac&o="
    }
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
    <PaymentProvider>
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
                  {/* Step Header */}
                  {/* <div className="step-header">
                    <h2 className="step-title">Choose Your Perfect Room</h2>
                    <p className="step-description">Select your dates and find the ideal accommodation for your stay</p>
                  </div> */}

                  {/* Search Section */}
                  <div className="search-section">
                    <div className="search-card">
                      <div className="search-header">
                        <h3 className="search-title">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7L21 7M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Search & Filter
                        </h3>
                      </div>
                      
                      <div className="search-form">
                        <div className="search-row horizontal">
                          <div className="search-field">
                            <label className="field-label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V8.5C3 7.39543 3.89543 6.5 5 6.5H19C20.1046 6.5 21 7.39543 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Check-in Date
                            </label>
                            <input 
                              type="date"
                              className="field-input"
                              value={bookingData.checkIn}
                              onChange={(e) => handleInputChange('checkIn', e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                          
                          <div className="search-field">
                            <label className="field-label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V8.5C3 7.39543 3.89543 6.5 5 6.5H19C20.1046 6.5 21 7.39543 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Check-out Date
                            </label>
                            <input 
                              type="date"
                              className="field-input"
                              value={bookingData.checkOut}
                              onChange={(e) => handleInputChange('checkOut', e.target.value)}
                              min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                          
                          <div className="search-field">
                            <label className="field-label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 21V19C17 17.134 13.866 14 10 14C6.13401 14 3 17.134 3 19V21M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Guests
                            </label>
                            <select 
                              className="field-select"
                              value={bookingData.guests}
                              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                              required
                            >
                              {[1,2,3,4,5,6,7,8].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="search-field">
                            <button type="button" className="search-btn" onClick={nextStep}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="results-section">
                    <div className="results-header">
                      <h3 className="results-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7L21 7M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Available Rooms ({rooms.length})
                      </h3>
                      <div className="results-summary">
                        {bookingData.checkIn && bookingData.checkOut && (
                          <span className="date-range">
                            {new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rooms-grid vertical">
                      {rooms.map(room => (
                        <RoomRow
                          key={room.id}
                          room={room}
                          isSelected={bookingData.roomId === room.id.toString()}
                          onSelect={(selectedRoom) => handleInputChange('roomId', selectedRoom.id.toString())}
                          showSelectButton={true}
                        />
                      ))}
                    </div>
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
                  <QRPaymentStep 
                    amount={calculateTotal()}
                    onPaymentComplete={(paymentData) => {
                      console.log('Payment completed:', paymentData);
                    }}
                    onNext={nextStep}
                    onPrevious={prevStep}
                  />
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
                          <span>Room Rate (฿{selectedRoom?.price}/night)</span>
                          <span>฿{calculateTotal()}</span>
                        </div>
                        <div className="price-line total">
                          <span><strong>Total Amount</strong></span>
                          <span><strong>฿{calculateTotal()}</strong></span>
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
    </PaymentProvider>
  );
};

export default Booking;
