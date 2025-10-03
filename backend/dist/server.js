"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env['PORT'] || '5001', 10);
app.use((0, cors_1.default)({
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
const dbConfig = {
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '3306', 10),
    user: process.env['DB_USER'] || 'root',
    password: process.env['DB_PASSWORD'] || '',
    database: process.env['DB_NAME'] || 'hostel_management',
    charset: 'utf8mb4'
};
let db;
async function initDatabase() {
    try {
        db = await promise_1.default.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}
app.get('/api/rooms', async (_req, res) => {
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
        const rooms = rows.map((room) => ({
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
        const response = {
            success: true,
            data: rooms,
            count: rooms.length
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching rooms:', error);
        const response = {
            success: false,
            message: 'Failed to fetch rooms',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/rooms/:id', async (req, res) => {
    try {
        const roomId = parseInt(req.params['id'] || '0', 10);
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
            const response = {
                success: false,
                message: 'Room not found'
            };
            res.status(404).json(response);
            return;
        }
        const roomData = rows[0];
        const room = {
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
        const response = {
            success: true,
            data: room
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching room:', error);
        const response = {
            success: false,
            message: 'Failed to fetch room',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/room-types', async (_req, res) => {
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
        const response = {
            success: true,
            data: rows
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching room types:', error);
        const response = {
            success: false,
            message: 'Failed to fetch room types',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.post('/api/rooms/availability', async (req, res) => {
    try {
        const { room_id, check_in_date, check_out_date } = req.body;
        if (!room_id || !check_in_date || !check_out_date) {
            const response = {
                success: false,
                message: 'Missing required fields: room_id, check_in_date, check_out_date'
            };
            res.status(400).json(response);
            return;
        }
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
        const response = {
            success: true,
            data: {
                room_id,
                check_in_date,
                check_out_date,
                available: isAvailable
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error checking availability:', error);
        const response = {
            success: false,
            message: 'Failed to check room availability',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.post('/api/bookings', async (req, res) => {
    try {
        const { guest_first_name, guest_last_name, guest_email, guest_phone, guest_nationality, room_id, check_in_date, check_out_date, guests_count, special_requests } = req.body;
        if (!guest_first_name || !guest_last_name || !guest_email || !room_id || !check_in_date || !check_out_date) {
            const response = {
                success: false,
                message: 'Missing required fields'
            };
            res.status(400).json(response);
            return;
        }
        const [roomRows] = await db.execute('SELECT base_price FROM rooms WHERE id = ?', [room_id]);
        if (roomRows.length === 0) {
            const response = {
                success: false,
                message: 'Room not found'
            };
            res.status(404).json(response);
            return;
        }
        const roomPrice = parseFloat(roomRows[0].base_price);
        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalAmount = roomPrice * nights;
        const bookingReference = 'BK' + Date.now().toString().slice(-6);
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
        const response = {
            success: true,
            data: {
                booking_id: result.insertId,
                booking_reference: bookingReference,
                total_amount: totalAmount,
                nights: nights
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        const response = {
            success: false,
            message: 'Failed to create booking',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params['id'] || '0', 10);
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
            const response = {
                success: false,
                message: 'User not found'
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true,
            data: rows[0]
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        const response = {
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/settings', async (_req, res) => {
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
        const settings = {};
        rows.forEach((row) => {
            settings[row.setting_key] = {
                id: 0,
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
        const response = {
            success: true,
            data: settings
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        const response = {
            success: false,
            message: 'Failed to fetch settings',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/testimonials', async (_req, res) => {
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
        const testimonials = rows.map((testimonial) => ({
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
        const response = {
            success: true,
            data: testimonials,
            count: testimonials.length
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching testimonials:', error);
        const response = {
            success: false,
            message: 'Failed to fetch testimonials',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/testimonials/featured', async (_req, res) => {
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
      WHERE is_approved = true AND is_featured = true
      ORDER BY created_at DESC
      LIMIT 6
    `);
        const testimonials = rows.map((testimonial) => ({
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
        const response = {
            success: true,
            data: testimonials,
            count: testimonials.length
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching featured testimonials:', error);
        const response = {
            success: false,
            message: 'Failed to fetch featured testimonials',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/testimonials/room/:roomId', async (req, res) => {
    try {
        const roomId = parseInt(req.params['roomId'] || '0', 10);
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
        const testimonials = rows.map((testimonial) => ({
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
        const response = {
            success: true,
            data: testimonials,
            count: testimonials.length
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching room testimonials:', error);
        const response = {
            success: false,
            message: 'Failed to fetch room testimonials',
            error: error.message
        };
        res.status(500).json(response);
    }
});
app.get('/api/health', async (_req, res) => {
    try {
        await db.execute('SELECT 1');
        const response = {
            success: true,
            data: {
                message: 'API is healthy',
                database: 'connected',
                timestamp: new Date().toISOString()
            }
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            data: {
                message: 'API health check failed',
                database: 'disconnected',
                error: error.message
            }
        };
        res.status(500).json(response);
    }
});
async function startServer() {
    await initDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
        console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    });
}
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (db) {
        await db.end();
        console.log('✅ Database connection closed');
    }
    process.exit(0);
});
startServer().catch(console.error);
//# sourceMappingURL=server.js.map