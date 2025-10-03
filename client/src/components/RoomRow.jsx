import { Link } from 'react-router-dom';
import './RoomRow.css';

const RoomRow = ({ room, onSelect, isSelected = false, showSelectButton = false }) => {
  const {
    id,
    name,
    type,
    price,
    capacity,
    amenities,
    image,
    description,
    available
  } = room;

  return (
    <div className={`room-row ${isSelected ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}>
      <div className="room-row-image">
        <img src={image} alt={name} />
        {!available && (
          <div className="room-status unavailable">
            <span>Unavailable</span>
          </div>
        )}
        <div className="room-type-badge">
          <span>{type}</span>
        </div>
      </div>
      
      <div className="room-row-content">
        <div className="room-row-header">
          <h3 className="room-name">{name}</h3>
        </div>
        
        <p className="room-description">{description}</p>
        
        <div className="room-row-details">
          <div className="room-capacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10h-2l-.99-1.01A2.5 2.5 0 0 0 9 8H7.46c-.8 0-1.54.37-2.01.99L3 10.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z"/>
            </svg>
            <span>{capacity} {capacity === 1 ? 'Guest' : 'Guests'}</span>
          </div>
          
          <div className="room-features">
            {amenities.includes('Air Conditioning') && (
              <div className="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Air Conditioning</span>
              </div>
            )}
            {amenities.some(amenity => amenity.toLowerCase().includes('wifi')) && (
              <div className="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 20h.01" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Free WiFi</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="room-amenities">
          {amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
            </span>
          ))}
          {amenities.length > 4 && (
            <span className="amenity-tag more">
              +{amenities.length - 4} more
            </span>
          )}
        </div>
        
        <div className="room-row-actions">
          <Link 
            to={`/rooms/${id}`} 
            className="btn btn-secondary"
          >
            View Details
          </Link>
          {showSelectButton ? (
            <button 
              className={`btn btn-primary ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect && onSelect(room)}
              disabled={!available}
            >
              {isSelected ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Selected
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Select Room
                </>
              )}
            </button>
          ) : (
            <Link 
              to={`/booking?room=${id}`} 
              className={`btn btn-primary ${!available ? 'disabled' : ''}`}
              style={{ pointerEvents: !available ? 'none' : 'auto' }}
            >
              {available ? 'Book Now' : 'Unavailable'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomRow;
