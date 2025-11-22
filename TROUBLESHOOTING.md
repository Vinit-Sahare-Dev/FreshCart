# Troubleshooting Guide

## Backend Connection Issues

### Error: "Network error - cannot connect to server"

If you see this error when trying to sign in or register:

#### Quick Fix:
1. **Check if backend is running:**
   - Open a new terminal/command prompt
   - Navigate to the backend folder: `cd backend`
   - Start the backend: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`
   - Or double-click `start-backend.bat` in the backend folder

2. **Verify backend is accessible:**
   - Open your browser
   - Go to: http://localhost:8080/api/dishes
   - You should see a JSON response with dishes

3. **Check frontend port:**
   - Make sure your frontend is running (usually on http://localhost:5173)
   - The backend CORS is configured for ports 5173 and 3000

4. **Common Issues:**
   - **Port 8080 already in use:** Another application might be using port 8080
     - Solution: Stop the other application or change backend port in `application.properties`
   
   - **Firewall blocking:** Windows Firewall might be blocking the connection
     - Solution: Allow Java/Maven through firewall
   
   - **Backend crashed:** Check the backend terminal for error messages
     - Solution: Restart the backend

#### Manual Backend Start:
```bash
# Navigate to backend folder
cd backend

# Start with H2 database (easiest, no MySQL needed)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or start with MySQL (if configured)
mvn spring-boot:run
```

#### Check Backend Status:
- Backend API: http://localhost:8080/api/dishes
- Backend Health: Should return JSON data
- Auth Endpoint: http://localhost:8080/api/auth/login (POST)

### Still Having Issues?

1. **Check browser console** (F12) for detailed error messages
2. **Check backend terminal** for error logs
3. **Verify both frontend and backend are running**
4. **Try restarting both** frontend and backend

### Backend Not Starting?

See `backend/README-BACKEND-SETUP.md` for detailed setup instructions.

