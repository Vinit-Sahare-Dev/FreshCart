# Backend Setup Guide

## Quick Start (Easiest - Using H2 In-Memory Database)

**No MySQL installation required!**

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run with H2 database (development profile):**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

   Or if using an IDE, set the active profile to `dev` in your run configuration.

3. **The backend will start on:** `http://localhost:8080`

4. **Access H2 Console (optional):** `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:hotel_db`
   - Username: `sa`
   - Password: (leave empty)

**Note:** H2 is in-memory, so data is lost when the server stops. Perfect for development!

---

## Full Setup (Using MySQL - Production Ready)

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ installed and running

### Step 1: Install MySQL (if not installed)

**Windows:**
1. Download MySQL from: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Remember your root password

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### Step 2: Create Database and User

1. **Open MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```

2. **Run the setup script:**
   ```sql
   source backend/setup-mysql.sql
   ```
   
   Or manually:
   ```sql
   CREATE DATABASE IF NOT EXISTS hotel_db;
   CREATE USER IF NOT EXISTS 'hotel_user'@'localhost' IDENTIFIED BY 'hotel_password';
   GRANT ALL PRIVILEGES ON hotel_db.* TO 'hotel_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Step 3: Verify Database Connection

Test the connection:
```bash
mysql -u hotel_user -p hotel_db
# Enter password: hotel_password
```

### Step 4: Run the Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   Or run the `HotelApplication` class from your IDE.

### Step 5: Verify Backend is Running

- Backend API: `http://localhost:8080`
- Health check: `http://localhost:8080/api/dishes` (should return dish list)

---

## Troubleshooting

### Issue: "Connection refused" or "Cannot connect to MySQL"

**Solutions:**
1. Check if MySQL is running:
   ```bash
   # Windows
   services.msc (look for MySQL service)
   
   # Mac/Linux
   sudo systemctl status mysql
   ```

2. Verify MySQL is listening on port 3306:
   ```bash
   netstat -an | grep 3306
   ```

3. Check MySQL credentials in `application.properties`

### Issue: "Access denied for user"

**Solutions:**
1. Verify user exists:
   ```sql
   SELECT User, Host FROM mysql.user WHERE User='hotel_user';
   ```

2. Recreate user with correct privileges:
   ```sql
   DROP USER IF EXISTS 'hotel_user'@'localhost';
   CREATE USER 'hotel_user'@'localhost' IDENTIFIED BY 'hotel_password';
   GRANT ALL PRIVILEGES ON hotel_db.* TO 'hotel_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Issue: "Database doesn't exist"

**Solution:**
```sql
CREATE DATABASE hotel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Issue: Port 8080 already in use

**Solutions:**
1. Change port in `application.properties`:
   ```properties
   server.port=8081
   ```

2. Or stop the process using port 8080:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:8080 | xargs kill
   ```

### Issue: Java version mismatch

**Solution:**
- Ensure Java 17+ is installed:
  ```bash
  java -version
  ```
- If using multiple Java versions, set JAVA_HOME:
  ```bash
  export JAVA_HOME=/path/to/java17
  ```

---

## API Endpoints

Once running, the backend provides:

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Dishes:** `GET /api/dishes`, `GET /api/dishes/{id}`
- **Orders:** `POST /api/orders`, `GET /api/orders`
- **Payments:** `POST /api/payments/verify`

---

## Development Tips

1. **Use H2 for quick development** - No setup needed!
2. **Use MySQL for production** - Persistent data storage
3. **Check logs** - Spring Boot logs are very helpful for debugging
4. **H2 Console** - Access at `/h2-console` when using dev profile

---

## Need Help?

Check the logs in the console for detailed error messages. Most issues are related to:
- MySQL not running
- Wrong database credentials
- Port conflicts
- Java version mismatch

