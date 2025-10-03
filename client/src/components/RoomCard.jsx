import { Link } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({ room }) => {
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
    <div className="room-card">
      <div className="room-image">
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
      
      <div className="room-content">
        <div className="room-header">
          <h3 className="room-name">{name}</h3>
        </div>
        
        <p className="room-description">{description}</p>
        
        <div className="room-capacity">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10h-2l-.99-1.01A2.5 2.5 0 0 0 9 8H7.46c-.8 0-1.54.37-2.01.99L3 10.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z"/>
          </svg>
          <span>{capacity} {capacity === 1 ? 'Guest' : 'Guests'}</span>
        </div>
        
        <div className="room-amenities">
          {amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="amenity-tag more">
              +{amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="room-actions">
          <Link 
            to={`/rooms/${id}`} 
            className="btn btn-secondary"
          >
            View Details
          </Link>
          <Link 
            to={`/booking?room=${id}`} 
            className={`btn btn-primary ${!available ? 'disabled' : ''}`}
            style={{ pointerEvents: !available ? 'none' : 'auto' }}
          >
            {available ? 'Book Now' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
