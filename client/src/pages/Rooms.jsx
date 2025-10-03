import { useState, useEffect } from 'react';
import RoomRow from '../components/RoomRow';
import apiService from '../services/api';
import './Rooms.css';

const Rooms = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    availability: 'all'
  });
  
  const [rooms, setRooms] = useState([]);
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
          const roomsData = response.data.map(room => ({
            id: room.id,
            name: room.name,
            type: room.room_type,
            price: room.base_price,
            size: `${room.size_sqm}m²`,
            capacity: room.capacity,
            amenities: room.amenities_th || room.amenities, // Use Thai amenities if available
            image: room.main_image_url,
            description: room.description,
            available: room.is_available
          }));
          setRooms(roomsData);
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

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.type !== 'all' && room.type !== filters.type) {
      return false;
    }
    
    if (filters.availability !== 'all') {
      if (filters.availability === 'available' && !room.available) return false;
      if (filters.availability === 'unavailable' && room.available) return false;
    }
    
    if (filters.priceRange !== 'all') {
      const price = room.price;
      switch (filters.priceRange) {
        case 'budget':
          if (price > 300) return false;
          break;
        case 'mid':
          if (price < 300 || price > 500) return false;
          break;
        case 'luxury':
          if (price < 500) return false;
          break;
        default:
          break;
      }
    }
    
    return true;
  });

  return (
    <div className="rooms-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Our Rooms</h1>
          {/* <p className="page-subtitle">
            Choose from our variety of comfortable accommodations designed for every type of traveler
          </p> */}
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Room Type</label>
              <select 
                className="field-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Single Room">Single Room</option>
                <option value="Double Room">Double Room</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <select 
                className="field-select"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget (฿0-300)</option>
                <option value="mid">Mid-range (฿300-500)</option>
                <option value="luxury">Luxury (฿500+)</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Availability</label>
              <select 
                className="field-select"
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="all">All Rooms</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p className="results-count">
            {loading ? 'Loading...' : error ? 'Error loading rooms' : `Showing ${filteredRooms.length} of ${rooms.length} rooms`}
          </p>
        </div>

        {/* Rooms Grid */}
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
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomRow key={room.id} room={room} />
            ))
          ) : (
            <div className="no-results">
              <h3>No rooms found</h3>
              <p>Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
