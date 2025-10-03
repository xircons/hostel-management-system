# 🏨 Hostel Management System

A complete hostel management system with React frontend and Node.js backend, connected to MySQL database.

## 📁 **Project Structure**

```
hostel-management-system/
├── backend/                 # Backend API server
│   ├── server.js           # Express.js server
│   ├── package.json        # Backend dependencies
│   ├── env.example         # Environment variables template
│   └── README.md           # Backend documentation
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # React components
│   │   ├── services/       # API service
│   │   └── styles/         # CSS styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── hostel_management_complete_design.sql  # Database schema
└── package.json            # Root package.json
```

## 🚀 **Quick Start**

### **1. Install All Dependencies**
```bash
npm run install:all
```

### **2. Setup Database**
1. Import `hostel_management_complete_design.sql` into phpMyAdmin
2. Create database named `hostel_management`

### **3. Setup Backend Environment**
```bash
cd backend
cp env.example .env
# Edit .env with your database credentials
```

### **4. Start Both Frontend and Backend**
```bash
# Start both servers simultaneously
npm start

# Or start them separately:
npm run start:backend  # Backend on port 5000
npm run dev           # Frontend on port 5173
```

## 🎯 **Features**

### **Frontend (React)**
- ✅ Home page with featured rooms
- ✅ Rooms page with filtering
- ✅ Booking page with room selection
- ✅ Room details and amenities
- ✅ Payment integration (QR codes, PromptPay)
- ✅ Responsive design
- ✅ Loading states and error handling

### **Backend (Node.js + Express)**
- ✅ RESTful API endpoints
- ✅ MySQL database integration
- ✅ Room management
- ✅ Booking system
- ✅ User management
- ✅ Payment processing
- ✅ CORS enabled
- ✅ Error handling

### **Database (MySQL)**
- ✅ Complete schema with 15 tables
- ✅ Room types and pricing
- ✅ Booking management
- ✅ Payment tracking
- ✅ User accounts
- ✅ Reviews and ratings
- ✅ Multi-language support (Thai/English)

## 🔗 **API Endpoints**

### **Rooms**
- `GET /api/rooms` - Get all available rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms/availability` - Check availability

### **Bookings**
- `POST /api/bookings` - Create booking

### **System**
- `GET /api/health` - Health check
- `GET /api/settings` - System settings

## 🗄️ **Database Schema**

The system includes a comprehensive database schema with:
- **Rooms**: Room types, pricing, amenities
- **Bookings**: Guest information, dates, status
- **Payments**: Payment methods, transactions
- **Users**: Admin, staff, customer accounts
- **Reviews**: Guest feedback and ratings
- **Settings**: System configuration

## 🎨 **Room Data**

The system includes your 3 rooms:
1. **Standard King Bed Room** (฿531/night)
2. **Female Dormitory 4-Bed** (฿216/night)
3. **Mixed Dormitory 4-Bed** (฿216/night)

All room data is stored in the database and fetched dynamically by the frontend.

## 🔧 **Configuration**

### **Backend (.env)**
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hostel_management
DB_USER=root
DB_PASSWORD=hostel123456
PORT=5000
```

### **Frontend**
- API base URL: `http://localhost:5000/api`
- Development server: `http://localhost:5173`

## 📝 **Development**

### **Available Scripts**
```bash
npm run dev           # Start frontend only
npm run start:backend # Start backend only
npm start            # Start both frontend and backend
npm run build        # Build frontend for production
npm run install:all  # Install all dependencies
```

## 🎉 **What's Working**

✅ **Database Integration**: All room data comes from MySQL  
✅ **Real-time Updates**: Changes in database reflect on website  
✅ **API Communication**: Frontend communicates with backend  
✅ **Error Handling**: Loading states and error messages  
✅ **Responsive Design**: Works on all devices  

Your hostel management system is now fully functional with database integration! 🏨✨