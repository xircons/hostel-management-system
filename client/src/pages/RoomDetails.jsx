import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RoomDetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (!room || room.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % room.images.length
      );
    }, 10000); // Auto-slide every 10 seconds

    return () => clearInterval(interval);
  }, [room]);

  // Handle dot click
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  // Sample room data
  const rooms = [
    {
      id: 1,
      name: "Standard King Bed Room",
      type: "Private",
      price: 531,
      size: "15m²",
      capacity: 2,
      amenities: ["เครื่องปรับอากาศ", "ปลั๊กใกล้เตียง", "พื้นกระเบื้อง/หินอ่อน", "โต๊ะทำงาน", "มุ้ง", "พัดลม", "เครื่องอบผ้า", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "ราวแขวนเสื้อผ้า"],
      images: [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276200.jpg?k=23e9769ddc55635cebd1c6b315734f46f9fe6e73c2bdf145e162b10659171f51&o="
      ],
      description: "Comfortable private room with king-size bed, air conditioning, and shared bathroom facilities. Located on upper floor with stair access only.",
      available: true,
      detailedDescription: "This spacious private room features a comfortable king-size bed, air conditioning for your comfort, and access to shared bathroom facilities. The room is located on the upper floor and is accessible by stairs only. Perfect for couples or solo travelers seeking privacy and comfort.",
      features: [
        "เตียงคิงไซส์",
        "เครื่องปรับอากาศ",
        "ปลั๊กใกล้เตียง",
        "พื้นกระเบื้อง/หินอ่อน",
        "โต๊ะทำงาน",
        "มุ้ง",
        "พัดลม",
        "เครื่องอบผ้า",
        "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น",
        "ราวแขวนเสื้อผ้า"
      ],
      policies: [
        "Check-in: 2:00 PM - 10:00 PM",
        "Check-out: 11:00 AM",
        "No smoking in rooms",
        "Shared bathroom facilities",
        "Upper floor access via stairs only"
      ]
    },
    {
      id: 2,
      name: "Female Dormitory 4-Bed",
      type: "Dormitory",
      price: 216,
      size: "15m²",
      capacity: 4,
      amenities: ["ชุดผ้าสำหรับห้องพัก", "พัดลม", "เครื่องอบผ้า", "พื้นกระเบื้อง/หินอ่อน", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "มุ้ง", "ปลั๊กใกล้เตียง", "เครื่องปรับอากาศ"],
      images: [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276533.jpg?k=652f3d9b297cabc399e4e20bbf879430eb3d294fc5c544ff8bdf0090cbbf2798&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276515.jpg?k=3590856db47369f89cfbc6db704014d220cc68e937be7383fb5af7d440890e87&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276200.jpg?k=23e9769ddc55635cebd1c6b315734f46f9fe6e73c2bdf145e162b10659171f51&o="
      ],
      description: "Comfortable female-only dormitory with 4 beds, air conditioning, and shared bathroom facilities.",
      available: true,
      detailedDescription: "This female-only dormitory offers a safe and comfortable environment for female travelers. The room features 4 comfortable beds, air conditioning, and access to shared bathroom facilities. Perfect for solo female travelers or groups of female friends.",
      features: [
        "4 เตียงในเตียงสองชั้น",
        "ชุดผ้าสำหรับห้องพัก",
        "พัดลม",
        "เครื่องอบผ้า",
        "พื้นกระเบื้อง/หินอ่อน",
        "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น",
        "มุ้ง",
        "ปลั๊กใกล้เตียง",
        "เครื่องปรับอากาศ",
        "ห้องพักสำหรับผู้หญิงเท่านั้น"
      ],
      policies: [
        "Check-in: 2:00 PM - 10:00 PM",
        "Check-out: 11:00 AM",
        "Female-only accommodation",
        "Shared bathroom facilities",
        "Bedding included"
      ]
    },
    {
      id: 3,
      name: "Mixed Dormitory 4-Bed",
      type: "Dormitory",
      price: 216,
      size: "15m²",
      capacity: 4,
      amenities: ["ชุดผ้าสำหรับห้องพัก", "พัดลม", "เครื่องอบผ้า", "พื้นกระเบื้อง/หินอ่อน", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "มุ้ง", "ปลั๊กใกล้เตียง", "เครื่องปรับอากาศ"],
      images: [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276494.jpg?k=fa258523250cc272021978eca8489404a422b425991d2aee3e3cd5bcd2fb71ac&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276200.jpg?k=23e9769ddc55635cebd1c6b315734f46f9fe6e73c2bdf145e162b10659171f51&o="
      ],
      description: "Comfortable mixed dormitory with 4 beds, air conditioning, and shared bathroom facilities.",
      available: true,
      detailedDescription: "This mixed dormitory welcomes travelers of all genders. The room features 4 comfortable beds, air conditioning, and access to shared bathroom facilities. Perfect for budget-conscious travelers who enjoy meeting new people.",
      features: [
        "4 เตียงในเตียงสองชั้น",
        "ชุดผ้าสำหรับห้องพัก",
        "พัดลม",
        "เครื่องอบผ้า",
        "พื้นกระเบื้อง/หินอ่อน",
        "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น",
        "มุ้ง",
        "ปลั๊กใกล้เตียง",
        "เครื่องปรับอากาศ",
        "ห้องพักสำหรับทุกเพศ"
      ],
      policies: [
        "Check-in: 2:00 PM - 10:00 PM",
        "Check-out: 11:00 AM",
        "Mixed gender accommodation",
        "Shared bathroom facilities",
        "Bedding included"
      ]
    }
  ];

  useEffect(() => {
    const foundRoom = rooms.find(r => r.id.toString() === id);
    setRoom(foundRoom);
  }, [id]);


  if (!room) {
    return (
      <div className="room-details-page">
        <div className="container">
          <div className="error-message">
            <h2>Room Not Found</h2>
            <p>The room you're looking for doesn't exist.</p>
            <Link to="/rooms" className="btn btn-primary">Back to Rooms</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/rooms">Rooms</Link>
          <span>/</span>
          <span>{room.name}</span>
        </nav>

        {/* Room Header - Full Width Image Slideshow */}
        <div className="room-image-full">
          <div className="slideshow-container">
            <div 
              className="slideshow-wrapper"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {room.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${room.name} - Image ${index + 1}`}
                  className={`slide ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
            
            {/* Dot Indicators */}
            {room.images.length > 1 && (
              <div className="slideshow-dots">
                {room.images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="room-badge">
            <span className={`badge ${room.type.toLowerCase()}`}>{room.type}</span>
            {!room.available && <span className="badge unavailable">Unavailable</span>}
          </div>
          <div className="room-gallery-indicator">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M8 10h8M8 14h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Gallery ({room.images.length})</span>
          </div>
        </div>

        {/* Main Content Grid - 70:30 Layout */}
        <div className="room-content-grid">
          {/* Left Column - Room Info & Details (70%) */}
          <div className="room-main-content">
            <div className="room-info">
              <h1 className="room-title">{room.name}</h1>
              <p className="room-description">{room.description}</p>
              
              <div className="room-meta">
                <div className="meta-item">
                  <div className="meta-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Price</span>
                    <span className="meta-value">฿{room.price}/night</span>
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10h-2l-.99-1.01A2.5 2.5 0 0 0 9 8H7.46c-.8 0-1.54.37-2.01.99L3 10.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Capacity</span>
                    <span className="meta-value">{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Type</span>
                    <span className="meta-value">{room.type}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Features & Amenities */}
            <div className="detail-section">
              <div className="section-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
                <h3>Features & Amenities</h3>
              </div>
              <ul className="features-list">
                {room.features.map((feature, index) => {
                  // Define icons based on feature content
                  const getFeatureIcon = (feature) => {
                    const lowerFeature = feature.toLowerCase();
                    if (lowerFeature.includes('bed') || lowerFeature.includes('bunk')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 14c-1.66 0-3 1.34-3 3v3h2v-3c0-.55.45-1 1-1s1 .45 1 1v3h2v-3c0-.55.45-1 1-1s1 .45 1 1v3h2v-3c0-1.66-1.34-3-3-3H7z" fill="currentColor"/>
                          <path d="M7 6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H7z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('bathroom') || lowerFeature.includes('shower')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 6L7 7l2 2 2-2-2-2z" fill="currentColor"/>
                          <path d="M7 7v10c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M7 7h10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M12 20h.01" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('air') || lowerFeature.includes('conditioning')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('locker') || lowerFeature.includes('storage')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('tv') || lowerFeature.includes('television')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M8 21l4-4 4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('kitchen') || lowerFeature.includes('kitchenette')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M3 6h18" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 10v4" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 10v4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('sofa') || lowerFeature.includes('living')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M2 9h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M8 9v9" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 9v9" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('balcony') || lowerFeature.includes('terrace')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21h18" stroke="currentColor" strokeWidth="2"/>
                          <path d="M5 21V7l8-4 8 4v14" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M9 9v12" stroke="currentColor" strokeWidth="2"/>
                          <path d="M15 9v12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('security') || lowerFeature.includes('24/7')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    } else if (lowerFeature.includes('desk') || lowerFeature.includes('work')) {
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M8 21l4-4 4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M12 17v4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      );
                    } else {
                      // Default checkmark for other features
                      return (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    }
                  };

                  return (
                    <li key={index}>
                      {getFeatureIcon(feature)}
                      {feature}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Actions & Additional Info (30%) */}
          <div className="room-sidebar">
            <div className="booking-card">
              <div className="booking-header">
                <h3>Book This Room</h3>
                <div className="price-display">
                  <span className="price-amount">฿{room.price}</span>
                  <span className="price-period">/night</span>
                </div>
              </div>
              
              {/* <div className="booking-details">
                <div className="booking-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10h-2l-.99-1.01A2.5 2.5 0 0 0 9 8H7.46c-.8 0-1.54.37-2.01.99L3 10.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z" fill="currentColor"/>
                  </svg>
                  <span>{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="booking-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                  </svg>
                  <span>{room.type}</span>
                </div>
              </div> */}

              <div className="booking-actions">
                {room.available ? (
                  <Link to={`/booking?room=${room.id}`} className="btn btn-primary btn-full">
                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg> */}
                    Book Now
                  </Link>
                ) : (
                  <button className="btn btn-secondary btn-full" disabled>
                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                    </svg> */}
                    Unavailable
                  </button>
                )}
                <Link to="/rooms" className="btn btn-outline btn-full">
                  {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg> */}
                  Back to Rooms
                </Link>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="info-card">
              <div className="section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
                </svg>
                <h4>Additional Information</h4>
              </div>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Check-in Time</span>
                  <span className="info-value">2:00 PM</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Check-out Time</span>
                  <span className="info-value">11:00 AM</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cancellation</span>
                  <span className="info-value">Free until 24h</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Room Size</span>
                  <span className="info-value">25 m²</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Floor</span>
                  <span className="info-value">2nd Floor</span>
                </div>
                <div className="info-item">
                  <span className="info-label">View</span>
                  <span className="info-value">City View</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
