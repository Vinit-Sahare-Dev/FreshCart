# Backend API Testing

## 1. AuthController (/api/auth)

### 1.1 Register User (POST /api/auth/register)
```bash
curl -X POST http://localhost:8080/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "password": "TestPassword123",
  "firstName": "Test",
  "lastName": "User"
}'
```

### 1.2 Login User (POST /api/auth/login)
```bash
curl -X POST http://localhost:8080/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "password": "TestPassword123"
}'
```

**Note:** Save the returned JWT token for authenticated requests in next steps.

---

After testing AuthController endpoints and obtaining JWT token, other API endpoints can be tested similarly with Authorization header:

```
-H "Authorization: Bearer <JWT_TOKEN>"
```

Remaining API endpoint testing guidelines will be added after verifying AuthController tests.
