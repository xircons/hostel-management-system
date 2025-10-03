import { useState, useEffect } from 'react';
import apiService from '../services/api';

const Testimonials = ({ limit = 3, showAll = false, random = true }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        let response;
        
        if (showAll) {
          response = await apiService.getTestimonials();
        } else if (random) {
          response = await apiService.getRandomTestimonials();
        } else {
          response = await apiService.getFeaturedTestimonials();
        }
        
        if (response.success) {
          const limitedTestimonials = limit ? response.data.slice(0, limit) : response.data;
          setTestimonials(limitedTestimonials);
        } else {
          setError('Failed to load testimonials');
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [limit, showAll, random]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} className="star" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path 
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
            stroke="#fbbf24" 
            strokeWidth="1.5" 
            fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
          />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="testimonials">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonials">
        <div className="container">
          <div className="error-state">
            <p>❌ {error} | Status: Backend API not responding</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">What Our Guests Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {renderStars(testimonial.overall_rating)}
              </div>
              <p className="testimonial-text">"{testimonial.comment}"</p>
              <div className="testimonial-author">
                <h4 className="author-name">{testimonial.customer_name}</h4>
                <p className="author-location">{testimonial.customer_nationality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
