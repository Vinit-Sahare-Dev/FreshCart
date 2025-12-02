# FreshCart - E-commerce Food Delivery Platform

![FreshCart Banner](https://img.shields.io/badge/FreshCart-Food%20Delivery%20Platform-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Overview

FreshCart is a full-stack e-commerce food delivery platform that enables users to browse, order, and manage food deliveries from various restaurants. The platform features a responsive design with real-time cart management, user authentication, and a seamless ordering experience.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🛒 Core Features
- **User Authentication**: Secure login/registration with JWT
- **Product Catalog**: Browse dishes by category (Veg, Non-Veg, Dairy)
- **Shopping Cart**: Real-time cart management with quantity control
- **Search & Filter**: Find dishes by name, category, or price range
- **Responsive Design**: Mobile-first approach for all devices
- **Order Management**: Track order status and history

### 🎨 UI/UX Features
- **Beautiful Animations**: Smooth transitions and hover effects
- **Image Galleries**: High-quality food images with fallbacks
- **Interactive Elements**: Add to cart animations, quantity selectors
- **Toast Notifications**: Real-time feedback for user actions
- **Pagination**: Efficient browsing through large catalogs

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Secure cross-origin resource sharing

## 🛠 Technology Stack

### Frontend
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux-8.1.1-764ABC?logo=redux)
![React Router](https://img.shields.io/badge/React_Router-6.14.2-CA4245?logo=react-router)
![Axios](https://img.shields.io/badge/Axios-1.4.0-5A29E4?logo=axios)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1.2-6DB33F?logo=springboot)
![Java](https://img.shields.io/badge/Java-17-007396?logo=java)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens)
![Spring Security](https://img.shields.io/badge/Spring_Security-6.1.2-6DB33F?logo=springsecurity)

### Database
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Hibernate](https://img.shields.io/badge/Hibernate-6.2.5-59666C?logo=hibernate)
![JPA](https://img.shields.io/badge/Spring_Data_JPA-3.1.2-6DB33F)

### Development Tools
![Node.js](https://img.shields.io/badge/Node.js-18.16.0-339933?logo=nodedotjs)
![npm](https://img.shields.io/badge/npm-9.5.1-CB3837?logo=npm)
![Maven](https://img.shields.io/badge/Maven-3.9.2-C71A36?logo=apachemaven)
![Git](https://img.shields.io/badge/Git-F05032?logo=git)

### Deployment
![Render](https://img.shields.io/badge/Render-Cloud_Deployment-46E3B7?logo=render)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify)

## 📁 Project Structure

```
FreshCart/
├── frontend/                    # React Frontend Application
│   ├── public/
│   │   ├── veg/                # Vegetarian dish images
│   │   ├── nonveg/             # Non-vegetarian dish images
│   │   ├── dairy/              # Dairy product images
│   │   ├── index.html
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/              # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Veg.jsx
│   │   │   ├── NonVeg.jsx
│   │   │   ├── Dairy.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── store/              # Redux store configuration
│   │   │   ├── store.js
│   │   │   ├── cartSlice.js
│   │   │   └── authSlice.js
│   │   │
│   │   ├── services/           # API services
│   │   │   ├── authService.js
│   │   │   ├── dishService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   │
│   │   ├── styles/             # CSS stylesheets
│   │   │   ├── App.css
│   │   │   ├── Veg.css
│   │   │   ├── NonVeg.css
│   │   │   └── ...
│   │   │
│   │   ├── assets/             # Static assets
│   │   ├── App.jsx             # Main App component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   │
│   ├── package.json
│   ├── .env                    # Frontend environment variables
│   └── README.md
│
├── backend/                    # Spring Boot Backend Application
│   ├── src/main/java/com/example/hotel/
│   │   ├── config/             # Configuration classes
│   │   │   ├── SecurityConfig.java
│   │   │   ├── WebConfig.java
│   │   │   └── DataLoader.java
│   │   │
│   │   ├── controller/         # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── DishController.java
│   │   │   ├── CartController.java
│   │   │   └── OrderController.java
│   │   │
│   │   ├── model/              # Entity classes
│   │   │   ├── User.java
│   │   │   ├── Dish.java
│   │   │   ├── CartItem.java
│   │   │   └── Order.java
│   │   │
│   │   ├── repository/         # Data repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── DishRepository.java
│   │   │   ├── CartRepository.java
│   │   │   └── OrderRepository.java
│   │   │
│   │   ├── service/            # Business logic
│   │   │   ├── UserService.java
│   │   │   ├── DishService.java
│   │   │   ├── CartService.java
│   │   │   └── OrderService.java
│   │   │
│   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── DishDTO.java
│   │   │   └── CartItemDTO.java
│   │   │
│   │   ├── security/           # Security configuration
│   │   │   ├── JwtUtil.java
│   │   │   ├── JwtFilter.java
│   │   │   └── UserDetailsServiceImpl.java
│   │   │
│   │   └── HotelApplication.java  # Main application class
│   │
│   ├── src/main/resources/
│   │   ├── static/images/      # Backend images
│   │   ├── application.properties
│   │   └── application.yml
│   │
│   ├── pom.xml                 # Maven dependencies
│   ├── Dockerfile
│   └── README.md
│
├── database/                   # Database scripts
│   ├── schema.sql              # Database schema
│   ├── seed_data.sql           # Sample data
│   └── migrations/             # Database migrations
│
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   ├── diagrams/               # System diagrams
│   └── screenshots/            # Application screenshots
│
├── .github/                    # GitHub workflows
│   └── workflows/
│       ├── ci-cd.yml
│       └── deploy.yml
│
├── docker-compose.yml          # Docker orchestration
├── .gitignore
├── LICENSE
└── README.md                   # This file
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v18.16.0 or higher)
- **Java JDK** (17 or higher)
- **MySQL** (8.0 or higher)
- **Maven** (3.9.2 or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vinit-Sahare-Dev/FreshCart.git
cd FreshCart
```

### Step 2: Backend Setup

```bash
cd backend

# Configure database (update application.properties)
# Update the following in src/main/resources/application.properties:
# spring.datasource.url=jdbc:mysql://localhost:3306/freshcart
# spring.datasource.username=your_username
# spring.datasource.password=your_password
# jwt.secret=your_jwt_secret_key_here

# Build and run the backend
mvn clean install
mvn spring-boot:run
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your backend URL:
# REACT_APP_API_URL=http://localhost:8080

# Start the development server
npm start
```

### Step 4: Database Setup

```sql
-- Create database
CREATE DATABASE freshcart;
USE freshcart;

-- Run the DataLoader will automatically create tables and seed data
-- Or manually run scripts from database/ folder
```

## 🔧 Running the Application

### Development Mode

```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm start
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
mvn clean package

# Run backend JAR
java -jar target/hotel-0.0.1-SNAPSHOT.jar
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individually
docker build -t freshcart-backend ./backend
docker build -t freshcart-frontend ./frontend
```

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update profile | Yes |

### Dish Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dishes` | Get all dishes | No |
| GET | `/dishes/category/{category}` | Get dishes by category | No |
| GET | `/dishes/{id}` | Get dish by ID | No |
| POST | `/dishes` | Create new dish | Yes (Admin) |
| PUT | `/dishes/{id}` | Update dish | Yes (Admin) |
| DELETE | `/dishes/{id}` | Delete dish | Yes (Admin) |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart/add` | Add item to cart | Yes |
| PUT | `/cart/update/{itemId}` | Update cart item | Yes |
| DELETE | `/cart/remove/{itemId}` | Remove item from cart | Yes |
| DELETE | `/cart/clear` | Clear cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders/create` | Create order | Yes |
| GET | `/orders` | Get user orders | Yes |
| GET | `/orders/{orderId}` | Get order details | Yes |
| PUT | `/orders/{orderId}/cancel` | Cancel order | Yes |

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dishes table
CREATE TABLE dishes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 4.0,
    cook_time VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_dish (user_id, dish_id)
);

-- Orders table
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    delivery_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);
```

## 🔐 Environment Variables

### Backend (.env or application.properties)
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/freshcart
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your_super_secret_jwt_key_minimum_256_bits
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## 📸 Screenshots

### Home Page
![Home Page](docs/screenshots/home.png)

### Product Catalog
![Veg Dishes](docs/screenshots/veg-dishes.png)
![Non-Veg Dishes](docs/screenshots/nonveg-dishes.png)

### Shopping Cart
![Cart Page](docs/screenshots/cart.png)

### Checkout Process
![Checkout](docs/screenshots/checkout.png)

### User Dashboard
![Dashboard](docs/screenshots/dashboard.png)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend library
- [Spring Boot](https://spring.io/projects/spring-boot) for robust backend framework
- [MySQL](https://www.mysql.com/) for reliable database
- All contributors and users of FreshCart

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/Vinit-Sahare-Dev/FreshCart/issues) page
2. Create a new issue if your problem isn't already reported
3. Email: support@freshcart.com

## 🔗 Links

- **Live Demo**: [https://freshcart-demo.com](https://freshcart-demo.com)
- **API Documentation**: [https://api.freshcart.com/docs](https://api.freshcart.com/docs)
- **Frontend Repository**: [https://github.com/Vinit-Sahare-Dev/FreshCart/tree/main/frontend](https://github.com/Vinit-Sahare-Dev/FreshCart/tree/main/frontend)
- **Backend Repository**: [https://github.com/Vinit-Sahare-Dev/FreshCart/tree/main/backend](https://github.com/Vinit-Sahare-Dev/FreshCart/tree/main/backend)

## 🚀 Deployment

### Deploy to Render/Railway

```bash
# Deploy Backend to Railway
railway up

# Deploy Frontend to Netlify
netlify deploy --prod
```

### Docker Deployment

```bash
# Build and push to Docker Hub
docker-compose build
docker-compose push

# Deploy with Docker Swarm
docker stack deploy -c docker-compose.yml freshcart
```

---

⭐ **Star this repository if you find it helpful!**

---
**Made with ❤️ by [Vinit Sahare](https://github.com/Vinit-Sahare-Dev)**
