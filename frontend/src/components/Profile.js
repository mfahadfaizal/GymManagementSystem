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
    <Container className="mt-4">
      <h2>User Profile</h2>
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
  );
};

export default Profile; 