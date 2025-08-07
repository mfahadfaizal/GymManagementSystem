# Gym Management System

A comprehensive gym management system built with Spring Boot (Backend) and React (Frontend) with role-based access control and full CRUD operations.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, STAFF, TRAINER, MEMBER)
- Secure password encryption
- Session management

### 👥 User Management
- User registration and login
- Profile management
- Role-based dashboards
- User CRUD operations

### 💳 Membership Management
- Create and manage memberships
- Track membership status (ACTIVE, EXPIRED, CANCELLED)
- Membership renewal functionality
- Expiring membership alerts

### 🏋️ Equipment Management
- Equipment inventory tracking
- Maintenance scheduling
- Status management (AVAILABLE, MAINTENANCE, OUT_OF_SERVICE)
- Warranty tracking

### 🎯 Training Sessions
- Schedule training sessions
- Trainer-member assignments
- Session status tracking
- Booking system for members

### 🏃 Gym Classes
- Class scheduling and management
- Capacity management
- Class registration system
- Attendance tracking

### 💰 Payment Management
- Payment processing
- Multiple payment methods
- Payment status tracking
- Revenue reporting

## Technology Stack

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Bootstrap 5** - UI components
- **Axios** - HTTP client
- **Context API** - State management

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Installation & Setup

### 1. Database Setup

1. Install MySQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE gym_management;
```

3. Update database configuration in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

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

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Users
- `GET /api/users` - Get all users (ADMIN/STAFF)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (ADMIN)

### Memberships
- `GET /api/memberships` - Get all memberships
- `GET /api/memberships/{id}` - Get membership by ID
- `GET /api/memberships/user/{userId}` - Get user's memberships
- `POST /api/memberships` - Create membership
- `PUT /api/memberships/{id}` - Update membership
- `DELETE /api/memberships/{id}` - Delete membership

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

### Training Sessions
- `GET /api/training-sessions` - Get all sessions
- `POST /api/training-sessions/book` - Book session (MEMBER)
- `POST /api/training-sessions` - Create session
- `PUT /api/training-sessions/{id}` - Update session
- `DELETE /api/training-sessions/{id}` - Delete session

### Gym Classes
- `GET /api/gym-classes` - Get all classes
- `POST /api/gym-classes` - Create class
- `PUT /api/gym-classes/{id}` - Update class
- `DELETE /api/gym-classes/{id}` - Delete class

### Class Registrations
- `GET /api/class-registrations` - Get all registrations
- `POST /api/class-registrations/register` - Register for class
- `PUT /api/class-registrations/{id}/status` - Update registration status

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/{id}/status` - Update payment status

## Role-Based Access

### ADMIN
- Full system access
- User management
- All CRUD operations
- System configuration

### STAFF
- Membership management
- Equipment management
- Payment processing
- Class management

### TRAINER
- Training session management
- Class teaching
- Member progress tracking
- Session scheduling

### MEMBER
- View own profile
- Book training sessions
- Register for classes
- View own memberships

## Quick Start Scripts

### Windows
```bash
# Start backend
cd backend && mvn spring-boot:run

# Start frontend (in new terminal)
cd frontend && npm start
```

### Linux/Mac
```bash
# Start backend
cd backend && ./mvnw spring-boot:run

# Start frontend (in new terminal)
cd frontend && npm start
```

## Default Users

The system creates default users on startup:

- **Admin**: admin/admin123
- **Staff**: staff/staff123
- **Trainer**: trainer/trainer123
- **Member**: member/member123

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database exists

2. **Port Already in Use**
   - Change backend port in `application.properties`
   - Change frontend port in `package.json`

3. **CORS Issues**
   - Backend CORS is configured for all origins
   - Check if backend is running on correct port

4. **JWT Token Issues**
   - Clear browser localStorage
   - Re-login to get new token

### Logs

Backend logs are available in the console and can be configured in `application.properties`:
```properties
logging.level.com.gym=DEBUG
```

## Development

### Adding New Features

1. **Backend**: Add entities, repositories, services, and controllers
2. **Frontend**: Add components and API calls
3. **Database**: Update schema if needed

### Code Structure

```
├── backend/
│   ├── src/main/java/com/gym/
│   │   ├── controller/     # REST controllers
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── service/        # Business logic
│   │   ├── security/       # JWT & security config
│   │   └── payload/        # Request/Response DTOs
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── App.js          # Main app
│   └── package.json
└── database/
    └── schema.sql          # Database schema
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository. 