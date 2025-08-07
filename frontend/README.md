# Gym Management System - Frontend

A modern React-based frontend application for managing a gym with role-based access control, real-time data management, and intuitive user interface.

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Backend server running on http://localhost:8080

### Running the Application

#### Option 1: One-click start (Recommended)
```bash
.\start.bat
```

#### Option 2: Manual commands
```bash
npm install
npm start
```

#### Option 3: Using yarn
```bash
yarn install
yarn start
```

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, TRAINER, STAFF, MEMBER)
- Secure token storage
- Automatic token refresh
- Protected routes

### 🏋️ Core Modules
- **User Management**: Complete user CRUD with role management
- **Gym Classes**: Class scheduling, enrollment, and management
- **Equipment**: Equipment tracking and maintenance
- **Memberships**: Membership plans and status tracking
- **Payments**: Payment processing and history
- **Training Sessions**: Personal training session management
- **Class Registrations**: Class enrollment and attendance

### 🎨 User Interface
- Modern Bootstrap-based design
- Responsive layout for all devices
- Intuitive navigation
- Real-time data updates
- Form validation
- Success/error notifications

## 🔑 Sample Users

| Username | Password | Role | Access Level |
|----------|----------|------|--------------|
| admin | admin123 | ADMIN | Full access to all features |
| trainer | trainer123 | TRAINER | Training sessions, class registrations |
| staff | staff123 | STAFF | Equipment, memberships, payments |
| member | member123 | MEMBER | View own profile and registrations |

## 🌐 Application Routes

### Public Routes
- `/` - Home page
- `/login` - User authentication
- `/register` - User registration
- `/test-auth` - Authentication testing

### Protected Routes (Role-based)
- `/profile` - User profile management
- `/member` - Member dashboard
- `/trainer` - Trainer dashboard
- `/staff` - Staff dashboard
- `/admin` - Admin dashboard

### Management Routes
- `/memberships` - Membership management (ADMIN/STAFF)
- `/equipment` - Equipment management (ADMIN/STAFF)
- `/training-sessions` - Training session management (ADMIN/STAFF/TRAINER)
- `/gym-classes` - Gym class management (ADMIN/STAFF)
- `/class-registrations` - Class registration management (ADMIN/STAFF/TRAINER)
- `/payments` - Payment management (ADMIN/STAFF)

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **Bootstrap 5** - CSS framework

## 📁 Project Structure

```
src/
├── components/                    # React components
│   ├── Login.js                  # Authentication component
│   ├── Register.js               # Registration component
│   ├── Navigation.js             # Navigation bar
│   ├── Home.js                   # Home page
│   ├── Profile.js                # User profile
│   ├── BoardAdmin.js             # Admin dashboard
│   ├── BoardStaff.js             # Staff dashboard
│   ├── BoardTrainer.js           # Trainer dashboard
│   ├── BoardMember.js            # Member dashboard
│   ├── GymClassManagement.js     # Class management
│   ├── EquipmentManagement.js    # Equipment management
│   ├── MembershipManagement.js   # Membership management
│   ├── PaymentManagement.js      # Payment management
│   ├── TrainingSessionManagement.js # Training session management
│   ├── ClassRegistrationManagement.js # Class registration management
│   └── TestAuth.js               # Authentication testing
├── context/
│   └── AuthContext.js            # Authentication context
├── services/
│   └── api.js                    # API service functions
├── App.js                        # Main application component
├── App.css                       # Application styles
├── index.js                      # Application entry point
└── index.css                     # Global styles
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=development
```

### API Configuration
The application is configured to connect to the backend at `http://localhost:8080` by default. This can be changed in the `package.json` proxy setting or environment variables.

## 🧪 Testing

### Manual Testing
1. **Authentication Test**
   - Navigate to `/login`
   - Use sample credentials to test login
   - Verify role-based access

2. **API Integration Test**
   - Navigate to `/test-auth`
   - Test API endpoints with authentication

3. **Feature Testing**
   - Test CRUD operations for each module
   - Verify form validation
   - Test responsive design

### Automated Testing
```bash
npm test
```

## 🚨 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend is running on port 8080
   - Check CORS configuration
   - Verify API endpoints

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user credentials

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies

4. **CORS Issues**
   - Ensure backend CORS is configured
   - Check proxy settings in package.json
   - Verify API URL configuration

## 🔄 Development

### Adding New Features
1. Create component in `src/components/`
2. Add route in `App.js`
3. Update API service if needed
4. Add role-based access control
5. Test thoroughly

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use Bootstrap classes for styling
- Implement proper error handling

### State Management
- Use Context API for global state
- Use local state for component-specific data
- Implement proper loading states
- Handle API errors gracefully

## 📞 Support

For issues and questions:
1. Check the backend is running
2. Verify API endpoints are accessible
3. Check browser console for errors
4. Review authentication flow
5. Test with sample users

## 🔄 Version History

- **v1.0.0**: Initial release with all core features
- Updated API integration
- Fixed authentication flow
- Improved error handling
- Enhanced user interface
- Added comprehensive documentation 