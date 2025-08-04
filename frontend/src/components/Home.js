import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <div className="welcome-section">
        <Container>
          <h1>Welcome to Gym Management System</h1>
          <p>A comprehensive solution for managing gym operations with role-based access control</p>
        </Container>
      </div>

      <Container>
        {isAuthenticated ? (
          <div>
            <h2 className="mb-4">Dashboard</h2>
            <Row>
              <Col md={3}>
                <Card className="dashboard-card h-100">
                  <Card.Body className="text-center">
                    <h5>Profile</h5>
                    <p>View and update your profile information</p>
                    <Button variant="primary" onClick={() => navigate('/profile')}>
                      View Profile
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              
              {user?.role === 'MEMBER' && (
                <Col md={3}>
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <h5>Member Dashboard</h5>
                      <p>Access member-specific features and services</p>
                      <Button variant="success" onClick={() => navigate('/member')}>
                        Member Area
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )}
              
              {user?.role === 'TRAINER' && (
                <Col md={3}>
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <h5>Trainer Dashboard</h5>
                      <p>Manage training sessions and member progress</p>
                      <Button variant="success" onClick={() => navigate('/trainer')}>
                        Trainer Area
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )}
              
              {user?.role === 'STAFF' && (
                <Col md={3}>
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <h5>Staff Dashboard</h5>
                      <p>Handle gym operations and member services</p>
                      <Button variant="warning" onClick={() => navigate('/staff')}>
                        Staff Area
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )}
              
              {user?.role === 'ADMIN' && (
                <Col md={3}>
                  <Card className="dashboard-card h-100">
                    <Card.Body className="text-center">
                      <h5>Admin Dashboard</h5>
                      <p>Full system administration and management</p>
                      <Button variant="danger" onClick={() => navigate('/admin')}>
                        Admin Area
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <div className="text-center">
            <h2>Get Started</h2>
            <p className="lead">Please login or register to access the gym management system.</p>
            <div className="mt-4">
              <Button variant="primary" size="lg" className="me-3" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="outline-primary" size="lg" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home; 