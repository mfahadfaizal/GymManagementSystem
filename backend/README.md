# Gym Management System - Backend

A comprehensive Spring Boot backend application for managing a gym with role-based authentication, JWT security, and full CRUD operations for gym management.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven (will be auto-installed if not present)

### Running the Application

#### Option 1: One-click start (Recommended)
```bash
.\start.bat
```

#### Option 2: Manual commands
```bash
mvn clean compile
mvn spring-boot:run
```

#### Option 3: IDE
- Import as Maven project
- Run `GymManagementApplication.java`

## 📋 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based authorization (ADMIN, TRAINER, STAFF, MEMBER)
- Password encryption with BCrypt
- CORS configuration for frontend integration
- Stateless session management

### 🏋️ Core Modules
- **User Management**: Complete user CRUD with role management
- **Gym Classes**: Class scheduling, enrollment, and management
- **Equipment**: Equipment tracking and maintenance
- **Memberships**: Membership plans and status tracking
- **Payments**: Payment processing and history
- **Training Sessions**: Personal training session management
- **Class Registrations**: Class enrollment and attendance

### 📊 Sample Data
The application automatically creates sample data on first run:
- 4 users with different roles
- Sample gym classes
- Sample equipment
- Sample memberships and payments

## 🔑 Sample Users

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | admin123 | ADMIN | admin@gym.com |
| trainer | trainer123 | TRAINER | trainer@gym.com |
| staff | staff123 | STAFF | staff@gym.com |
| member | member123 | MEMBER | member@gym.com |

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Test Endpoints
- `GET /api/test/all` - Public access
- `GET /api/test/member` - Member access
- `GET /api/test/trainer` - Trainer access
- `GET /api/test/staff` - Staff access
- `GET /api/test/admin` - Admin access

### User Management
- `GET /api/users` - Get all users (ADMIN/STAFF)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (ADMIN)

### Gym Classes
- `GET /api/gym-classes` - Get all classes
- `POST /api/gym-classes` - Create new class
- `PUT /api/gym-classes/{id}` - Update class
- `DELETE /api/gym-classes/{id}` - Delete class (ADMIN)

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Add new equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

### Memberships
- `GET /api/memberships` - Get all memberships
- `POST /api/memberships` - Create membership
- `PUT /api/memberships/{id}` - Update membership
- `DELETE /api/memberships/{id}` - Delete membership

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

### Training Sessions
- `GET /api/training-sessions` - Get all sessions
- `POST /api/training-sessions` - Create session
- `PUT /api/training-sessions/{id}` - Update session
- `DELETE /api/training-sessions/{id}` - Delete session

### Class Registrations
- `GET /api/class-registrations` - Get all registrations
- `POST /api/class-registrations` - Register for class
- `PUT /api/class-registrations/{id}` - Update registration
- `DELETE /api/class-registrations/{id}` - Cancel registration

## 🗄️ Database

### Development
- **Type**: H2 in-memory database
- **Auto-create**: Tables created automatically
- **Sample data**: Loaded on startup

### Production
- **Type**: MySQL (configure in `application.properties`)
- **URL**: `jdbc:mysql://localhost:3306/gym_management`
- **Username**: `root`
- **Password**: `password`

## ⚙️ Configuration

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/gym_management
spring.datasource.username=root
spring.datasource.password=password

# JWT
jwt.secret=gymManagementSecretKey2024ForJWTTokenGenerationAndValidation
jwt.expiration=86400000

# Server
server.port=8080
```

### Security Configuration
- CORS enabled for all origins
- JWT token validation
- Role-based endpoint protection
- Password encryption

## 🧪 Testing

### Manual Testing
```bash
# Test public endpoint
curl http://localhost:8080/api/test/all

# Test authentication
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test protected endpoint with token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/test/admin
```

## 📁 Project Structure

```
src/main/java/com/gym/
├── config/
│   └── DataInitializer.java          # Sample data creation
├── controller/
│   ├── AuthController.java           # Authentication endpoints
│   ├── UserController.java           # User management
│   ├── GymClassController.java       # Class management
│   ├── EquipmentController.java      # Equipment management
│   ├── MembershipController.java     # Membership management
│   ├── PaymentController.java        # Payment management
│   ├── TrainingSessionController.java # Training sessions
│   └── ClassRegistrationController.java # Class registrations
├── entity/
│   ├── User.java                     # User entity
│   ├── GymClass.java                 # Gym class entity
│   ├── Equipment.java                # Equipment entity
│   ├── Membership.java               # Membership entity
│   ├── Payment.java                  # Payment entity
│   ├── TrainingSession.java          # Training session entity
│   └── ClassRegistration.java        # Class registration entity
├── repository/
│   ├── UserRepository.java           # User data access
│   ├── GymClassRepository.java       # Class data access
│   ├── EquipmentRepository.java      # Equipment data access
│   ├── MembershipRepository.java     # Membership data access
│   ├── PaymentRepository.java        # Payment data access
│   ├── TrainingSessionRepository.java # Training session data access
│   └── ClassRegistrationRepository.java # Registration data access
├── service/
│   ├── UserService.java              # User business logic
│   ├── GymClassService.java          # Class business logic
│   ├── EquipmentService.java         # Equipment business logic
│   ├── MembershipService.java        # Membership business logic
│   ├── PaymentService.java           # Payment business logic
│   ├── TrainingSessionService.java   # Training session business logic
│   └── ClassRegistrationService.java # Registration business logic
├── security/
│   ├── WebSecurityConfig.java        # Security configuration
│   ├── JwtUtils.java                 # JWT utilities
│   ├── AuthTokenFilter.java          # JWT filter
│   ├── UserDetailsImpl.java          # User details implementation
│   ├── UserDetailsServiceImpl.java   # User details service
│   └── jwt/
│       └── AuthEntryPointJwt.java    # JWT entry point
├── payload/
│   ├── request/                      # Request DTOs
│   └── response/                     # Response DTOs
└── GymManagementApplication.java     # Main application class
```

## 🛠️ Development

### Adding New Features
1. Create entity in `entity/` package
2. Create repository in `repository/` package
3. Create service in `service/` package
4. Create controller in `controller/` package
5. Add security configuration if needed

### Database Changes
- Entities use JPA annotations
- Database schema auto-generated
- Use `@PrePersist` and `@PreUpdate` for timestamps

### Security
- Use `@PreAuthorize` for method-level security
- JWT tokens for authentication
- Role-based access control

## 🚨 Troubleshooting

### Common Issues

1. **Port 8080 already in use**
   - Change port in `application.properties`
   - Kill process using port 8080

2. **Database connection failed**
   - Check MySQL is running
   - Verify database credentials
   - Create database if it doesn't exist

3. **JWT token issues**
   - Check JWT secret in properties
   - Verify token expiration time
   - Ensure proper Authorization header

4. **CORS issues**
   - Check CORS configuration in `WebSecurityConfig`
   - Verify frontend origin

## 📞 Support

For issues and questions:
1. Check the `BACKEND_ISSUES_FIXED.md` file
2. Review application logs
3. Test individual endpoints
4. Verify database connectivity

## 🔄 Version History

- **v1.0.0**: Initial release with all core features
- Fixed compilation issues
- Added Maven installation scripts
- Implemented JWT authentication
- Added comprehensive API endpoints 