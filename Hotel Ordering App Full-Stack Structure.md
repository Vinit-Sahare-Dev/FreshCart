# Hotel Ordering App Full-Stack Structure
Problem: Add a hotel dish-ordering website with cart and payments using existing React+Vite frontend (FreshCart) and a new Spring Boot backend, and create the necessary folders/files.
## Current Context
* Frontend: React + Vite app in current repo with Redux store for cart and React Router for routing.
* Key frontend files: `src/App.jsx`, `src/main.jsx`, `src/components/*`, `src/components/store.js`.
* No backend present yet in this repo.
## High-Level Approach
* Keep the existing React app as the main customer UI, extending it with API integration, checkout, and basic auth views.
* Create a new `backend/` Spring Boot project inside this repo for REST APIs, authentication, and payment integration hooks.
* Define a clear REST contract between frontend and backend for dishes, cart/orders, auth, and payments.
## Proposed Folder & File Structure
### 1. Backend (Spring Boot)
Create `backend/` with a Maven-based Spring Boot application.
* `backend/pom.xml`: Spring Boot app with Web, Spring Data JPA, Security, Validation, MySQL driver, Lombok, and (optionally) devtools.
* `backend/src/main/java/com/example/hotel/HotelApplication.java`: main Spring Boot app class.
* `backend/src/main/resources/application.properties`: DB config, server port, CORS basics, and JWT/Stripe placeholders.
**Domain layer (`backend/src/main/java/com/example/hotel/model`)**
* `Dish.java`: id, name, description, price, imageUrl, category, availability.
* `DishCategory.java`: simple enum or entity for categories.
* `User.java`: basic user entity with roles (CUSTOMER, ADMIN), password (hashed), email, etc.
* `Order.java`: order with user, list of `OrderItem`, status, totalAmount, paymentStatus.
* `OrderItem.java`: quantity, price, relation to Dish.
**Repository layer (`backend/src/main/java/com/example/hotel/repository`)**
* `DishRepository.java`: CRUD and findByCategory.
* `UserRepository.java`: findByEmail/username.
* `OrderRepository.java`: basic CRUD and findByUser.
**DTOs (`backend/src/main/java/com/example/hotel/dto`)**
* `DishDto.java`, `OrderItemDto.java`, `OrderRequest.java`, `OrderResponse.java`, `AuthRequest.java`, `AuthResponse.java`.
**Service layer (`backend/src/main/java/com/example/hotel/service`)**
* `DishService.java` + `DishServiceImpl.java`: menu CRUD and listing.
* `OrderService.java` + `OrderServiceImpl.java`: create order from cart, update order/payment status.
* `UserService.java` + `UserServiceImpl.java`: registration and user lookup.
* `PaymentService.java`: abstraction for calling Stripe/PayPal (methods stubbed with TODOs).
**Web layer (`backend/src/main/java/com/example/hotel/controller`)**
* `DishController.java`: `/api/dishes` GET for listing and CRUD endpoints for admin.
* `OrderController.java`: `/api/orders` POST to create, GET to list customer orders, admin list.
* `AuthController.java`: `/api/auth/register`, `/api/auth/login` returning JWT.
* `PaymentController.java`: `/api/payments/create` and `/api/payments/webhook` (stubs with TODOs).
**Security (`backend/src/main/java/com/example/hotel/security`)**
* `JwtUtil.java`, `JwtAuthenticationFilter.java`.
* `SecurityConfig.java`: HTTP security rules, password encoder, CORS.
* `CustomUserDetailsService.java`: integrate with `User` entity.
### 2. Frontend (React + Vite)
Extend existing React app with API integration and new pages.
**API layer (`src/api`)**
* `src/api/apiClient.js`: axios/fetch instance with base URL, JSON headers, auth token injection.
* `src/api/menuApi.js`: `getDishes`, `getDishCategories`.
* `src/api/orderApi.js`: `createOrder`, `getOrders`.
* `src/api/authApi.js`: `login`, `register`, `getCurrentUser`.
* `src/api/paymentApi.js`: `createPaymentIntent` or equivalent stub.
**State/Auth (`src/context`)**
* `src/context/AuthContext.jsx`: React context to hold current user and JWT, with login/logout helpers that call `authApi`.
**Pages (`src/pages`)**
* `src/pages/HomePage.jsx`: high-level landing page that uses existing `Home` component.
* `src/pages/MenuPage.jsx`: uses existing category components (`Veg`, `NonVeg`, `Dairy`) or new unified menu view calling backend.
* `src/pages/CartPage.jsx`: wraps existing `Cart` component.
* `src/pages/CheckoutPage.jsx`: shows order summary and payment button, calls `orderApi` and `paymentApi`.
* `src/pages/LoginPage.jsx` & `src/pages/RegisterPage.jsx`: forms tied into `AuthContext`.
* `src/pages/AdminDashboardPage.jsx`: basic shell UI to list orders and manage dishes via API.
**Routing updates**
* Update `src/App.jsx` routes to include `/login`, `/register`, `/checkout`, `/admin` using new pages.
* Keep existing `/`, `/veg`, `/non-veg`, `/dairy`, `/cart` routes.
**Minor shared components (`src/components`)**
* `src/components/ProtectedRoute.jsx`: wrapper that checks `AuthContext` for authenticated user and redirects to `/login`.
* `src/components/Layout.jsx`: optional shared layout used by pages instead of wiring everything in `App.jsx`.
## Execution Plan
1. Create `backend/` Maven Spring Boot project structure and add minimal code for main app, entities, repositories, controllers, and config as stubs (compilable but business logic mostly TODOs).
2. Add `src/api`, `src/context`, `src/pages`, and `ProtectedRoute` on the frontend with minimal working implementations, wired to existing Redux cart state where needed.
3. Update `src/App.jsx` to use page components and new routes, preserving existing UX.
4. Add basic CORS and port settings to `application.properties` and ensure URLs in `apiClient.js` point at backend.
5. Leave payment gateway-specific integration as stub methods with clear TODO markers so it can be filled in with real Stripe/PayPal keys.
