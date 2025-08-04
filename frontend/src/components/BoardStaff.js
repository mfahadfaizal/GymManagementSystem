import React from 'react';
import { Card, Container, Row, Col, Button, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BoardStaff = () => {
  return (
    <Container className="mt-4">
      <h2>Staff Dashboard</h2>
      <p className="text-muted">Manage gym operations and member services.</p>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>👥 Member Management</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>New Members Today:</strong> 3
                  <Badge bg="success" className="ms-2">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Membership Renewals:</strong> 5
                  <Badge bg="warning" className="ms-2">Pending</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Equipment Maintenance:</strong> 2
                  <Badge bg="danger" className="ms-2">Urgent</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Facility Status:</strong> 
                  <Badge bg="success" className="ms-2">All Operational</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>📅 Today's Tasks</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>9:00 AM:</strong> Equipment Check
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>11:00 AM:</strong> Member Registration
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>2:00 PM:</strong> Facility Cleaning
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>4:00 PM:</strong> Inventory Check
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>👤 Member Registration</h5>
              <p>Register new members and manage memberships</p>
              <Button variant="primary" as={Link} to="/memberships">Manage Memberships</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>🔧 Equipment Management</h5>
              <p>Monitor and maintain gym equipment</p>
              <Button variant="info" as={Link} to="/equipment">Manage Equipment</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>📋 Facility Management</h5>
              <p>Manage gym facilities and schedules</p>
              <Button variant="success" as={Link} to="/gym-classes">Manage Classes</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>🏋️ Gym Operations</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Memberships</h6>
                      <p>Manage member subscriptions</p>
                      <Button size="sm" variant="outline-primary" as={Link} to="/memberships">
                        Manage Memberships
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Equipment</h6>
                      <p>Track gym equipment</p>
                      <Button size="sm" variant="outline-warning" as={Link} to="/equipment">
                        Manage Equipment
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Gym Classes</h6>
                      <p>Manage group classes</p>
                      <Button size="sm" variant="outline-success" as={Link} to="/gym-classes">
                        Manage Classes
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Payments</h6>
                      <p>Process payments and invoices</p>
                      <Button size="sm" variant="outline-danger" as={Link} to="/payments">
                        Manage Payments
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>📊 Gym Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h4>150</h4>
                    <p>Total Members</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>85%</h4>
                    <p>Equipment Status</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>12</h4>
                    <p>Available Classes</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>95%</h4>
                    <p>Member Satisfaction</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>🚨 Alerts & Notifications</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="text-danger">
                  <strong>⚠️ Equipment Alert:</strong> Treadmill #3 needs maintenance
                </ListGroup.Item>
                <ListGroup.Item className="text-warning">
                  <strong>📅 Schedule:</strong> Yoga class room needs cleaning
                </ListGroup.Item>
                <ListGroup.Item className="text-info">
                  <strong>👥 Member:</strong> New member registration pending approval
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BoardStaff; 