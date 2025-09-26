import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);

  // Sample data
  const stats = {
    occupancy: 85,
    totalBookings: 156,
    revenue: 12450,
    profit: 8750
  };

  // Dynamic revenue data for different timeframes
  const revenueDataByTimeframe = {
    day: [
      { date: '00:00', value: 1200 },
      { date: '04:00', value: 800 },
      { date: '08:00', value: 1500 },
      { date: '12:00', value: 2200 },
      { date: '16:00', value: 2800 },
      { date: '20:00', value: 3200 },
      { date: '24:00', value: 1800 }
    ],
    week: [
      { date: 'Mon', value: 18500 },
      { date: 'Tue', value: 19200 },
      { date: 'Wed', value: 20100 },
      { date: 'Thu', value: 19800 },
      { date: 'Fri', value: 22500 },
      { date: 'Sat', value: 31200 },
      { date: 'Sun', value: 28900 }
    ],
    month: [
      { date: '1', value: 14500 },
      { date: '4', value: 14200 },
      { date: '7', value: 14800 },
      { date: '10', value: 15200 },
      { date: '13', value: 15800 },
      { date: '16', value: 16200 },
      { date: '19', value: 16800 },
      { date: '22', value: 17500 },
      { date: '25', value: 18200 },
      { date: '28', value: 18900 },
      { date: '31', value: 19500 }
    ],
    year: [
      { date: 'Jan', value: 185000 },
      { date: 'Feb', value: 192000 },
      { date: 'Mar', value: 201000 },
      { date: 'Apr', value: 198000 },
      { date: 'May', value: 225000 },
      { date: 'Jun', value: 312000 },
      { date: 'Jul', value: 289000 },
      { date: 'Aug', value: 275000 },
      { date: 'Sep', value: 298000 },
      { date: 'Oct', value: 315000 },
      { date: 'Nov', value: 285000 },
      { date: 'Dec', value: 320000 }
    ]
  };

  // Get current data based on selected timeframe
  const currentRevenueData = revenueDataByTimeframe[selectedTimeframe] || revenueDataByTimeframe.month;

  // Calculate dynamic Y-axis labels based on data range
  const getYAxisLabels = (data) => {
    const values = data.map(point => point.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const padding = range * 0.1; // 10% padding
    
    const adjustedMin = Math.max(0, minValue - padding);
    const adjustedMax = maxValue + padding;
    const adjustedRange = adjustedMax - adjustedMin;
    
    const step = adjustedRange / 4; // 4 intervals
    
    return [
      Math.round(adjustedMin),
      Math.round(adjustedMin + step),
      Math.round(adjustedMin + step * 2),
      Math.round(adjustedMin + step * 3),
      Math.round(adjustedMax)
    ];
  };

  const yAxisLabels = getYAxisLabels(currentRevenueData);
  const minValue = Math.min(...currentRevenueData.map(p => p.value));
  const maxValue = Math.max(...currentRevenueData.map(p => p.value));
  const valueRange = maxValue - minValue;

  const timeframes = ['day', 'week', 'month', 'year'];

  // Handle mouse movement for smooth tooltip following
  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Debounced hover handling to prevent flickering
  const handlePointHover = (point, x, y, index) => {
    setHoveredPoint({ ...point, x, y, index });
  };

  const handlePointLeave = () => {
    // Small delay to prevent flickering when moving between elements
    setTimeout(() => setHoveredPoint(null), 50);
  };

  const recentBookings = [
    { id: 1, guest: 'John Doe', room: 'Private Single', checkIn: '2024-01-15', status: 'Confirmed' },
    { id: 2, guest: 'Sarah Smith', room: 'Cozy Dormitory', checkIn: '2024-01-16', status: 'Pending' },
    { id: 3, guest: 'Mike Johnson', room: 'Family Suite', checkIn: '2024-01-17', status: 'Confirmed' },
    { id: 4, guest: 'Emma Brown', room: 'Deluxe Double', checkIn: '2024-01-18', status: 'Confirmed' }
  ];

  const rooms = [
    { id: 1, name: 'Cozy Dormitory', type: 'Dormitory', price: 25, status: 'Available' },
    { id: 2, name: 'Private Single', type: 'Private', price: 45, status: 'Occupied' },
    { id: 3, name: 'Family Suite', type: 'Family', price: 85, status: 'Maintenance' },
    { id: 4, name: 'Deluxe Double', type: 'Private', price: 65, status: 'Available' }
  ];

  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', bookings: 3 },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1234567891', bookings: 1 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892', bookings: 2 }
  ];

  // SVG Icons
  const OverviewIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );

  const RoomsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
  );

  const CustomersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const BookingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const ReportsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10"></path>
      <path d="M12 20V4"></path>
      <path d="M6 20v-6"></path>
    </svg>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: OverviewIcon },
    { id: 'rooms', label: 'Rooms', icon: RoomsIcon },
    { id: 'customers', label: 'Customers', icon: CustomersIcon },
    { id: 'bookings', label: 'Bookings', icon: BookingsIcon },
    { id: 'reports', label: 'Reports', icon: ReportsIcon }
  ];

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-occupancy">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.occupancy}%</h3>
            <p className="stat-label">Occupancy Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-bookings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalBookings}</h3>
            <p className="stat-label">Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">${stats.revenue.toLocaleString()}</h3>
            <p className="stat-label">Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-profit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10"></path>
              <path d="M12 20V4"></path>
              <path d="M6 20v-6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">${stats.profit.toLocaleString()}</h3>
            <p className="stat-label">Profit</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          {/* Chart Header */}
          <div className="chart-header">
            <div className="chart-title">
              <h3>Monthly Revenue</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="timeframe-selector">
              {timeframes.map(timeframe => (
                <button
                  key={timeframe}
                  className={`timeframe-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div 
            className="revenue-chart"
            ref={chartRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
            onMouseDown={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            style={{ 
              userSelect: 'none',
              WebkitUserDrag: 'none',
              touchAction: 'pan-y'
            }}
          >
            <svg 
              viewBox="0 0 1000 300" 
              className="chart-svg"
              preserveAspectRatio="xMidYMid meet"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: 'none', touchAction: 'pan-y' }}
            >
              {/* Grid Pattern */}
              <defs>
                <pattern id="grid" width="60" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 50" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="0.1"/>
                  <stop offset="100%" stopColor="#6b7280" stopOpacity="0.02"/>
                </linearGradient>
              </defs>
              
              {/* Grid Background */}
              <rect width="1000" height="300" fill="url(#grid)" />
              
              {/* Y-axis labels */}
              {yAxisLabels.map((label, index) => {
                const y = 50 + (index * 50);
                const displayValue = label >= 1000 ? `$${(label / 1000).toFixed(0)}k` : `$${label}`;
                return (
                  <text key={index} x="30" y={y} className="axis-label" textAnchor="end">
                    {displayValue}
                  </text>
                );
              })}
              
              {/* Chart Area Fill */}
              <path
                d={`M 60 ${250 - ((currentRevenueData[0].value - minValue) / valueRange) * 200} 
                   ${currentRevenueData.map((point, index) => {
                     const x = 60 + (index / (currentRevenueData.length - 1)) * 880;
                     const y = 250 - ((point.value - minValue) / valueRange) * 200;
                     return `L ${x} ${y}`;
                   }).join(' ')} 
                   L 940 250 L 60 250 Z`}
                fill="url(#areaGradient)"
              />
              
              {/* Chart Line */}
              <path
                d={`M 60 ${250 - ((currentRevenueData[0].value - minValue) / valueRange) * 200} 
                   ${currentRevenueData.map((point, index) => {
                     const x = 60 + (index / (currentRevenueData.length - 1)) * 880;
                     const y = 250 - ((point.value - minValue) / valueRange) * 200;
                     return `L ${x} ${y}`;
                   }).join(' ')}`}
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data Points - SEPARATED INTERACTION LAYERS */}
              {currentRevenueData.map((point, index) => {
                const x = 60 + (index / (currentRevenueData.length - 1)) * 880;
                const y = 250 - ((point.value - minValue) / valueRange) * 200;
                const isHovered = hoveredPoint?.index === index;
                
                return (
                  <g key={index}>
                    {/* VISUAL DOT - No interaction, not draggable */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#374151"
                      className={`data-point ${isHovered ? 'hovered' : ''}`}
                      style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                        WebkitUserDrag: 'none',
                        transformOrigin: `${x}px ${y}px`
                      }}
                    />
                    
                    {/* INVISIBLE HIT AREA - Only for interaction */}
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="transparent"
                      className="data-hit-area"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onMouseEnter={() => handlePointHover(point, x, y, index)}
                      onMouseLeave={handlePointLeave}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      style={{
                        cursor: 'pointer',
                        touchAction: 'none',
                        userSelect: 'none',
                        WebkitUserDrag: 'none'
                      }}
                    />
                  </g>
                );
              })}
              
              {/* X-axis labels */}
              {currentRevenueData.map((point, index) => {
                const x = 60 + (index / (currentRevenueData.length - 1)) * 880;
                return (
                  <text 
                    key={index} 
                    x={x} 
                    y="280" 
                    className="axis-label" 
                    textAnchor="middle"
                  >
                    {point.date}
                  </text>
                );
              })}
              
              {/* Hover line */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1="50"
                  x2={hoveredPoint.x}
                  y2="250"
                  stroke="#6b7280"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.6"
                />
              )}
            </svg>
            
            {/* Fixed Tooltip - Uses absolute positioning relative to chart container */}
            {hoveredPoint && (
              <div 
                className="chart-tooltip"
                style={{
                  left: Math.min(Math.max(mousePosition.x - 96, 10), (chartRef.current?.offsetWidth || 400) - 200),
                  top: Math.max(mousePosition.y - 100, 10),
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                  zIndex: 1000
                }}
              >
                <div className="tooltip-header">Revenue</div>
                <div className="tooltip-value">
                  ${hoveredPoint.value.toLocaleString()}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
                    <polyline points="17,6 23,6 23,12"></polyline>
                  </svg>
                </div>
                <div className="tooltip-comparison">vs Previous Period</div>
                <div className="tooltip-date">
                  {selectedTimeframe === 'day' && `Today ${hoveredPoint.date}`}
                  {selectedTimeframe === 'week' && `This Week - ${hoveredPoint.date}`}
                  {selectedTimeframe === 'month' && `Sep ${hoveredPoint.date}, 2024`}
                  {selectedTimeframe === 'year' && `${hoveredPoint.date} 2024`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Bookings</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.guest}</td>
                  <td>{booking.room}</td>
                  <td>{booking.checkIn}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status === 'Confirmed' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      )}
                      {booking.status === 'Pending' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                      )}
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Room Management</h2>
        <button className="btn btn-primary">Add New Room</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>${room.price}/night</td>
                <td>
                  <span className={`status-badge ${room.status.toLowerCase()}`}>
                    {room.status === 'Available' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    )}
                    {room.status === 'Occupied' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    )}
                    {room.status === 'Maintenance' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                      </svg>
                    )}
                    {room.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-accent">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Customer Management</h2>
        <button className="btn btn-primary">Add New Customer</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Bookings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.bookings}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-secondary">View</button>
                    <button className="btn btn-sm btn-accent">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Booking Management</h2>
        <button className="btn btn-primary">New Booking</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map(booking => (
              <tr key={booking.id}>
                <td>#{booking.id.toString().padStart(4, '0')}</td>
                <td>{booking.guest}</td>
                <td>{booking.room}</td>
                <td>{booking.checkIn}</td>
                <td>{new Date(new Date(booking.checkIn).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</td>
                <td>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status === 'Confirmed' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    )}
                    {booking.status === 'Pending' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                    )}
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-secondary">View</button>
                    <button className="btn btn-sm btn-accent">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Financial Reports</h2>
        <button className="btn btn-primary">Export Report</button>
      </div>
      <div className="reports-grid">
        <div className="report-card">
          <h3>Monthly Revenue</h3>
          <div className="report-chart">
            <div className="chart-bar" style={{ height: '70%' }}></div>
            <div className="chart-bar" style={{ height: '85%' }}></div>
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '95%' }}></div>
            <div className="chart-bar" style={{ height: '80%' }}></div>
            <div className="chart-bar" style={{ height: '100%' }}></div>
          </div>
        </div>
        <div className="report-card">
          <h3>Occupancy Rate</h3>
          <div className="occupancy-chart">
            <div className="occupancy-circle">
              <span className="occupancy-percentage">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <h1 className="mobile-title">Admin Dashboard</h1>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h2>Admin Dashboard</h2>
            <p>pppwtk</p>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                title={sidebarCollapsed ? tab.label : ''}
              >
                <span className="nav-icon">
                  <tab.icon />
                </span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="page-title">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            <div className="header-actions">
              <button className="btn btn-secondary">Export</button>
              <button className="btn btn-primary">Add New</button>
            </div>
          </div>

          <div className="dashboard-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'rooms' && renderRooms()}
            {activeTab === 'customers' && renderCustomers()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'reports' && renderReports()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
