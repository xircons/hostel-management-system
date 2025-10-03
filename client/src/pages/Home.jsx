
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import Testimonials from '../components/Testimonials';
import apiService from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await apiService.getRooms();
        if (response.success) {
          // Transform database data to match component expectations
          const rooms = response.data.map(room => ({
            id: room.id,
            name: room.name,
            type: room.room_type,
            price: room.base_price,
            capacity: room.capacity,
            amenities: room.amenities_th || room.amenities, // Use Thai amenities if available
            image: room.main_image_url,
            description: room.description,
            available: room.is_available
          }));
          setFeaturedRooms(rooms);
        } else {
          setError('Failed to load rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const features = [
    { icon: 'home', title: 'Cozy Accommodation', description: "Comfortable beds and clean rooms designed for a good night's sleep" },
    { icon: 'wifi', title: 'Free WiFi', description: 'High-speed internet throughout the hostel for work and entertainment' },
    { icon: 'shuttle', title: 'Airport Transfer', description: 'Convenient pickup and drop-off service to and from the airport' },
    { icon: 'map', title: 'Tour Booking', description: 'Local tours and activities organized by our friendly staff' },
    { icon: 'kitchen', title: 'Common Kitchen', description: 'Fully equipped kitchen for preparing your own meals' },
    { icon: 'people', title: 'Social Events', description: 'Regular events and activities to meet fellow travelers' }
  ];

  const renderIcon = (name) => {
    switch (name) {
      case 'home':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        );
      case 'wifi':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M2 8.5A16 16 0 0 1 22 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4.5 12A12 12 0 0 1 19.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7.5 15.5A8 8 0 0 1 16.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        );
      case 'shuttle':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="3" y="6" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" fill="currentColor"/>
            <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case 'map':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M9 20l-5-2V4l5 2 6-2 5 2v14l-5-2-6 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="2" fill="currentColor"/>
          </svg>
        );
      case 'kitchen':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6 3v8M10 3v8M8 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="14" y="3" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 21v-6h4v6" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case 'people':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home">
      {/* Full-viewport Hero Image */}
      <div className="hero-image-full">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276499.jpg?k=028c95e3277601bfcf97c6a706528efa197505b5b46b7ddf3baf1313fca7913a&o="
          alt="pppwtk"
        />
      </div>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          {/* <h2 className="section-title">Why Choose pppwtk?</h2>
          <p className="section-subtitle">
            We provide everything you need for a comfortable and memorable stay
          </p> */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" aria-hidden>{renderIcon(feature.icon)}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="featured-rooms">
        <div className="container">
          <h2 className="section-title">Featured Rooms</h2>
          {/* <p className="section-subtitle">
            Choose from our variety of comfortable accommodations
          </p> */}
          <div className="rooms-grid">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading rooms...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>❌ {error} | Status: Backend API not responding</p>
              </div>
            ) : (
              featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            )}
          </div>
          <div className="section-actions">
            <Link to="/rooms" className="btn btn-primary btn-lg">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

    </div>
  );
};

export default Home;
