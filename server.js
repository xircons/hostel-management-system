const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'hostel123456',
  database: process.env.DB_NAME || 'hostel_management',
  charset: 'utf8mb4'
};

let db;

// Initialize database connection
async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// =====================================================
// ROOM API ENDPOINTS
// =====================================================

// Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        r.id,
        r.name,
        r.name_th,
        r.room_number,
        r.floor_number,
        rt.name as room_type,
        rt.name_th as room_type_th,
        r.base_price,
        r.capacity,
        r.max_capacity,
        r.size_sqm,
        r.description,
        r.description_th,
        r.detailed_description,
        r.detailed_description_th,
        r.main_image_url,
        r.images,
        r.amenities,
        r.amenities_th,
        r.is_available,
        r.status,
        r.has_air_conditioning,
        r.has_wifi,
        r.has_private_bathroom,
        r.has_shared_bathroom,
        r.has_desk,
        r.bed_type,
        r.bed_count,
        r.weekend_price,
        r.holiday_price,
        r.requires_stairs
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.is_available = true
      ORDER BY r.floor_number, r.room_number
    `);
    
    // Parse JSON fields
    const rooms = rows.map(room => ({
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]'),
      amenities_th: JSON.parse(room.amenities_th || '[]')
    }));
    
    res.json({
      success: true,
      data: rooms,
      count: rooms.length
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
      error: error.message
    });
  }
});

// Get room by ID
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    
    const [rows] = await db.execute(`
      SELECT 
        r.id,
        r.name,
        r.name_th,
        r.room_number,
        r.floor_number,
        rt.name as room_type,
        rt.name_th as room_type_th,
        r.base_price,
        r.capacity,
        r.max_capacity,
        r.size_sqm,
        r.description,
        r.description_th,
        r.detailed_description,
        r.detailed_description_th,
        r.main_image_url,
        r.images,
        r.amenities,
        r.amenities_th,
        r.is_available,
        r.status,
        r.has_air_conditioning,
        r.has_wifi,
        r.has_private_bathroom,
        r.has_shared_bathroom,
        r.has_desk,
        r.bed_type,
        r.bed_count,
        r.weekend_price,
        r.holiday_price,
        r.requires_stairs
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = ? AND r.is_available = true
    `, [roomId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    const room = rows[0];
    room.images = JSON.parse(room.images || '[]');
    room.amenities = JSON.parse(room.amenities || '[]');
    room.amenities_th = JSON.parse(room.amenities_th || '[]');
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room',
      error: error.message
    });
  }
});

// Get room types
app.get('/api/room-types', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        name,
        name_th,
        description,
        description_th,
        base_capacity,
        max_capacity,
        base_price
      FROM room_types
      ORDER BY sort_order, name
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room types',
      error: error.message
    });
  }
});

// Check room availability
app.post('/api/rooms/availability', async (req, res) => {
  try {
    const { room_id, check_in_date, check_out_date } = req.body;
    
    if (!room_id || !check_in_date || !check_out_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: room_id, check_in_date, check_out_date'
      });
    }
    
    // Check for conflicting bookings
    const [conflicts] = await db.execute(`
      SELECT COUNT(*) as conflict_count
      FROM bookings b
      JOIN booking_statuses bs ON b.status_id = bs.id
      WHERE b.room_id = ? 
        AND bs.name IN ('Confirmed', 'Checked In')
        AND (
          (b.check_in_date <= ? AND b.check_out_date > ?) OR
          (b.check_in_date < ? AND b.check_out_date >= ?) OR
          (b.check_in_date >= ? AND b.check_out_date <= ?)
        )
    `, [room_id, check_out_date, check_in_date, check_out_date, check_in_date, check_in_date, check_out_date]);
    
    const isAvailable = conflicts[0].conflict_count === 0;
    
    res.json({
      success: true,
      data: {
        room_id,
        check_in_date,
        check_out_date,
        available: isAvailable
      }
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check room availability',
      error: error.message
    });
  }
});

// =====================================================
// BOOKING API ENDPOINTS
// =====================================================

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      guest_first_name,
      guest_last_name,
      guest_email,
      guest_phone,
      guest_nationality,
      room_id,
      check_in_date,
      check_out_date,
      guests_count,
      special_requests
    } = req.body;
    
    // Validate required fields
    if (!guest_first_name || !guest_last_name || !guest_email || !room_id || !check_in_date || !check_out_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Get room price
    const [roomRows] = await db.execute('SELECT base_price FROM rooms WHERE id = ?', [room_id]);
    if (roomRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    const roomPrice = roomRows[0].base_price;
    const checkInDate = new Date(check_in_date);
    const checkOutDate = new Date(check_out_date);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = roomPrice * nights;
    
    // Generate booking reference
    const bookingReference = 'BK' + Date.now().toString().slice(-6);
    
    // Insert booking
    const [result] = await db.execute(`
      INSERT INTO bookings (
        booking_reference,
        guest_first_name,
        guest_last_name,
        guest_email,
        guest_phone,
        guest_nationality,
        room_id,
        check_in_date,
        check_out_date,
        nights,
        guests_count,
        room_price,
        total_amount,
        final_amount,
        status_id,
        special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `, [
      bookingReference,
      guest_first_name,
      guest_last_name,
      guest_email,
      guest_phone,
      guest_nationality,
      room_id,
      check_in_date,
      check_out_date,
      nights,
      guests_count || 1,
      roomPrice,
      totalAmount,
      totalAmount,
      special_requests
    ]);
    
    res.json({
      success: true,
      data: {
        booking_id: result.insertId,
        booking_reference: bookingReference,
        total_amount: totalAmount,
        nights: nights
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// =====================================================
// USER API ENDPOINTS
// =====================================================

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [rows] = await db.execute(`
      SELECT 
        id,
        username,
        email,
        first_name,
        last_name,
        phone,
        nationality,
        role,
        created_at
      FROM users
      WHERE id = ?
    `, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// =====================================================
// SYSTEM SETTINGS API ENDPOINTS
// =====================================================

// Get system settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        setting_key,
        setting_value,
        setting_value_th,
        description,
        description_th,
        data_type,
        category
      FROM system_settings
      ORDER BY category, setting_key
    `);
    
    // Convert to key-value pairs
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = {
        value: row.setting_value,
        value_th: row.setting_value_th,
        description: row.description,
        description_th: row.description_th,
        data_type: row.data_type,
        category: row.category
      };
    });
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({
      success: true,
      message: 'API is healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API health check failed',
      database: 'disconnected',
      error: error.message
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (db) {
    await db.end();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

startServer().catch(console.error);
