import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import BoardMember from './components/BoardMember';
import BoardTrainer from './components/BoardTrainer';
import BoardStaff from './components/BoardStaff';
import BoardAdmin from './components/BoardAdmin';

// New management components
import MembershipManagement from './components/MembershipManagement';
import EquipmentManagement from './components/EquipmentManagement';
import TrainingSessionManagement from './components/TrainingSessionManagement';
import GymClassManagement from './components/GymClassManagement';
import ClassRegistrationManagement from './components/ClassRegistrationManagement';
import PaymentManagement from './components/PaymentManagement';
import TestAuth from './components/TestAuth';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test-auth" element={<TestAuth />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Role-based dashboards */}
            <Route path="/member" element={
              <PrivateRoute roles={['MEMBER']}>
                <BoardMember />
              </PrivateRoute>
            } />
            <Route path="/trainer" element={
              <PrivateRoute roles={['TRAINER']}>
                <BoardTrainer />
              </PrivateRoute>
            } />
            <Route path="/staff" element={
              <PrivateRoute roles={['STAFF']}>
                <BoardStaff />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute roles={['ADMIN']}>
                <BoardAdmin />
              </PrivateRoute>
            } />
            
            {/* Management routes - Admin and Staff access */}
            <Route path="/memberships" element={
              <PrivateRoute roles={['ADMIN', 'STAFF']}>
                <MembershipManagement />
              </PrivateRoute>
            } />
            <Route path="/equipment" element={
              <PrivateRoute roles={['ADMIN', 'STAFF']}>
                <EquipmentManagement />
              </PrivateRoute>
            } />
            <Route path="/training-sessions" element={
              <PrivateRoute roles={['ADMIN', 'STAFF', 'TRAINER']}>
                <TrainingSessionManagement />
              </PrivateRoute>
            } />
            <Route path="/gym-classes" element={
              <PrivateRoute roles={['ADMIN', 'STAFF']}>
                <GymClassManagement />
              </PrivateRoute>
            } />
            <Route path="/class-registrations" element={
              <PrivateRoute roles={['ADMIN', 'STAFF', 'TRAINER']}>
                <ClassRegistrationManagement />
              </PrivateRoute>
            } />
            <Route path="/payments" element={
              <PrivateRoute roles={['ADMIN', 'STAFF']}>
                <PaymentManagement />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 