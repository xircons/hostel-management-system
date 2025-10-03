import { useState } from 'react';
import RoomRow from '../components/RoomRow';
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
      name: "Standard King Bed Room",
      type: "Private",
      price: 531,
      size: "15m²",
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
      size: "15m²",
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
      size: "15m²",
      capacity: 4,
      amenities: ["ชุดผ้าสำหรับห้องพัก", "พัดลม", "เครื่องอบผ้า", "พื้นกระเบื้อง/หินอ่อน", "ห้องพักอยู่ชั้นบน เข้าถึงได้ด้วยบันไดเท่านั้น", "มุ้ง", "ปลั๊กใกล้เตียง", "เครื่องปรับอากาศ"],
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/274276494.jpg?k=fa258523250cc272021978eca8489404a422b425991d2aee3e3cd5bcd2fb71ac&o=",
      description: "Comfortable mixed dormitory with 4 beds, air conditioning, and shared bathroom facilities.",
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
                <option value="dormitory">Dormitory</option>
                <option value="private">Private</option>
                <option value="family">Family</option>
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
            Showing {filteredRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
          {filteredRooms.length > 0 ? (
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
