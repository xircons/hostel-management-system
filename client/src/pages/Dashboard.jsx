import React, { useState, useRef, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import Chart from '../components/dashboard/Chart';
import DateRangeFilter from '../components/dashboard/DateRangeFilter';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import DataTable from '../components/dashboard/DataTable';
import Modal from '../components/dashboard/Modal';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    range: 'month'
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Booking Received',
      message: 'John Doe booked Private Single room for 3 nights',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      priority: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Low Occupancy Alert',
      message: 'Occupancy rate dropped below 70% for today',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      priority: 'warning',
      read: false
    },
    {
      id: 3,
      title: 'Payment Issue',
      message: 'Failed payment for booking #1234 - requires attention',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: 'urgent',
      read: false
    },
    {
      id: 4,
      title: 'Maintenance Completed',
      message: 'Room 205 maintenance completed and ready for guests',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'info',
      read: true
    }
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Enhanced sample data with financial metrics
  const financialData = {
    monthly: {
    revenue: 12450,
      expenses: 3700,
      profit: 8750,
      occupancy: 85,
      bookings: 156,
      avgRevenuePerBooking: 79.8
    },
    quarterly: {
      revenue: 37850,
      expenses: 11100,
      profit: 26750,
      occupancy: 82,
      bookings: 468,
      avgRevenuePerBooking: 80.9
    },
    yearly: {
      revenue: 152400,
      expenses: 44400,
      profit: 108000,
      occupancy: 78,
      bookings: 1872,
      avgRevenuePerBooking: 81.4
    }
  };

  const currentFinancials = financialData[selectedTimeframe] || financialData.monthly;

  // Revenue data for charts
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

  // Income vs Expense data
  const incomeExpenseData = {
    monthly: [
      { category: 'Room Revenue', income: 12450, expenses: 0 },
      { category: 'Food & Beverage', income: 3200, expenses: 1800 },
      { category: 'Amenities', income: 850, expenses: 200 },
      { category: 'Other Services', income: 400, expenses: 150 }
    ],
    quarterly: [
      { category: 'Room Revenue', income: 37850, expenses: 0 },
      { category: 'Food & Beverage', income: 9600, expenses: 5400 },
      { category: 'Amenities', income: 2550, expenses: 600 },
      { category: 'Other Services', income: 1200, expenses: 450 }
    ],
    yearly: [
      { category: 'Room Revenue', income: 152400, expenses: 0 },
      { category: 'Food & Beverage', income: 38400, expenses: 21600 },
      { category: 'Amenities', income: 10200, expenses: 2400 },
      { category: 'Other Services', income: 4800, expenses: 1800 }
    ]
  };

  // Separate expense data for expense charts
  const expenseData = {
    monthly: [
      { category: 'Food & Beverage', amount: 1800 },
      { category: 'Amenities', amount: 200 },
      { category: 'Other Services', amount: 150 },
      { category: 'Operating Costs', amount: 1550 }
    ],
    quarterly: [
      { category: 'Food & Beverage', amount: 5400 },
      { category: 'Amenities', amount: 600 },
      { category: 'Other Services', amount: 450 },
      { category: 'Operating Costs', amount: 4650 }
    ],
    yearly: [
      { category: 'Food & Beverage', amount: 21600 },
      { category: 'Amenities', amount: 2400 },
      { category: 'Other Services', amount: 1800 },
      { category: 'Operating Costs', amount: 18600 }
    ]
  };

  const currentRevenueData = revenueDataByTimeframe[selectedTimeframe] || revenueDataByTimeframe.month;
  const currentIncomeExpenseData = incomeExpenseData[selectedTimeframe] || incomeExpenseData.monthly;

  // Enhanced booking data
  const recentBookings = [
    { 
      id: 1, 
      guest: 'John Doe', 
      room: 'Private Single', 
      checkIn: '2024-01-15', 
      checkOut: '2024-01-18',
      status: 'Confirmed',
      amount: 135,
      paymentStatus: 'Paid',
      source: 'Website'
    },
    { 
      id: 2, 
      guest: 'Sarah Smith', 
      room: 'Cozy Dormitory', 
      checkIn: '2024-01-16', 
      checkOut: '2024-01-19',
      status: 'Pending',
      amount: 75,
      paymentStatus: 'Pending',
      source: 'Phone'
    },
    { 
      id: 3, 
      guest: 'Mike Johnson', 
      room: 'Family Suite', 
      checkIn: '2024-01-17', 
      checkOut: '2024-01-20',
      status: 'Confirmed',
      amount: 255,
      paymentStatus: 'Paid',
      source: 'Website'
    },
    { 
      id: 4, 
      guest: 'Emma Brown', 
      room: 'Deluxe Double', 
      checkIn: '2024-01-18', 
      checkOut: '2024-01-21',
      status: 'Confirmed',
      amount: 195,
      paymentStatus: 'Paid',
      source: 'Booking.com'
    }
  ];

  const rooms = [
    { id: 1, name: 'Cozy Dormitory', type: 'Dormitory', price: 25, status: 'Available', capacity: 6, amenities: ['WiFi', 'Shared Bathroom'] },
    { id: 2, name: 'Private Single', type: 'Private', price: 45, status: 'Occupied', capacity: 1, amenities: ['WiFi', 'Private Bathroom', 'AC'] },
    { id: 3, name: 'Family Suite', type: 'Family', price: 85, status: 'Maintenance', capacity: 4, amenities: ['WiFi', 'Private Bathroom', 'AC', 'Kitchenette'] },
    { id: 4, name: 'Deluxe Double', type: 'Private', price: 65, status: 'Available', capacity: 2, amenities: ['WiFi', 'Private Bathroom', 'AC', 'Balcony'] }
  ];

  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', bookings: 3, totalSpent: 405, lastVisit: '2024-01-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1234567891', bookings: 1, totalSpent: 75, lastVisit: '2024-01-16' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892', bookings: 2, totalSpent: 510, lastVisit: '2024-01-17' }
  ];

  // Icon components
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

  const RevenueIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  const ProfitIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
      <polyline points="17,6 23,6 23,12"></polyline>
    </svg>
  );

  const ExpenseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1,18 10.5,8.5 15.5,13.5 23,6"></polyline>
      <polyline points="7,18 1,18 1,12"></polyline>
    </svg>
  );

  const OccupancyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: OverviewIcon },
    { id: 'rooms', label: 'Rooms', icon: RoomsIcon },
    { id: 'customers', label: 'Customers', icon: CustomersIcon },
    { id: 'bookings', label: 'Bookings', icon: BookingsIcon },
    { id: 'reports', label: 'Reports', icon: ReportsIcon }
  ];

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    // In a real app, this would trigger API calls to fetch new data
    console.log('Date range changed:', newRange);
  };

  const handleNotificationMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleNotificationClearAll = () => {
    setNotifications([]);
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setSelectedItem(null);
  };

  const handleRowClick = (item) => {
    openModal('view', item);
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      {/* Timeframe Selector */}
      <div className="timeframe-selector-container">
            <div className="timeframe-selector">
          {['month', 'quarter', 'year'].map(timeframe => (
                <button
                  key={timeframe}
                  className={`timeframe-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
        <DateRangeFilter 
          onDateChange={handleDateRangeChange}
          selectedRange={dateRange.range}
        />
          </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <StatCard
          title="Occupancy Rate"
          value={currentFinancials.occupancy}
          change={5.2}
          changeType="increase"
          icon={OccupancyIcon}
          color="primary"
          format="percentage"
          subtitle={`${currentFinancials.bookings} bookings`}
        />
        <StatCard
          title="Total Revenue"
          value={currentFinancials.revenue}
          change={12.5}
          changeType="increase"
          icon={RevenueIcon}
          color="success"
          format="currency"
          subtitle={`$${currentFinancials.avgRevenuePerBooking.toFixed(1)} avg per booking`}
        />
        <StatCard
          title="Total Expenses"
          value={currentFinancials.expenses}
          change={-2.1}
          changeType="decrease"
          icon={ExpenseIcon}
          color="warning"
          format="currency"
          subtitle="Operating costs"
        />
        <StatCard
          title="Net Profit"
          value={currentFinancials.profit}
          change={18.7}
          changeType="increase"
          icon={ProfitIcon}
          color="info"
          format="currency"
          subtitle={`${((currentFinancials.profit / currentFinancials.revenue) * 100).toFixed(1)}% margin`}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          <div className="chart-card chart-large">
            <Chart
              title="Revenue Trend"
              data={currentRevenueData}
              type="line"
              height={300}
            />
          </div>
          
          <div className="chart-card chart-large">
            <Chart
              title="Income vs Expenses"
              data={currentIncomeExpenseData.map(item => ({
                date: item.category,
                value: item.income - item.expenses
              }))}
              type="bar"
              height={300}
            />
          </div>
          
          <div className="chart-card chart-medium">
            <Chart
              title="Revenue Distribution"
              data={currentIncomeExpenseData
                .filter(item => item.income > 0)
                .map(item => ({
                  date: item.category,
                  value: item.income
                }))}
              type="pie"
              height={300}
            />
          </div>
          
          <div className="chart-card chart-medium">
            <div className="recent-activity-card">
              <h3>Recent Bookings</h3>
              <div className="activity-list">
                {recentBookings.slice(0, 4).map(booking => (
                  <div key={booking.id} className="activity-item">
                    <div className="activity-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                    <div className="activity-content">
                      <div className="activity-title">{booking.guest}</div>
                      <div className="activity-subtitle">{booking.room} • ${booking.amount}</div>
                      <div className="activity-time">{booking.checkIn} - {booking.checkOut}</div>
                </div>
                    <div className={`activity-status status-${booking.status.toLowerCase()}`}>
                      {booking.status}
              </div>
          </div>
                ))}
        </div>
              <button className="view-all-button">View All Bookings</button>
      </div>
          </div>
        </div>
      </div>
    </div>
  );

  const roomColumns = [
    {
      key: 'name',
      label: 'Room Name',
      render: (value, row) => (
        <div className="room-info">
          <div className="room-name">{row.name}</div>
          <div className="room-amenities">
            {row.amenities.slice(0, 2).join(', ')}
            {row.amenities.length > 2 && ` +${row.amenities.length - 2} more`}
      </div>
        </div>
      )
    },
    { key: 'type', label: 'Type' },
    { 
      key: 'price', 
      label: 'Price',
      render: (value) => `$${value}/night`
    },
    { 
      key: 'capacity', 
      label: 'Capacity',
      render: (value) => `${value} guests`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase()}`}>
          {value === 'Available' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    )}
          {value === 'Occupied' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    )}
          {value === 'Maintenance' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                      </svg>
                    )}
          {value}
                  </span>
      )
    }
  ];

  const renderRooms = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Room Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => openModal('add-room')}
        >
          Add New Room
        </button>
                  </div>
      <DataTable
        data={rooms}
        columns={roomColumns}
        onRowClick={handleRowClick}
        sortable={true}
        filterable={true}
        searchable={true}
        pagination={true}
        pageSize={5}
      />
    </div>
  );

  const customerColumns = [
    { key: 'name', label: 'Name' },
    {
      key: 'email',
      label: 'Contact',
      render: (value, row) => (
        <div className="contact-info">
          <div>{row.email}</div>
          <div className="contact-phone">{row.phone}</div>
        </div>
      )
    },
    { key: 'bookings', label: 'Bookings' },
    { 
      key: 'totalSpent', 
      label: 'Total Spent',
      render: (value) => `$${value}`
    },
    { key: 'lastVisit', label: 'Last Visit' }
  ];

  const renderCustomers = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Customer Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => openModal('add-customer')}
        >
          Add New Customer
        </button>
      </div>
      <DataTable
        data={customers}
        columns={customerColumns}
        onRowClick={handleRowClick}
        sortable={true}
        filterable={true}
        searchable={true}
        pagination={true}
        pageSize={5}
      />
    </div>
  );

  const bookingColumns = [
    { 
      key: 'id', 
      label: 'Booking ID',
      render: (value) => `#${value.toString().padStart(4, '0')}`
    },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'checkIn', label: 'Check-in' },
    { key: 'checkOut', label: 'Check-out' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value) => `$${value}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase()}`}>
          {value === 'Confirmed' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    )}
          {value === 'Pending' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    )}
          {value}
                  </span>
      )
    }
  ];

  const renderBookings = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Booking Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary">Export</button>
          <button 
            className="btn btn-primary"
            onClick={() => openModal('add-booking')}
          >
            New Booking
          </button>
                  </div>
      </div>
      <DataTable
        data={recentBookings}
        columns={bookingColumns}
        onRowClick={handleRowClick}
        sortable={true}
        filterable={true}
        searchable={true}
        pagination={true}
        pageSize={5}
      />
    </div>
  );

  const renderReports = () => (
    <div className="dashboard-section">
      <div className="section-actions-row">
        <h2>Reports & Analytics</h2>
        <div className="header-actions">
          <button className="btn btn-secondary">Export Report</button>
          <button className="btn btn-primary">Generate Report</button>
      </div>
      </div>
      
      <div className="reports-grid">
        <div className="report-card">
          <h3>Monthly Performance</h3>
          <div className="performance-metrics">
            <div className="metric">
              <span className="metric-label">Revenue Growth</span>
              <span className="metric-value positive">+12.5%</span>
          </div>
            <div className="metric">
              <span className="metric-label">Occupancy Rate</span>
              <span className="metric-value">85%</span>
        </div>
            <div className="metric">
              <span className="metric-label">Customer Satisfaction</span>
              <span className="metric-value positive">4.8/5</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h3>Revenue Breakdown</h3>
          <Chart
            data={currentIncomeExpenseData
              .filter(item => item.income > 0)
              .map(item => ({
                date: item.category,
                value: item.income
              }))}
            type="pie"
            height={200}
          />
            </div>

        <div className="report-card">
          <h3>Occupancy Trend</h3>
          <Chart
            data={currentRevenueData}
            type="line"
            height={200}
          />
          </div>

        <div className="report-card">
          <h3>Top Revenue Sources</h3>
          <div className="revenue-sources">
            {currentIncomeExpenseData
              .filter(item => item.income > 0)
              .sort((a, b) => b.income - a.income)
              .map((source, index) => (
                <div key={source.category} className="revenue-source">
                  <div className="source-rank">#{index + 1}</div>
                  <div className="source-info">
                    <div className="source-name">{source.category}</div>
                    <div className="source-amount">${source.income.toLocaleString()}</div>
                  </div>
                  <div className="source-percentage">
                    {((source.income / currentFinancials.revenue) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <p>Hostel Management</p>
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
              <NotificationsPanel 
                notifications={notifications}
                onMarkAsRead={handleNotificationMarkAsRead}
                onClearAll={handleNotificationClearAll}
              />
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalType === 'view' ? `View ${selectedItem?.name || 'Item'}` : 
               modalType === 'add-room' ? 'Add New Room' :
               modalType === 'add-customer' ? 'Add New Customer' :
               modalType === 'add-booking' ? 'Add New Booking' : 'Modal'}
        size="medium"
      >
        {modalType === 'view' && selectedItem && (
          <div className="modal-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <div className="form-input">{selectedItem.name}</div>
            </div>
            {selectedItem.type && (
              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="form-input">{selectedItem.type}</div>
              </div>
            )}
            {selectedItem.price && (
              <div className="form-group">
                <label className="form-label">Price</label>
                <div className="form-input">${selectedItem.price}/night</div>
              </div>
            )}
            {selectedItem.email && (
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="form-input">{selectedItem.email}</div>
              </div>
            )}
            {selectedItem.phone && (
              <div className="form-group">
                <label className="form-label">Phone</label>
                <div className="form-input">{selectedItem.phone}</div>
              </div>
            )}
            <div className="form-actions">
              <button className="modal-btn modal-btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button className="modal-btn modal-btn-primary">
                Edit
              </button>
            </div>
          </div>
        )}

        {modalType === 'add-room' && (
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Room Name</label>
                <input type="text" className="form-input" placeholder="Enter room name" />
              </div>
              <div className="form-group">
                <label className="form-label">Room Type</label>
                <select className="form-select">
                  <option value="">Select type</option>
                  <option value="Private">Private</option>
                  <option value="Dormitory">Dormitory</option>
                  <option value="Family">Family</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price per Night</label>
                <input type="number" className="form-input" placeholder="Enter price" />
              </div>
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input type="number" className="form-input" placeholder="Enter capacity" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amenities</label>
              <textarea className="form-input form-textarea" placeholder="Enter amenities (comma separated)"></textarea>
            </div>
            <div className="form-actions">
              <button className="modal-btn modal-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-primary">
                Add Room
              </button>
            </div>
          </div>
        )}

        {modalType === 'add-customer' && (
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="Enter email" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="Enter phone number" />
            </div>
            <div className="form-actions">
              <button className="modal-btn modal-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-primary">
                Add Customer
              </button>
            </div>
          </div>
        )}

        {modalType === 'add-booking' && (
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Guest Name</label>
                <input type="text" className="form-input" placeholder="Enter guest name" />
              </div>
              <div className="form-group">
                <label className="form-label">Room</label>
                <select className="form-select">
                  <option value="">Select room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Check-in Date</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out Date</label>
                <input type="date" className="form-input" />
              </div>
            </div>
            <div className="form-actions">
              <button className="modal-btn modal-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-primary">
                Create Booking
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;