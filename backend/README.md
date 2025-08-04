# Gym Management System - Backend

A comprehensive Spring Boot backend for a gym management system with role-based authentication and authorization.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Four user roles (MEMBER, TRAINER, STAFF, ADMIN)
- **RESTful APIs**: Clean and well-structured REST endpoints
- **MySQL Database**: Persistent data storage
- **Spring Security**: Robust security implementation
- **Data Validation**: Input validation and error handling

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0**
- **JWT (JSON Web Tokens)**
- **Maven**

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Database Setup

1. Install MySQL if not already installed
2. Create a database named `gym_management`
3. Update database credentials in `application.properties`

```sql
CREATE DATABASE gym_management;
```

## Configuration

Update the database connection in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gym_management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Running the Application

1. **Clone the repository**
2. **Navigate to the backend directory**
   ```bash
   cd backend
   ```
3. **Build the project**
   ```bash
   mvn clean install
   ```
4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Test Endpoints (Role-based)
- `GET /api/test/all` - Public access
- `GET /api/test/member` - MEMBER role required
- `GET /api/test/trainer` - TRAINER role required
- `GET /api/test/staff` - STAFF role required
- `GET /api/test/admin` - ADMIN role required

## Sample Users

The application automatically creates sample users on first run:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| trainer | trainer123 | TRAINER |
| staff | staff123 | STAFF |
| member | member123 | MEMBER |

## Project Structure

```
src/main/java/com/gym/
├── GymManagementApplication.java
├── config/
│   └── DataInitializer.java
├── controller/
│   ├── AuthController.java
│   └── TestController.java
├── entity/
│   └── User.java
├── payload/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   └── SignupRequest.java
│   └── response/
│       ├── JwtResponse.java
│       └── MessageResponse.java
├── repository/
│   └── UserRepository.java
└── security/
    ├── AuthTokenFilter.java
    ├── JwtUtils.java
    ├── UserDetailsImpl.java
    ├── UserDetailsServiceImpl.java
    └── WebSecurityConfig.java
```

## Security Features

- **JWT Token Authentication**: Stateless authentication
- **Password Encryption**: BCrypt password hashing
- **Role-based Authorization**: Method-level security
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Request validation and sanitization

## Database Schema

The application uses JPA/Hibernate to automatically create the database schema. The main table is:

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('MEMBER', 'TRAINER', 'STAFF', 'ADMIN') NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);
```

## Testing

Run tests with:
```bash
mvn test
```

## API Documentation

The application provides RESTful APIs for:

1. **User Authentication**: Login and registration
2. **Role-based Access**: Different endpoints for different user roles
3. **User Management**: Profile management and user operations

## Future Enhancements

- Equipment management
- Membership tracking
- Training session scheduling
- Payment processing
- Reporting and analytics
- Email notifications
- File upload capabilities

## Troubleshooting

1. **Database Connection Issues**: Verify MySQL is running and credentials are correct
2. **Port Conflicts**: Change the port in `application.properties` if 8080 is occupied
3. **JWT Issues**: Check the JWT secret in `application.properties`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request 