# Gym Management System API Documentation

## Overview
This document provides comprehensive documentation for the Gym Management System API. The API is built using Spring Boot and provides RESTful endpoints for managing gym operations including memberships, equipment, training sessions, gym classes, and payments.

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints require JWT authentication except for `/api/auth/signin` and `/api/auth/signup`. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## User Roles
- **ADMIN**: Full access to all operations
- **STAFF**: Access to most operations except user management
- **TRAINER**: Access to training sessions, classes, and member data
- **MEMBER**: Access to their own data and class registrations

---

## Authentication Endpoints

### 1. User Sign In
```
POST /api/auth/signin
```
**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@gym.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN",
  "roles": ["ROLE_ADMIN"]
}
```

### 2. User Sign Up
```
POST /api/auth/signup
```
**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@gym.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "MEMBER"
}
```

---

## Membership Management

### 1. Get All Memberships
```
GET /api/memberships
```
**Access:** ADMIN, STAFF

### 2. Get Membership by ID
```
GET /api/memberships/{id}
```
**Access:** ADMIN, STAFF, or current user

### 3. Get Memberships by User
```
GET /api/memberships/user/{userId}
```
**Access:** ADMIN, STAFF, or current user

### 4. Get Active Memberships by User
```
GET /api/memberships/user/{userId}/active
```
**Access:** ADMIN, STAFF, or current user

### 5. Create Membership
```
POST /api/memberships
```
**Access:** ADMIN, STAFF
**Request Body:**
```json
{
  "userId": 1,
  "type": "PREMIUM",
  "price": 49.99,
  "startDate": "2024-01-01T00:00:00",
  "endDate": "2024-02-01T00:00:00",
  "description": "Premium membership"
}
```

### 6. Update Membership
```
PUT /api/memberships/{id}
```
**Access:** ADMIN, STAFF

### 7. Update Membership Status
```
PUT /api/memberships/{id}/status?status=ACTIVE
```
**Access:** ADMIN, STAFF

### 8. Get Expiring Memberships
```
GET /api/memberships/expiring?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59
```
**Access:** ADMIN, STAFF

### 9. Get Expired Memberships
```
GET /api/memberships/expired
```
**Access:** ADMIN, STAFF

### 10. Check Active Membership
```
GET /api/memberships/check/{userId}
```
**Access:** ADMIN, STAFF, or current user

---

## Equipment Management

### 1. Get All Equipment
```
GET /api/equipment
```
**Access:** ADMIN, STAFF

### 2. Get Equipment by ID
```
GET /api/equipment/{id}
```
**Access:** ADMIN, STAFF

### 3. Get Equipment by Type
```
GET /api/equipment/type/CARDIO
```
**Access:** ADMIN, STAFF

### 4. Get Equipment by Status
```
GET /api/equipment/status/AVAILABLE
```
**Access:** ADMIN, STAFF

### 5. Create Equipment
```
POST /api/equipment
```
**Access:** ADMIN
**Request Body:**
```json
{
  "name": "Treadmill",
  "type": "CARDIO",
  "purchasePrice": 2500.00,
  "description": "Professional treadmill",
  "location": "Cardio Area",
  "serialNumber": "TREAD-001"
}
```

### 6. Update Equipment
```
PUT /api/equipment/{id}
```
**Access:** ADMIN

### 7. Update Equipment Status
```
PUT /api/equipment/{id}/status?status=MAINTENANCE
```
**Access:** ADMIN, STAFF

### 8. Schedule Maintenance
```
PUT /api/equipment/{id}/maintenance/schedule?nextMaintenanceDate=2024-02-01T00:00:00
```
**Access:** ADMIN, STAFF

### 9. Complete Maintenance
```
PUT /api/equipment/{id}/maintenance/complete
```
**Access:** ADMIN, STAFF

### 10. Get Equipment Needing Maintenance
```
GET /api/equipment/maintenance/needing
```
**Access:** ADMIN, STAFF

### 11. Search Equipment
```
GET /api/equipment/search?searchTerm=treadmill
```
**Access:** ADMIN, STAFF

---

## Training Sessions

### 1. Get All Training Sessions
```
GET /api/training-sessions
```
**Access:** ADMIN, STAFF, TRAINER

### 2. Get Training Session by ID
```
GET /api/training-sessions/{id}
```
**Access:** ADMIN, STAFF, TRAINER, or current user

### 3. Get Sessions by Trainer
```
GET /api/training-sessions/trainer/{trainerId}
```
**Access:** ADMIN, STAFF, TRAINER, or current user

### 4. Get Sessions by Member
```
GET /api/training-sessions/member/{memberId}
```
**Access:** ADMIN, STAFF, TRAINER, or current user

### 5. Create Training Session
```
POST /api/training-sessions
```
**Access:** ADMIN, STAFF, TRAINER
**Request Body:**
```json
{
  "trainerId": 2,
  "memberId": 4,
  "type": "PERSONAL_TRAINING",
  "scheduledDate": "2024-01-15T10:00:00",
  "duration": 60,
  "price": 50.00,
  "notes": "Strength training session",
  "location": "Training Area"
}
```

### 6. Update Training Session
```
PUT /api/training-sessions/{id}
```
**Access:** ADMIN, STAFF, TRAINER

### 7. Update Session Status
```
PUT /api/training-sessions/{id}/status?status=COMPLETED
```
**Access:** ADMIN, STAFF, TRAINER

### 8. Get Upcoming Sessions
```
GET /api/training-sessions/upcoming
```
**Access:** ADMIN, STAFF, TRAINER

### 9. Reschedule Session
```
PUT /api/training-sessions/{id}/reschedule?newScheduledDate=2024-01-16T10:00:00
```
**Access:** ADMIN, STAFF, TRAINER

---

## Gym Classes

### 1. Get All Gym Classes
```
GET /api/gym-classes
```
**Access:** Public

### 2. Get Gym Class by ID
```
GET /api/gym-classes/{id}
```
**Access:** Public

### 3. Get Available Classes
```
GET /api/gym-classes/available
```
**Access:** Public

### 4. Get Classes by Type
```
GET /api/gym-classes/type/YOGA
```
**Access:** Public

### 5. Create Gym Class
```
POST /api/gym-classes
```
**Access:** ADMIN, STAFF, TRAINER
**Request Body:**
```json
{
  "name": "Morning Yoga",
  "type": "YOGA",
  "trainerId": 2,
  "startTime": "07:00:00",
  "endTime": "08:00:00",
  "maxCapacity": 20,
  "price": 15.00,
  "description": "Relaxing morning yoga",
  "location": "Studio A",
  "scheduleDays": "MON,WED,FRI"
}
```

### 6. Update Gym Class
```
PUT /api/gym-classes/{id}
```
**Access:** ADMIN, STAFF, TRAINER

### 7. Update Class Status
```
PUT /api/gym-classes/{id}/status?status=ACTIVE
```
**Access:** ADMIN, STAFF, TRAINER

### 8. Get Classes by Day
```
GET /api/gym-classes/day/MON
```
**Access:** Public

### 9. Search Classes
```
GET /api/gym-classes/search?searchTerm=yoga
```
**Access:** Public

---

## Class Registrations

### 1. Get All Registrations
```
GET /api/class-registrations
```
**Access:** ADMIN, STAFF, TRAINER

### 2. Get Registrations by Member
```
GET /api/class-registrations/member/{memberId}
```
**Access:** ADMIN, STAFF, TRAINER, or current user

### 3. Register for Class
```
POST /api/class-registrations/register?memberId=4&classId=1
```
**Access:** ADMIN, STAFF, TRAINER, MEMBER

### 4. Cancel Registration
```
PUT /api/class-registrations/{id}/cancel
```
**Access:** ADMIN, STAFF, TRAINER, MEMBER

### 5. Mark Attendance
```
PUT /api/class-registrations/{id}/attendance
```
**Access:** ADMIN, STAFF, TRAINER

### 6. Mark No Show
```
PUT /api/class-registrations/{id}/no-show
```
**Access:** ADMIN, STAFF, TRAINER

### 7. Check Registration Status
```
GET /api/class-registrations/check/{memberId}/{classId}
```
**Access:** ADMIN, STAFF, TRAINER, or current user

---

## Payment Management

### 1. Get All Payments
```
GET /api/payments
```
**Access:** ADMIN, STAFF

### 2. Get Payments by User
```
GET /api/payments/user/{userId}
```
**Access:** ADMIN, STAFF, or current user

### 3. Create Payment
```
POST /api/payments
```
**Access:** ADMIN, STAFF
**Request Body:**
```json
{
  "userId": 4,
  "type": "MEMBERSHIP_FEE",
  "method": "CREDIT_CARD",
  "amount": 29.99,
  "description": "Monthly membership fee",
  "dueDate": "2024-02-01T00:00:00"
}
```

### 4. Process Payment
```
PUT /api/payments/{id}/process
```
**Access:** ADMIN, STAFF

### 5. Refund Payment
```
PUT /api/payments/{id}/refund?notes=Customer request
```
**Access:** ADMIN, STAFF

### 6. Cancel Payment
```
PUT /api/payments/{id}/cancel
```
**Access:** ADMIN, STAFF

### 7. Get Revenue by Date Range
```
GET /api/payments/revenue/date-range?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59
```
**Access:** ADMIN, STAFF

### 8. Get Overdue Payments
```
GET /api/payments/overdue?dueDate=2024-01-15T00:00:00
```
**Access:** ADMIN, STAFF

### 9. Create Membership Payment
```
POST /api/payments/membership?userId=4&amount=29.99&method=CREDIT_CARD
```
**Access:** ADMIN, STAFF

### 10. Create Class Payment
```
POST /api/payments/class?userId=4&amount=15.00&method=CASH
```
**Access:** ADMIN, STAFF

### 11. Create Training Session Payment
```
POST /api/payments/training-session?userId=4&amount=50.00&method=DEBIT_CARD
```
**Access:** ADMIN, STAFF

---

## Test Endpoints

### 1. Public Access
```
GET /api/test/all
```

### 2. Member Access
```
GET /api/test/member
```

### 3. Trainer Access
```
GET /api/test/trainer
```

### 4. Staff Access
```
GET /api/test/staff
```

### 5. Admin Access
```
GET /api/test/admin
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Sample Users

The system comes with pre-configured sample users:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | admin123 | ADMIN | Full system access |
| trainer | trainer123 | TRAINER | Training session management |
| staff | staff123 | STAFF | Operational management |
| member | member123 | MEMBER | Basic member access |

---

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute per user

## CORS Configuration
The API supports CORS for frontend integration:
- Allowed origins: `*`
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: `*`

---

## Database Schema
The system uses the following main entities:
- **Users**: Authentication and role management
- **Memberships**: Member subscription management
- **Equipment**: Gym equipment tracking
- **Training Sessions**: Personal training scheduling
- **Gym Classes**: Group fitness classes
- **Class Registrations**: Class enrollment tracking
- **Payments**: Financial transaction management

Each entity includes audit fields (created_at, updated_at) and proper relationships between entities. 