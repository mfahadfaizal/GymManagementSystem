# 🔧 Admin CRUD Access - Complete Guide

This document explains the admin user's complete CRUD (Create, Read, Update, Delete) access to all operations in the Gym Management System.

## 🎯 Admin Role Capabilities

The **ADMIN** role has **full system access** with the following capabilities:

### ✅ **User Management**
- **GET** `/api/users` - View all users
- **GET** `/api/users/{id}` - View specific user
- **PUT** `/api/users/{id}` - Update user information
- **DELETE** `/api/users/{id}` - Delete user

### ✅ **Membership Management**
- **GET** `/api/memberships` - View all memberships
- **GET** `/api/memberships/{id}` - View specific membership
- **POST** `/api/memberships` - Create new membership
- **PUT** `/api/memberships/{id}` - Update membership
- **DELETE** `/api/memberships/{id}` - Delete membership
- **PUT** `/api/memberships/{id}/status` - Update membership status
- **PUT** `/api/memberships/{id}/renew` - Renew membership

### ✅ **Equipment Management**
- **GET** `/api/equipment` - View all equipment
- **GET** `/api/equipment/{id}` - View specific equipment
- **POST** `/api/equipment` - Create new equipment
- **PUT** `/api/equipment/{id}` - Update equipment
- **DELETE** `/api/equipment/{id}` - Delete equipment
- **PUT** `/api/equipment/{id}/status` - Update equipment status
- **PUT** `/api/equipment/{id}/maintenance/schedule` - Schedule maintenance
- **PUT** `/api/equipment/{id}/maintenance/complete` - Complete maintenance

### ✅ **Gym Classes Management**
- **GET** `/api/gym-classes` - View all gym classes
- **GET** `/api/gym-classes/{id}` - View specific gym class
- **POST** `/api/gym-classes` - Create new gym class
- **PUT** `/api/gym-classes/{id}` - Update gym class
- **DELETE** `/api/gym-classes/{id}` - Delete gym class
- **PUT** `/api/gym-classes/{id}/status` - Update class status
- **PUT** `/api/gym-classes/{id}/enrollment` - Update enrollment
- **PUT** `/api/gym-classes/{id}/enrollment/increment` - Increment enrollment
- **PUT** `/api/gym-classes/{id}/enrollment/decrement` - Decrement enrollment

### ✅ **Training Sessions Management**
- **GET** `/api/training-sessions` - View all training sessions
- **GET** `/api/training-sessions/{id}` - View specific training session
- **POST** `/api/training-sessions` - Create new training session
- **PUT** `/api/training-sessions/{id}` - Update training session
- **DELETE** `/api/training-sessions/{id}` - Delete training session
- **PUT** `/api/training-sessions/{id}/status` - Update session status
- **PUT** `/api/training-sessions/{id}/reschedule` - Reschedule session

### ✅ **Class Registrations Management**
- **GET** `/api/class-registrations` - View all class registrations
- **GET** `/api/class-registrations/{id}` - View specific registration
- **POST** `/api/class-registrations/register` - Register for class
- **PUT** `/api/class-registrations/{id}/status` - Update registration status
- **PUT** `/api/class-registrations/{id}/cancel` - Cancel registration
- **DELETE** `/api/class-registrations/{id}` - Delete registration
- **PUT** `/api/class-registrations/{id}/attendance` - Mark attendance
- **PUT** `/api/class-registrations/{id}/no-show` - Mark no-show

### ✅ **Payments Management**
- **GET** `/api/payments` - View all payments
- **GET** `/api/payments/{id}` - View specific payment
- **POST** `/api/payments` - Create new payment
- **PUT** `/api/payments/{id}` - Update payment
- **DELETE** `/api/payments/{id}` - Delete payment
- **PUT** `/api/payments/{id}/status` - Update payment status
- **PUT** `/api/payments/{id}/process` - Process payment
- **PUT** `/api/payments/{id}/refund` - Refund payment
- **PUT** `/api/payments/{id}/cancel` - Cancel payment

## 🔧 Issues Fixed

### 1. **Missing UserService Autowiring**
**Problem**: Controllers were referencing `@userService` but UserService wasn't autowired.

**Solution**: Added UserService autowiring to all controllers:
```java
@Autowired
private UserService userService;
```

**Controllers Updated**:
- `MembershipController`
- `PaymentController`
- `TrainingSessionController`
- `GymClassController`
- `ClassRegistrationController`

### 2. **Inconsistent Authorization Patterns**
**Problem**: Some endpoints had inconsistent authorization patterns.

**Solution**: Updated authorization to ensure admin has full access:

**GymClassController**:
```java
// Before: No authorization on some endpoints
@GetMapping
public ResponseEntity<List<GymClass>> getAllGymClasses()

// After: Proper authorization
@GetMapping
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")
public ResponseEntity<List<GymClass>> getAllGymClasses()
```

**TrainingSessionController**:
```java
// Before: Multiple roles could delete
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")

// After: Only admin can delete
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
```

**EquipmentController**:
```java
// Before: Only admin could create/update
@PostMapping
@PreAuthorize("hasRole('ADMIN')")

// After: Admin and staff can create/update
@PostMapping
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
```

## 🛡️ Security Configuration

### Authorization Hierarchy
1. **ADMIN** - Full system access (all CRUD operations)
2. **STAFF** - Management operations (most CRUD, limited delete)
3. **TRAINER** - Training-specific operations
4. **MEMBER** - Limited access (view own data, register for classes)

### Role-based Access Control
```java
// Admin only operations
@PreAuthorize("hasRole('ADMIN')")

// Admin and Staff operations
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")

// Admin, Staff, and Trainer operations
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('TRAINER')")

// User-specific operations (admin can access all, users can access own)
@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or @userService.isCurrentUser(#userId)")
```

## 🧪 Testing Admin Access

### Test Script
Run the admin CRUD test:
```bash
node test-admin-crud.js
```

### Manual Testing
1. **Login as admin**:
   - Username: `admin`
   - Password: `admin123`

2. **Test each module**:
   - Navigate to each management page
   - Try to create, read, update, and delete records
   - Verify all operations work correctly

### Expected Results
✅ **All CRUD operations should work for admin**
✅ **No authorization errors**
✅ **Full access to all modules**
✅ **Ability to manage all users, memberships, equipment, etc.**

## 📊 Admin Dashboard Access

The admin user can access all management pages:

1. **User Management** - `/users`
2. **Membership Management** - `/memberships`
3. **Equipment Management** - `/equipment`
4. **Gym Classes Management** - `/gym-classes`
5. **Training Sessions Management** - `/training-sessions`
6. **Class Registrations Management** - `/class-registrations`
7. **Payments Management** - `/payments`

## 🔍 Troubleshooting

### Common Issues

1. **403 Forbidden Errors**
   - Check if user is logged in as admin
   - Verify JWT token is valid
   - Check backend logs for authorization errors

2. **UserService Errors**
   - Ensure UserService is properly autowired
   - Check if `isCurrentUser` method exists
   - Verify Spring Security configuration

3. **Missing Endpoints**
   - Check if all controllers are properly annotated
   - Verify request mappings are correct
   - Ensure CORS is properly configured

### Debug Steps

1. **Check Backend Logs**:
   ```bash
   # Look for authorization errors
   grep "Access Denied" backend/logs/application.log
   ```

2. **Test Individual Endpoints**:
   ```bash
   # Test with curl
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:8080/api/users
   ```

3. **Verify User Role**:
   ```bash
   # Check user role in database
   SELECT username, role FROM users WHERE username = 'admin';
   ```

## 📝 Best Practices

1. **Always test admin access** after making changes
2. **Use proper authorization annotations** on all endpoints
3. **Keep UserService autowired** in controllers that need it
4. **Test all CRUD operations** for each module
5. **Monitor authorization errors** in logs

---

**Admin now has complete CRUD access to all operations in the Gym Management System!** 🎉 