// API service for connecting React frontend to backend
const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Failed to connect to server');
      } else if (error.message.includes('HTTP 404')) {
        throw new Error('API endpoint not found');
      } else if (error.message.includes('HTTP 500')) {
        throw new Error('Server internal error');
      } else {
        throw error;
      }
    }
  }

  // =====================================================
  // ROOM API METHODS
  // =====================================================

  // Get all rooms
  async getRooms() {
    return this.apiCall('/rooms');
  }

  // Get room by ID
  async getRoomById(id) {
    return this.apiCall(`/rooms/${id}`);
  }

  // Get room types
  async getRoomTypes() {
    return this.apiCall('/room-types');
  }

  // Check room availability
  async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    return this.apiCall('/rooms/availability', {
      method: 'POST',
      body: JSON.stringify({
        room_id: roomId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      }),
    });
  }

  // =====================================================
  // BOOKING API METHODS
  // =====================================================

  // Create booking
  async createBooking(bookingData) {
    return this.apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // =====================================================
  // USER API METHODS
  // =====================================================

  // Get user by ID
  async getUserById(id) {
    return this.apiCall(`/users/${id}`);
  }

  // =====================================================
  // TESTIMONIALS API METHODS
  // =====================================================

  async getTestimonials() {
    return this.apiCall('/testimonials');
  }

  async getFeaturedTestimonials() {
    return this.apiCall('/testimonials/featured');
  }

  async getRandomTestimonials() {
    return this.apiCall('/testimonials/random');
  }

  async getTestimonialsByRoom(roomId) {
    return this.apiCall(`/testimonials/room/${roomId}`);
  }

  // =====================================================
  // SYSTEM SETTINGS API METHODS
  // =====================================================

  // Get system settings
  async getSettings() {
    return this.apiCall('/settings');
  }

  // =====================================================
  // HEALTH CHECK
  // =====================================================

  // Check API health
  async checkHealth() {
    return this.apiCall('/health');
  }
}

// Create and export API service instance
const apiService = new ApiService();
export default apiService;

