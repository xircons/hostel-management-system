import express, { Request, Response } from 'express';
import mysql, { Connection } from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  DatabaseConfig,
  Room,
  RoomType,
  User,
  SystemSetting,
  Testimonial,
  ApiResponse,
  RoomApiResponse,
  SingleRoomApiResponse,
  UserApiResponse,
  SettingsApiResponse,
  TestimonialApiResponse,
  CreateBookingRequest,
  CheckAvailabilityRequest,
  AvailabilityResponse
} from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env['PORT'] || '5001', 10);

// Middleware
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Database connection configuration
const dbConfig: DatabaseConfig = {
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '3306', 10),
  user: process.env['DB_USER'] || 'root',
  password: process.env['DB_PASSWORD'] || '',
  database: process.env['DB_NAME'] || 'hostel_management',
  charset: 'utf8mb4'
};

let db: Connection;

// Initialize database connection
async function initDatabase(): Promise<void> {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
    process.exit(1);
  }
}

// =====================================================
// ROOM API ENDPOINTS
// =====================================================

// Get all rooms
app.get('/api/rooms', async (_req: Request, res: Response): Promise<void> => {
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
    
    // Parse JSON fields and transform data
    const rooms: Room[] = (rows as any[]).map((room: any) => ({
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]'),
      amenities_th: JSON.parse(room.amenities_th || '[]'),
      base_price: parseFloat(room.base_price),
      weekend_price: parseFloat(room.weekend_price),
      holiday_price: parseFloat(room.holiday_price),
      size_sqm: parseFloat(room.size_sqm),
      is_available: Boolean(room.is_available),
      has_air_conditioning: Boolean(room.has_air_conditioning),
      has_wifi: Boolean(room.has_wifi),
      has_private_bathroom: Boolean(room.has_private_bathroom),
      has_shared_bathroom: Boolean(room.has_shared_bathroom),
      has_desk: Boolean(room.has_desk),
      requires_stairs: Boolean(room.requires_stairs)
    }));
    
    const response: RoomApiResponse = {
      success: true,
      data: rooms,
      count: rooms.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch rooms',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// Get room by ID
app.get('/api/rooms/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId: number = parseInt(req.params['id'] || '0', 10);
    
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
    
    if ((rows as any[]).length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Room not found'
      };
      res.status(404).json(response);
      return;
    }
    
    const roomData = (rows as any[])[0];
    const room: Room = {
      ...roomData,
      images: JSON.parse(roomData.images || '[]'),
      amenities: JSON.parse(roomData.amenities || '[]'),
      amenities_th: JSON.parse(roomData.amenities_th || '[]'),
      base_price: parseFloat(roomData.base_price),
      weekend_price: parseFloat(roomData.weekend_price),
      holiday_price: parseFloat(roomData.holiday_price),
      size_sqm: parseFloat(roomData.size_sqm),
      is_available: Boolean(roomData.is_available),
      has_air_conditioning: Boolean(roomData.has_air_conditioning),
      has_wifi: Boolean(roomData.has_wifi),
      has_private_bathroom: Boolean(roomData.has_private_bathroom),
      has_shared_bathroom: Boolean(roomData.has_shared_bathroom),
      has_desk: Boolean(roomData.has_desk),
      requires_stairs: Boolean(roomData.requires_stairs)
    };
    
    const response: SingleRoomApiResponse = {
      success: true,
      data: room
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching room:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch room',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// Get room types
app.get('/api/room-types', async (_req: Request, res: Response): Promise<void> => {
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
    
    const response: ApiResponse<RoomType[]> = {
      success: true,
      data: rows as RoomType[]
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching room types:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch room types',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// Check room availability
app.post('/api/rooms/availability', async (req: Request, res: Response): Promise<void> => {
  try {
    const { room_id, check_in_date, check_out_date }: CheckAvailabilityRequest = req.body;
    
    if (!room_id || !check_in_date || !check_out_date) {
      const response: ApiResponse = {
        success: false,
        message: 'Missing required fields: room_id, check_in_date, check_out_date'
      };
      res.status(400).json(response);
      return;
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
    
    const isAvailable: boolean = (conflicts as any[])[0].conflict_count === 0;
    
    const response: ApiResponse<AvailabilityResponse> = {
      success: true,
      data: {
        room_id,
        check_in_date,
        check_out_date,
        available: isAvailable
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error checking availability:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to check room availability',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// =====================================================
// BOOKING API ENDPOINTS
// =====================================================

// Create booking
app.post('/api/bookings', async (req: Request, res: Response): Promise<void> => {
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
    }: CreateBookingRequest = req.body;
    
    // Validate required fields
    if (!guest_first_name || !guest_last_name || !guest_email || !room_id || !check_in_date || !check_out_date) {
      const response: ApiResponse = {
        success: false,
        message: 'Missing required fields'
      };
      res.status(400).json(response);
      return;
    }
    
    // Get room price
    const [roomRows] = await db.execute('SELECT base_price FROM rooms WHERE id = ?', [room_id]);
    if ((roomRows as any[]).length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Room not found'
      };
      res.status(404).json(response);
      return;
    }
    
    const roomPrice: number = parseFloat((roomRows as any[])[0].base_price);
    const checkInDate: Date = new Date(check_in_date);
    const checkOutDate: Date = new Date(check_out_date);
    const nights: number = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount: number = roomPrice * nights;
    
    // Generate booking reference
    const bookingReference: string = 'BK' + Date.now().toString().slice(-6);
    
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
    
    const response: ApiResponse<{ booking_id: number; booking_reference: string; total_amount: number; nights: number }> = {
      success: true,
      data: {
        booking_id: (result as any).insertId,
        booking_reference: bookingReference,
        total_amount: totalAmount,
        nights: nights
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error creating booking:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to create booking',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// =====================================================
// USER API ENDPOINTS
// =====================================================

// Get user by ID
app.get('/api/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = parseInt(req.params['id'] || '0', 10);
    
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
    
    if ((rows as any[]).length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      res.status(404).json(response);
      return;
    }
    
    const response: UserApiResponse = {
      success: true,
      data: (rows as any[])[0] as User
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch user',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// =====================================================
// SYSTEM SETTINGS API ENDPOINTS
// =====================================================

// Get system settings
app.get('/api/settings', async (_req: Request, res: Response): Promise<void> => {
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
    const settings: Record<string, SystemSetting> = {};
    (rows as any[]).forEach((row: any) => {
      settings[row.setting_key] = {
        id: 0, // Not needed for this response
        setting_key: row.setting_key,
        setting_value: row.setting_value,
        setting_value_th: row.setting_value_th,
        description: row.description,
        description_th: row.description_th,
        data_type: row.data_type,
        category: row.category,
        is_editable: true,
        created_at: new Date(),
        updated_at: new Date()
      };
    });
    
    const response: SettingsApiResponse = {
      success: true,
      data: settings
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching settings:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch settings',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// =====================================================
// TESTIMONIALS API ENDPOINTS
// =====================================================

// Get all testimonials
app.get('/api/testimonials', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        customer_name,
        customer_name_th,
        customer_nationality,
        customer_avatar_url,
        room_id,
        booking_id,
        overall_rating,
        cleanliness_rating,
        location_rating,
        value_rating,
        service_rating,
        title,
        title_th,
        comment,
        comment_th,
        stay_date,
        is_verified,
        is_approved,
        is_featured,
        created_at,
        updated_at
      FROM testimonials
      WHERE is_approved = true
      ORDER BY is_featured DESC, created_at DESC
    `);
    
    const testimonials: Testimonial[] = (rows as any[]).map((testimonial: any) => ({
      ...testimonial,
      overall_rating: parseFloat(testimonial.overall_rating),
      cleanliness_rating: parseFloat(testimonial.cleanliness_rating),
      location_rating: parseFloat(testimonial.location_rating),
      value_rating: parseFloat(testimonial.value_rating),
      service_rating: parseFloat(testimonial.service_rating),
      is_verified: Boolean(testimonial.is_verified),
      is_approved: Boolean(testimonial.is_approved),
      is_featured: Boolean(testimonial.is_featured)
    }));
    
    const response: TestimonialApiResponse = {
      success: true,
      data: testimonials,
      count: testimonials.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch testimonials',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// Get random testimonials
app.get('/api/testimonials/random', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        customer_name,
        customer_name_th,
        customer_nationality,
        customer_avatar_url,
        room_id,
        booking_id,
        overall_rating,
        cleanliness_rating,
        location_rating,
        value_rating,
        service_rating,
        title,
        title_th,
        comment,
        comment_th,
        stay_date,
        is_verified,
        is_approved,
        is_featured,
        created_at,
        updated_at
      FROM testimonials
      WHERE is_approved = true
      ORDER BY RAND()
      LIMIT 3
    `);
    
    const testimonials: Testimonial[] = (rows as any[]).map((testimonial: any) => ({
      ...testimonial,
      overall_rating: parseFloat(testimonial.overall_rating),
      cleanliness_rating: parseFloat(testimonial.cleanliness_rating),
      location_rating: parseFloat(testimonial.location_rating),
      value_rating: parseFloat(testimonial.value_rating),
      service_rating: parseFloat(testimonial.service_rating),
      is_verified: Boolean(testimonial.is_verified),
      is_approved: Boolean(testimonial.is_approved),
      is_featured: Boolean(testimonial.is_featured)
    }));
    
    const response: TestimonialApiResponse = {
      success: true,
      data: testimonials,
      count: testimonials.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching random testimonials:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch random testimonials',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// Get testimonials by room ID
app.get('/api/testimonials/room/:roomId', async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId: number = parseInt(req.params['roomId'] || '0', 10);
    
    const [rows] = await db.execute(`
      SELECT 
        id,
        customer_name,
        customer_name_th,
        customer_nationality,
        customer_avatar_url,
        room_id,
        booking_id,
        overall_rating,
        cleanliness_rating,
        location_rating,
        value_rating,
        service_rating,
        title,
        title_th,
        comment,
        comment_th,
        stay_date,
        is_verified,
        is_approved,
        is_featured,
        created_at,
        updated_at
      FROM testimonials
      WHERE is_approved = true AND room_id = ?
      ORDER BY created_at DESC
    `, [roomId]);
    
    const testimonials: Testimonial[] = (rows as any[]).map((testimonial: any) => ({
      ...testimonial,
      overall_rating: parseFloat(testimonial.overall_rating),
      cleanliness_rating: parseFloat(testimonial.cleanliness_rating),
      location_rating: parseFloat(testimonial.location_rating),
      value_rating: parseFloat(testimonial.value_rating),
      service_rating: parseFloat(testimonial.service_rating),
      is_verified: Boolean(testimonial.is_verified),
      is_approved: Boolean(testimonial.is_approved),
      is_featured: Boolean(testimonial.is_featured)
    }));
    
    const response: TestimonialApiResponse = {
      success: true,
      data: testimonials,
      count: testimonials.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching room testimonials:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch room testimonials',
      error: (error as Error).message
    };
    res.status(500).json(response);
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', async (_req: Request, res: Response): Promise<void> => {
  try {
    await db.execute('SELECT 1');
    const response: ApiResponse<{ message: string; database: string; timestamp: string }> = {
      success: true,
      data: {
        message: 'API is healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      }
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<{ message: string; database: string; error: string }> = {
      success: false,
      data: {
        message: 'API health check failed',
        database: 'disconnected',
        error: (error as Error).message
      }
    };
    res.status(500).json(response);
  }
});

// =====================================================
// START SERVER
// =====================================================

async function startServer(): Promise<void> {
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