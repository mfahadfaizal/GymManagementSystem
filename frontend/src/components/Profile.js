import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';


const Profile = () => {
  const { user } = useAuth();

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-danger';
      case 'TRAINER':
        return 'bg-success';
      case 'STAFF':
        return 'bg-warning text-dark';
      case 'MEMBER':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  return (
    
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url('/assets/images/4.jpg')`,  // Path to your gym.jpg in public/assets/images/
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '1rem'
      }}
    >
    <Container className="mt-4">
  <h2 style={{color: 'white', 
          backgroundColor: '#007bff', 
          display: 'inline-block', 
          padding: '15px 30px', 
          borderRadius: '15px',
          textShadow: '2px 2px 4px rgba(255, 0, 0, 0.5)'}}>User Profile</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4>Profile Information</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>First Name:</strong> {user?.firstName}</p>
                  <p><strong>Last Name:</strong> {user?.lastName}</p>
                  <p><strong>Username:</strong> {user?.username}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>User ID:</strong> {user?.id}</p>
                  <p><strong>Role:</strong> 
                    <Badge className={`ms-2 ${getRoleBadgeClass(user?.role)}`}>
                      {user?.role}
                    </Badge>
                  </p>
                  <p><strong>Account Status:</strong> 
                    <Badge bg="success" className="ms-2">Active</Badge>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Profile; 