# Gym Management System

A full-stack gym management application with React frontend and Spring Boot backend.

## 🏗️ Architecture

- **Frontend**: React.js with Bootstrap UI
- **Backend**: Spring Boot with JWT authentication
- **Database**: MySQL
- **Authentication**: JWT-based with role-based access control

## 🚀 Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE gym_management;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the Spring Boot application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

The backend is configured with:
- **Port**: 8080
- **CORS**: Enabled for all origins
- **JWT**: Secret key configured in `application.properties`
- **Database**: MySQL with automatic schema generation

### Frontend Configuration

The frontend is configured with:
- **Proxy**: Configured to `http://localhost:8080` in `package.json`
- **API Service**: Centralized API calls in `src/services/api.js`
- **Authentication**: JWT token management in `src/context/AuthContext.js`

## 🔐 Authentication & Authorization

### User Roles

- **ADMIN**: Full system access
- **STAFF**: Management operations
- **TRAINER**: Training session management
- **MEMBER**: Basic member access

### API Endpoints

#### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

#### User Management
- `GET /api/users` - Get all users (ADMIN, STAFF)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (ADMIN)

#### Membership Management
- `GET /api/memberships` - Get all memberships
- `POST /api/memberships` - Create membership
- `PUT /api/memberships/{id}` - Update membership
- `DELETE /api/memberships/{id}` - Delete membership

#### Equipment Management
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

#### Gym Classes
- `GET /api/gym-classes` - Get all classes
- `POST /api/gym-classes` - Create class
- `PUT /api/gym-classes/{id}` - Update class
- `DELETE /api/gym-classes/{id}` - Delete class

#### Training Sessions
- `GET /api/training-sessions` - Get all sessions
- `POST /api/training-sessions` - Create session
- `PUT /api/training-sessions/{id}` - Update session
- `DELETE /api/training-sessions/{id}` - Delete session

#### Class Registrations
- `GET /api/class-registrations` - Get all registrations
- `POST /api/class-registrations` - Create registration
- `PUT /api/class-registrations/{id}` - Update registration
- `DELETE /api/class-registrations/{id}` - Delete registration

#### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

## 🎯 Features

### Admin Features
- User management
- Membership management
- Equipment management
- Gym class management
- Payment management
- Training session oversight

### Staff Features
- Membership management
- Equipment management
- Gym class management
- Payment processing

### Trainer Features
- Training session management
- Class registration management

### Member Features
- View profile
- Access member dashboard

## 🔄 API Integration

The frontend and backend are connected through:

1. **Proxy Configuration**: Frontend proxy points to backend
2. **CORS Configuration**: Backend allows frontend requests
3. **JWT Authentication**: Secure API communication
4. **Centralized API Service**: Organized API calls

### Key Integration Points

- **Authentication Flow**: Login → JWT Token → API Calls
- **Error Handling**: 401 responses redirect to login
- **Token Management**: Automatic token inclusion in requests
- **Role-based Access**: Frontend routes protected by user roles

## 🛠️ Development

### Adding New Features

1. **Backend**: Create entity, repository, service, controller
2. **Frontend**: Create component, add to API service, update routes
3. **Testing**: Test API endpoints and frontend integration

### File Structure

```
├── backend/
│   ├── src/main/java/com/gym/
│   │   ├── controller/     # REST controllers
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   └── security/       # JWT and security config
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (AuthContext)
│   │   ├── services/       # API service layer
│   │   └── App.js          # Main app component
│   └── package.json
└── README.md
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is properly configured
2. **Authentication Errors**: Check JWT token validity
3. **Database Connection**: Verify MySQL credentials and database exists
4. **Port Conflicts**: Ensure ports 3000 and 8080 are available

### Debug Steps

1. Check browser console for frontend errors
2. Check backend logs for server errors
3. Verify API endpoints with Postman
4. Check database connectivity

## 📝 License

This project is licensed under the MIT License. 