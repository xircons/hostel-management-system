// Database Types
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset: string;
}

// Room Types
export interface Room {
  id: number;
  name: string;
  name_th: string;
  room_number: string;
  floor_number: number;
  room_type_id: number;
  base_price: number;
  capacity: number;
  max_capacity: number;
  size_sqm: number;
  description: string;
  description_th: string;
  detailed_description: string;
  detailed_description_th: string;
  main_image_url: string;
  images: string[];
  amenities: string[];
  amenities_th: string[];
  is_available: boolean;
  status: string;
  has_air_conditioning: boolean;
  has_wifi: boolean;
  has_private_bathroom: boolean;
  has_shared_bathroom: boolean;
  has_desk: boolean;
  bed_type: string;
  bed_count: number;
  weekend_price: number;
  holiday_price: number;
  requires_stairs: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RoomType {
  id: number;
  name: string;
  name_th: string;
  description: string;
  description_th: string;
  base_capacity: number;
  max_capacity: number;
  base_price: number;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  nationality: string;
  role: 'admin' | 'staff' | 'customer';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Booking Types
export interface Booking {
  id: number;
  booking_reference: string;
  user_id?: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_nationality: string;
  room_id: number;
  check_in_date: Date;
  check_out_date: Date;
  nights: number;
  guests_count: number;
  room_price: number;
  total_amount: number;
  final_amount: number;
  status_id: number;
  special_requests?: string;
  created_at: Date;
  updated_at: Date;
}

export interface BookingStatus {
  id: number;
  name: string;
  name_th: string;
  description: string;
  description_th: string;
  color: string;
  sort_order: number;
}

// Payment Types
export interface Payment {
  id: number;
  booking_id: number;
  payment_reference: string;
  amount: number;
  payment_method_id: number;
  payment_status_id: number;
  transaction_id?: string;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  id: number;
  name: string;
  name_th: string;
  description: string;
  description_th: string;
  is_active: boolean;
  sort_order: number;
}

export interface PaymentStatus {
  id: number;
  name: string;
  name_th: string;
  description: string;
  description_th: string;
  color: string;
  sort_order: number;
}

// Review Types
export interface Review {
  id: number;
  booking_id: number;
  user_id?: number;
  overall_rating: number;
  cleanliness_rating: number;
  location_rating: number;
  value_rating: number;
  service_rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: Date;
  updated_at: Date;
}

// Testimonial Types
export interface Testimonial {
  id: number;
  customer_name: string;
  customer_name_th: string;
  customer_nationality: string;
  customer_avatar_url: string;
  room_id?: number;
  booking_id?: number;
  overall_rating: number;
  cleanliness_rating: number;
  location_rating: number;
  value_rating: number;
  service_rating: number;
  title: string;
  title_th: string;
  comment: string;
  comment_th: string;
  stay_date: Date;
  is_verified: boolean;
  is_approved: boolean;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TestimonialApiResponse extends ApiResponse<Testimonial[]> {
  data: Testimonial[];
  count: number;
}

// Notification Types
export interface Notification {
  id: number;
  user_id?: number;
  type_id: number;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface NotificationType {
  id: number;
  name: string;
  name_th: string;
  template_subject: string;
  template_subject_th: string;
  template_body: string;
  template_body_th: string;
}

// System Settings Types
export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_value_th: string;
  description: string;
  description_th: string;
  data_type: 'string' | 'number' | 'boolean' | 'json' | 'time' | 'date';
  category: string;
  is_editable: boolean;
  created_at: Date;
  updated_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface RoomApiResponse extends ApiResponse<Room[]> {
  data: Room[];
  count: number;
}

export interface SingleRoomApiResponse extends ApiResponse<Room> {
  data: Room;
}

export interface BookingApiResponse extends ApiResponse<Booking> {
  data: Booking;
}

export interface UserApiResponse extends ApiResponse<User> {
  data: User;
}

export interface SettingsApiResponse extends ApiResponse<Record<string, SystemSetting>> {
  data: Record<string, SystemSetting>;
}

// Request Types
export interface CreateBookingRequest {
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_nationality: string;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  guests_count?: number;
  special_requests?: string;
}

export interface CheckAvailabilityRequest {
  room_id: number;
  check_in_date: string;
  check_out_date: string;
}

export interface AvailabilityResponse {
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  available: boolean;
}

// Environment Variables
export interface EnvironmentVariables {
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
}
