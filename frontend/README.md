# Gym Management System - Frontend

A comprehensive React-based frontend for the Gym Management System with role-based access control and full CRUD operations for gym entities.

## Features

### Authentication & Authorization
- **User Registration**: Multi-role registration (Member, Trainer, Staff, Admin)
- **User Login**: JWT-based authentication
- **Role-based Access Control**: Different dashboards and permissions for each role
- **Profile Management**: View and update user information

### Role-Specific Dashboards
- **Admin Dashboard**: Full system administration with access to all management features
- **Staff Dashboard**: Gym operations management (memberships, equipment, classes, payments)
- **Trainer Dashboard**: Training session and class registration management
- **Member Dashboard**: Personal activity tracking and class viewing

### Management Components

#### Membership Management
- Create, read, update, and delete memberships
- Track membership types (Basic, Premium, VIP, Student)
- Monitor membership status (Active, Expired, Cancelled, Pending)
- Manage membership dates and pricing

#### Equipment Management
- Full CRUD operations for gym equipment
- Track equipment types (Cardio, Strength, Flexibility, Functional)
- Monitor equipment status (Available, In Use, Maintenance, Out of Service)
- Manage maintenance schedules and warranty information

#### Training Session Management
- Schedule and manage personal training sessions
- Track session types (Personal, Group, Assessment, Nutrition)
- Monitor session status (Scheduled, In Progress, Completed, Cancelled)
- Manage trainer-member assignments and session details

#### Gym Class Management
- Create and manage group fitness classes
- Track class types (Cardio, Strength, Yoga, Pilates, Spinning, Zumba)
- Monitor class capacity and enrollment
- Manage class schedules and trainer assignments

#### Class Registration Management
- Register members for gym classes
- Track registration status (Registered, Attended, No Show, Cancelled)
- Monitor attendance and class capacity
- Manage class enrollments and cancellations

#### Payment Management
- Process and track payments
- Support multiple payment types (Membership, Class, Training, Equipment, Other)
- Track payment methods (Cash, Card, Bank Transfer, Check, Digital Wallet)
- Monitor payment status (Pending, Completed, Cancelled, Refunded, Overdue)

### Navigation & User Experience
- **Global Navigation**: Role-based navigation bar with easy access to all features
- **Responsive Design**: Mobile-friendly interface using React Bootstrap
- **Real-time Updates**: Immediate feedback for all CRUD operations
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during API operations

## Technology Stack

- **React 18.2.0**: Modern React with hooks and functional components
- **React Router DOM 6.11.2**: Client-side routing
- **React Bootstrap 2.8.0**: UI components and responsive design
- **Axios 1.4.0**: HTTP client for API communication
- **Bootstrap 5.3.0**: CSS framework for styling
- **Context API**: State management for authentication

## Project Structure

```
src/
├── components/
│   ├── Navigation.js              # Global navigation component
│   ├── Login.js                   # User authentication
│   ├── Register.js                # User registration
│   ├── Home.js                    # Landing page
│   ├── Profile.js                 # User profile management
│   ├── BoardAdmin.js              # Admin dashboard
│   ├── BoardStaff.js              # Staff dashboard
│   ├── BoardTrainer.js            # Trainer dashboard
│   ├── BoardMember.js             # Member dashboard
│   ├── MembershipManagement.js    # Membership CRUD operations
│   ├── EquipmentManagement.js     # Equipment CRUD operations
│   ├── TrainingSessionManagement.js # Training session management
│   ├── GymClassManagement.js      # Gym class management
│   ├── ClassRegistrationManagement.js # Class registration management
│   └── PaymentManagement.js       # Payment management
├── context/
│   └── AuthContext.js             # Authentication context
├── App.js                         # Main application component
├── App.css                        # Custom styles
└── index.js                       # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 8080

### Installation
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## API Integration

The frontend communicates with the Spring Boot backend through RESTful APIs:

- **Base URL**: `http://localhost:8080`
- **Authentication**: JWT tokens stored in localStorage
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling for API failures

## Role-Based Access

### Admin (Full Access)
- All management components
- User management
- System administration
- Financial reports

### Staff (Operational Access)
- Membership management
- Equipment management
- Gym class management
- Payment processing

### Trainer (Training Access)
- Training session management
- Class registration management
- Client progress tracking

### Member (Limited Access)
- View training sessions
- Browse gym classes
- Check class registrations
- View personal progress

## Sample Users

For testing purposes, the following users are pre-configured:

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | Admin |
| trainer   | trainer123 | Trainer |
| staff     | staff123 | Staff |
| member    | member123 | Member |

## Features in Detail

### Membership Management
- **Create Memberships**: Assign memberships to users with type, price, and dates
- **Update Memberships**: Modify membership details and status
- **Status Tracking**: Monitor active, expired, and cancelled memberships
- **Type Management**: Support for Basic, Premium, VIP, and Student memberships

### Equipment Management
- **Equipment Tracking**: Complete inventory management
- **Maintenance Scheduling**: Track maintenance dates and schedules
- **Status Monitoring**: Real-time equipment availability
- **Location Management**: Track equipment placement

### Training Sessions
- **Session Scheduling**: Book personal training sessions
- **Trainer Assignment**: Assign trainers to members
- **Status Management**: Track session progress and completion
- **Conflict Detection**: Prevent double-booking

### Gym Classes
- **Class Creation**: Set up group fitness classes
- **Capacity Management**: Monitor enrollment limits
- **Schedule Management**: Manage class times and days
- **Trainer Assignment**: Assign trainers to classes

### Class Registrations
- **Enrollment Management**: Register members for classes
- **Attendance Tracking**: Mark attendance and no-shows
- **Capacity Control**: Prevent over-enrollment
- **Status Updates**: Track registration status changes

### Payment Processing
- **Payment Creation**: Generate payments for various services
- **Status Tracking**: Monitor payment completion and refunds
- **Method Support**: Multiple payment method options
- **Financial Reporting**: Track revenue and outstanding payments

## Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Reporting**: Charts and analytics dashboard
- **Mobile App**: React Native version
- **Offline Support**: Service worker for offline functionality
- **Multi-language Support**: Internationalization
- **Advanced Search**: Filtering and search capabilities
- **File Upload**: Profile pictures and document management
- **Calendar Integration**: Sync with external calendars

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 