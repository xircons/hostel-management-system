
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import './Home.css';

const Home = () => {
  // Sample room data
  const featuredRooms = [
    {
      id: 1,
      name: "Standard King Bed Room",
      type: "Private",
      price: 531,
      capacity: 2,
      amenities: ["เครื่องปรับอากาศ", "ปลั๊กใกล้เตียง", "พื้นกระเบื้อง/หินอ่อน", "โต๊ะทำงาน", "มุ้ง", "พัดลม", "เครื่องอบผ้า", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "ราวแขวนเสื้อผ้า"],
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276200.jpg?k=23e9769ddc55635cebd1c6b315734f46f9fe6e73c2bdf145e162b10659171f51&o=",
      description: "Comfortable private room with king-size bed, air conditioning, and shared bathroom facilities. Located on upper floor with stair access only.",
      available: true
    },
    {
      id: 2,
      name: "Female Dormitory 4-Bed",
      type: "Dormitory",
      price: 216,
      capacity: 4,
      amenities: ["ชุดผ้าสำหรับห้องพัก", "พัดลม", "เครื่องอบผ้า", "พื้นกระเบื้อง/หินอ่อน", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "มุ้ง", "ปลั๊กใกล้เตียง", "เครื่องปรับอากาศ"],
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276533.jpg?k=652f3d9b297cabc399e4e20bbf879430eb3d294fc5c544ff8bdf0090cbbf2798&o=",
      description: "Comfortable female-only dormitory with 4 beds, air conditioning, and shared bathroom facilities.",
      available: true
    },
    {
      id: 3,
      name: "Mixed Dormitory 4-Bed",
      type: "Dormitory",
      price: 216,
      capacity: 4,
      amenities: ["ชุดผ้าสำหรับห้องพัก", "พัดลม", "เครื่องอบผ้า", "พื้นกระเบื้อง/หินอ่อน", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "มุ้ง", "ปลั๊กใกล้เตียง", "เครื่องปรับอากาศ"],
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276494.jpg?k=fa258523250cc272021978eca8489404a422b425991d2aee3e3cd5bcd2fb71ac&o=",
      description: "Comfortable mixed dormitory with 4 beds, air conditioning, and shared bathroom facilities.",
      available: true
    }
  ];

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

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "Amazing stay! The staff was incredibly friendly and the location was perfect for exploring the city.",
      rating: 5
    },
    {
      name: "Marco Silva",
      location: "São Paulo, Brazil",
      text: "Clean, comfortable, and affordable. Exactly what I needed for my backpacking trip.",
      rating: 5
    },
    {
      name: "Emma Chen",
      location: "Melbourne, Australia",
      text: "Great atmosphere and wonderful people. Made lifelong friends during my stay here.",
      rating: 5
    }
  ];

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
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className="section-actions">
            <Link to="/rooms" className="btn btn-primary btn-lg">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Guests Say</h2>
          {/* <p className="section-subtitle">
            Real experiences from travelers who stayed with us
          </p> */}
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="star" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#fbbf24" strokeWidth="1.5" fill="#fbbf24"/>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-location">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
