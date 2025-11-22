# 🚀 Quick Start - Backend is Running!

## ✅ Backend Status: RUNNING
- **URL:** http://localhost:8080
- **Database:** H2 In-Memory (No MySQL needed!)
- **Status:** ✅ Active

## 🎯 Quick Commands

### Start Backend (Easiest - H2 Database)
```bash
# Option 1: Double-click this file
start-backend.bat

# Option 2: Command line
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Start Backend (MySQL - Production)
```bash
# Option 1: Double-click this file
start-backend-mysql.bat

# Option 2: Command line
cd backend
mvn spring-boot:run
```

## 📋 API Endpoints

### Test Backend
```bash
# Get all dishes
curl http://localhost:8080/api/dishes

# Or open in browser
http://localhost:8080/api/dishes
```

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Dishes
- `GET /api/dishes` - Get all dishes
- `GET /api/dishes/{id}` - Get dish by ID

### Orders (Requires Authentication)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Payments (Requires Authentication)
- `POST /api/payments/verify` - Verify payment

## 🔧 Troubleshooting

### Backend won't start?
1. Check if port 8080 is free:
   ```powershell
   netstat -ano | findstr :8080
   ```

2. Kill process using port 8080:
   ```powershell
   # Find PID from above command, then:
   taskkill /PID <PID> /F
   ```

### Want to use MySQL instead?
1. Install MySQL
2. Run `setup-mysql.sql` script
3. Use `start-backend-mysql.bat` or run without `-Dspring-boot.run.profiles=dev`

## 📚 More Info
See `README-BACKEND-SETUP.md` for detailed setup instructions.

