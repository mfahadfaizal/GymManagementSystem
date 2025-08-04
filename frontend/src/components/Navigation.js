import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'role-badge-admin';
      case 'TRAINER':
        return 'role-badge-trainer';
      case 'STAFF':
        return 'role-badge-staff';
      case 'MEMBER':
        return 'role-badge-member';
      default:
        return 'role-badge';
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">🏋️ Gym Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                  Profile
                </Nav.Link>
                
                {/* Role-based dashboard links */}
                {user?.role === 'MEMBER' && (
                  <Nav.Link as={Link} to="/member" className={location.pathname === '/member' ? 'active' : ''}>
                    Member Dashboard
                  </Nav.Link>
                )}
                {user?.role === 'TRAINER' && (
                  <Nav.Link as={Link} to="/trainer" className={location.pathname === '/trainer' ? 'active' : ''}>
                    Trainer Dashboard
                  </Nav.Link>
                )}
                {user?.role === 'STAFF' && (
                  <Nav.Link as={Link} to="/staff" className={location.pathname === '/staff' ? 'active' : ''}>
                    Staff Dashboard
                  </Nav.Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                    Admin Dashboard
                  </Nav.Link>
                )}

                {/* Management links based on role */}
                {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                  <>
                    <Nav.Link as={Link} to="/memberships" className={location.pathname === '/memberships' ? 'active' : ''}>
                      Memberships
                    </Nav.Link>
                    <Nav.Link as={Link} to="/equipment" className={location.pathname === '/equipment' ? 'active' : ''}>
                      Equipment
                    </Nav.Link>
                    <Nav.Link as={Link} to="/gym-classes" className={location.pathname === '/gym-classes' ? 'active' : ''}>
                      Classes
                    </Nav.Link>
                    <Nav.Link as={Link} to="/payments" className={location.pathname === '/payments' ? 'active' : ''}>
                      Payments
                    </Nav.Link>
                  </>
                )}
                
                {(user?.role === 'ADMIN' || user?.role === 'STAFF' || user?.role === 'TRAINER') && (
                  <>
                    <Nav.Link as={Link} to="/training-sessions" className={location.pathname === '/training-sessions' ? 'active' : ''}>
                      Training Sessions
                    </Nav.Link>
                    <Nav.Link as={Link} to="/class-registrations" className={location.pathname === '/class-registrations' ? 'active' : ''}>
                      Registrations
                    </Nav.Link>
                  </>
                )}

                {/* Debug link */}
                <Nav.Link as={Link} to="/test-auth" className={location.pathname === '/test-auth' ? 'active' : ''}>
                  Test Auth
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <span className="navbar-text me-3">
                  Welcome, {user?.firstName} {user?.lastName}
                  <span className={`ms-2 ${getRoleBadgeClass(user?.role)}`}>
                    {user?.role}
                  </span>
                </span>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 