import { useState } from 'react';
import RoomCard from '../components/RoomCard';
import './Rooms.css';

const Rooms = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    availability: 'all'
  });

  // Sample room data
  const rooms = [
    {
      id: 1,
      name: "Cozy Dormitory",
      type: "Dormitory",
      price: 25,
      capacity: 6,
      amenities: ["WiFi", "Air Conditioning", "Shared Bathroom", "Locker", "Bedding"],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Black.png/250px-Black.png",
      description: "Perfect for budget travelers. Clean, comfortable beds in a shared dormitory setting.",
      available: true
    },
    {
      id: 2,
      name: "Private Single",
      type: "Private",
      price: 45,
      capacity: 1,
      amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Desk", "TV"],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Black.png/250px-Black.png",
      description: "Your own private space with all the comforts of home. Perfect for solo travelers.",
      available: true
    },
    {
      id: 3,
      name: "Family Suite",
      type: "Family",
      price: 85,
      capacity: 4,
      amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Kitchenette", "Sofa", "TV"],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Black.png/250px-Black.png",
      description: "Spacious suite perfect for families or groups. Includes kitchenette and living area.",
      available: false
    },
    {
      id: 4,
      name: "Deluxe Double",
      type: "Private",
      price: 65,
      capacity: 2,
      amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Mini Fridge", "TV", "Balcony"],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Black.png/250px-Black.png",
      description: "Comfortable double room with modern amenities and a private balcony.",
      available: true
    },
    {
      id: 5,
      name: "Budget Dormitory",
      type: "Dormitory",
      price: 20,
      capacity: 8,
      amenities: ["WiFi", "Shared Bathroom", "Locker", "Bedding"],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Black.png/250px-Black.png",
      description: "Basic dormitory accommodation for budget-conscious travelers.",
      available: true
    },
    {
      id: 6,
      name: "Executive Suite",
      type: "Family",
      price: 120,
      capacity: 6,
      amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Kitchen", "Living Room", "TV", "Balcony"],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Black.png/250px-Black.png",
      description: "Luxurious suite with separate living area, kitchen, and stunning city views.",
      available: true
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.type !== 'all' && room.type.toLowerCase() !== filters.type.toLowerCase()) {
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
          if (price > 30) return false;
          break;
        case 'mid':
          if (price < 30 || price > 70) return false;
          break;
        case 'luxury':
          if (price < 70) return false;
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
                className="form-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="dormitory">Dormitory</option>
                <option value="private">Private</option>
                <option value="family">Family</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <select 
                className="form-select"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget ($0-30)</option>
                <option value="mid">Mid-range ($30-70)</option>
                <option value="luxury">Luxury ($70+)</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Availability</label>
              <select 
                className="form-select"
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
            Showing {filteredRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
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
