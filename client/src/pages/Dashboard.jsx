import { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const stats = {
    occupancy: 85,
    totalBookings: 156,
    revenue: 12450,
    profit: 8750
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'rooms', label: 'Rooms', icon: '🏠' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'reports', label: 'Reports', icon: '📈' }
  ];

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.occupancy}%</h3>
            <p className="stat-label">Occupancy Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalBookings}</h3>
            <p className="stat-label">Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-value">${stats.revenue.toLocaleString()}</h3>
            <p className="stat-label">Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3 className="stat-value">${stats.profit.toLocaleString()}</h3>
            <p className="stat-label">Profit</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <div className="simple-chart">
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '80%' }}></div>
            <div className="chart-bar" style={{ height: '45%' }}></div>
            <div className="chart-bar" style={{ height: '90%' }}></div>
            <div className="chart-bar" style={{ height: '75%' }}></div>
            <div className="chart-bar" style={{ height: '100%' }}></div>
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
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2>Admin Dashboard</h2>
            <p>pppwtk</p>
          </div>
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
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
