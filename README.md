# Expense Tracker API

A RESTful API for tracking personal expenses with JWT-based authentication. Built with Node.js, Express, and PostgreSQL.

## Features

- ✅ User registration and authentication with JWT
- ✅ Create, read, update, and delete expenses
- ✅ Filter expenses by category
- ✅ Monthly expense summaries
- ✅ Secure user-specific data access
- ✅ PostgreSQL database with automatic table creation

## Tech Stack

- **Node.js** & **Express** - Backend framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Project Structure

```
expense-tracker/
├── config/
│   ├── database.js          # Database connection & initialization
│   └── jwt.js              # JWT configuration
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── expenseController.js # Expense CRUD operations
├── services/
│   ├── authService.js      # Auth business logic
│   └── expenseService.js   # Expense business logic
├── routes/
│   ├── authRoutes.js       # Authentication endpoints
│   └── expenseRoutes.js    # Expense endpoints
├── utils/
│   └── responseHandler.js  # Standardized API responses
├── .env                    # Environment variables (not in git)
├── .env.example           # Example environment config
├── server.js              # Application entry point
└── package.json
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create PostgreSQL database**
   ```bash
   psql -U postgres
   CREATE DATABASE expense_tracker;
   \q
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=expense_tracker
   DB_PASSWORD=your_password
   DB_PORT=5432
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

5. **Generate a secure JWT secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and use it as your `JWT_SECRET` in `.env`

6. **Start the server**
   ```bash
   node server.js
   ```
   
   The server will automatically create the required database tables on startup.

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

**⚠️ Important:** Save the `token` from the login response. You'll need it for all expense-related requests.

---

### Expense Endpoints

**All expense endpoints require authentication.** Include the JWT token in the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### Create an Expense
```http
POST /api/expenses
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 45.99,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-11-25"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense created",
  "data": {
    "expense": {
      "id": 1,
      "user_id": 1,
      "amount": "45.99",
      "category": "Food",
      "description": "Grocery shopping",
      "date": "2024-11-25",
      "created_at": "2024-11-25T10:30:00.000Z"
    }
  }
}
```

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Expenses retrieved",
  "data": {
    "expenses": [
      {
        "id": 1,
        "user_id": 1,
        "amount": "45.99",
        "category": "Food",
        "description": "Grocery shopping",
        "date": "2024-11-25",
        "created_at": "2024-11-25T10:30:00.000Z"
      }
    ]
  }
}
```

#### Get Single Expense
```http
GET /api/expenses/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update an Expense
```http
PUT /api/expenses/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Updated grocery shopping"
}
```

#### Delete an Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Expenses by Category
```http
GET /api/expenses/category/:category
Authorization: Bearer YOUR_JWT_TOKEN
```

Example: `GET /api/expenses/category/Food`

#### Get Monthly Summary
```http
GET /api/expenses/summary/monthly?year=2024&month=11
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Summary retrieved",
  "data": {
    "year": "2024",
    "month": "11",
    "total": "245.97",
    "byCategory": [
      {
        "category": "Food",
        "total": "125.50",
        "count": "3"
      },
      {
        "category": "Transport",
        "total": "120.47",
        "count": "5"
      }
    ]
  }
}
```

---

## Example Workflows

### Complete User Journey with cURL

#### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "alicePassword123"
  }'
```

#### 2. Login and get token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "alicePassword123"
  }'
```

**Copy the token from the response!** Let's say you got:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGljZSIsImlhdCI6MTYzMjE1MDAwMCwiZXhwIjoxNjMyMjM2NDAwfQ.abcdef123456
```

#### 3. Create expenses using the token
```bash
# Set your token as a variable for convenience
export TOKEN="YOUR_ACTUAL_TOKEN_HERE"

# Create first expense
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 75.50,
    "category": "Food",
    "description": "Weekly groceries",
    "date": "2024-11-25"
  }'

# Create second expense
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 30.00,
    "category": "Transport",
    "description": "Gas",
    "date": "2024-11-24"
  }'
```

#### 4. View all your expenses
```bash
curl -X GET http://localhost:3000/api/expenses \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Update an expense (let's say expense ID is 1)
```bash
curl -X PUT http://localhost:3000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 80.00,
    "description": "Weekly groceries - updated"
  }'
```

#### 6. Get expenses by category
```bash
curl -X GET http://localhost:3000/api/expenses/category/Food \
  -H "Authorization: Bearer $TOKEN"
```

#### 7. Get monthly summary
```bash
curl -X GET "http://localhost:3000/api/expenses/summary/monthly?year=2024&month=11" \
  -H "Authorization: Bearer $TOKEN"
```

#### 8. Delete an expense
```bash
curl -X DELETE http://localhost:3000/api/expenses/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Common Error Responses

### 401 Unauthorized (No Token)
```json
{
  "success": false,
  "error": "Access token required"
}
```

### 403 Forbidden (Invalid/Expired Token)
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Expense not found"
}
```

### 409 Conflict (Duplicate Username/Email)
```json
{
  "success": false,
  "error": "Username or email already exists"
}
```

## Testing the API

### Health Check
```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```
