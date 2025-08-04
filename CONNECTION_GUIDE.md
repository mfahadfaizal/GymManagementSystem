# 🔗 Frontend-Backend Connection Guide

This document explains how the React frontend and Spring Boot backend are connected in the Gym Management System.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React App     │ ◄──────────────► │  Spring Boot    │
│   (Port 3000)   │                  │   (Port 8080)   │
└─────────────────┘                  └─────────────────┘
         │                                     │
         │                                     │
         ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│   Browser       │                  │   MySQL DB      │
│   LocalStorage  │                  │   (Port 3306)   │
└─────────────────┘                  └─────────────────┘
```

## 🔧 Connection Configuration

### 1. Frontend Proxy Configuration

**File**: `frontend/package.json`
```json
{
  "proxy": "http://localhost:8080"
}
```

This configuration tells the React development server to proxy all unknown requests to the backend.

### 2. Backend CORS Configuration

**File**: `backend/src/main/java/com/gym/security/WebSecurityConfig.java`

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token", "Authorization", "Content-Type"));
    configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 3. API Service Layer

**File**: `frontend/src/services/api.js`

Centralized API service that handles:
- Base URL configuration
- Authentication token management
- Request/response interceptors
- Error handling

## 🔐 Authentication Flow

### 1. Login Process

```javascript
// Frontend sends login request
const response = await authAPI.login({ username, password });

// Backend validates credentials and returns JWT
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "username": "admin",
  "email": "admin@gym.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}

// Frontend stores token in localStorage
localStorage.setItem('token', accessToken);
```

### 2. API Request Authentication

```javascript
// Request interceptor automatically adds token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Token Validation

```java
// Backend validates JWT token
@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }
        filterChain.doFilter(request, response);
    }
}
```

## 📡 API Communication

### 1. Request Flow

```
Frontend Component → API Service → Axios Interceptor → Backend Controller
```

### 2. Response Flow

```
Backend Controller → Axios Interceptor → API Service → Frontend Component
```

### 3. Error Handling

```javascript
// Response interceptor handles 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎯 API Endpoints Mapping

| Frontend Route | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `/login` | `/api/auth/signin` | POST | User authentication |
| `/register` | `/api/auth/signup` | POST | User registration |
| `/memberships` | `/api/memberships` | GET/POST/PUT/DELETE | Membership management |
| `/equipment` | `/api/equipment` | GET/POST/PUT/DELETE | Equipment management |
| `/gym-classes` | `/api/gym-classes` | GET/POST/PUT/DELETE | Gym class management |
| `/training-sessions` | `/api/training-sessions` | GET/POST/PUT/DELETE | Training session management |
| `/class-registrations` | `/api/class-registrations` | GET/POST/PUT/DELETE | Class registration management |
| `/payments` | `/api/payments` | GET/POST/PUT/DELETE | Payment management |
| `/users` | `/api/users` | GET/PUT/DELETE | User management |

## 🔄 State Management

### 1. Authentication State

```javascript
// AuthContext manages global authentication state
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // ... authentication methods
};
```

### 2. Component State

Each component manages its own local state for:
- Data fetching
- Form handling
- UI interactions
- Error states

## 🛡️ Security Features

### 1. JWT Token Security

- **Expiration**: 24 hours (configurable)
- **Secret**: Strong secret key in `application.properties`
- **Validation**: Server-side token validation on every request

### 2. Role-based Access Control

```java
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
public ResponseEntity<List<User>> getAllUsers() {
    // Only ADMIN and STAFF can access
}
```

### 3. CORS Security

- **Origins**: Configured for development and production
- **Methods**: Limited to necessary HTTP methods
- **Headers**: Controlled header access
- **Credentials**: Enabled for authentication

## 🚀 Development Workflow

### 1. Starting the System

**Option 1: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm start
```

**Option 2: Script Start**
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### 2. Testing Connection

```bash
# Run connection test
node test-connection.js
```

### 3. Development Tips

1. **Backend Changes**: Restart Spring Boot application
2. **Frontend Changes**: Hot reload (automatic)
3. **Database Changes**: Check MySQL connection
4. **API Changes**: Update both backend controller and frontend service

## 🔍 Debugging

### 1. Common Issues

**CORS Errors**
- Check backend CORS configuration
- Verify frontend proxy settings
- Ensure correct ports

**Authentication Errors**
- Check JWT token expiration
- Verify token format in requests
- Check backend JWT configuration

**API Errors**
- Check browser network tab
- Verify backend logs
- Test endpoints with Postman

### 2. Debug Tools

- **Browser DevTools**: Network, Console, Application tabs
- **Spring Boot Logs**: Application startup and request logs
- **Postman**: API endpoint testing
- **MySQL Workbench**: Database inspection

## 📊 Monitoring

### 1. Frontend Monitoring

- Browser console logs
- Network request monitoring
- React DevTools for component state

### 2. Backend Monitoring

- Spring Boot actuator endpoints
- Application logs
- Database query monitoring

## 🚀 Production Deployment

### 1. Environment Configuration

```javascript
// Frontend environment variables
REACT_APP_API_URL=https://your-backend-domain.com

// Backend environment variables
SPRING_PROFILES_ACTIVE=production
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/gym_management
```

### 2. Build Process

```bash
# Frontend build
cd frontend
npm run build

# Backend build
cd backend
mvn clean package
```

## 📝 Best Practices

1. **API Versioning**: Use `/api/v1/` prefix for future versions
2. **Error Handling**: Consistent error responses across all endpoints
3. **Validation**: Both client-side and server-side validation
4. **Documentation**: Keep API documentation updated
5. **Testing**: Regular integration testing
6. **Security**: Regular security audits and updates

---

This connection setup ensures secure, scalable, and maintainable communication between the frontend and backend components of the Gym Management System. 