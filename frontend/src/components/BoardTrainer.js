import React from 'react';
import { Card, Container, Row, Col, Button, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BoardTrainer = () => {
  return (
    <Container className="mt-4">
      <h2>Trainer Dashboard</h2>
      <p className="text-muted">Manage your training sessions and member progress.</p>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>👥 My Clients</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>John Doe</strong> - Weight Loss Program
                  <Badge bg="success" className="ms-2">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Jane Smith</strong> - Strength Training
                  <Badge bg="success" className="ms-2">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Mike Johnson</strong> - Cardio Fitness
                  <Badge bg="warning" className="ms-2">Pending</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>📅 Today's Schedule</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>9:00 AM:</strong> John Doe - Weight Training
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>11:00 AM:</strong> Jane Smith - Cardio Session
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>2:00 PM:</strong> Mike Johnson - Fitness Assessment
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>4:00 PM:</strong> Group Training Session
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
              <h5>📝 Create Workout Plan</h5>
              <p>Design personalized workout plans for clients</p>
              <Button variant="primary" as={Link} to="/training-sessions">Manage Sessions</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>📊 Progress Tracking</h5>
              <p>Monitor client progress and achievements</p>
              <Button variant="info" as={Link} to="/class-registrations">View Registrations</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>📅 Schedule Management</h5>
              <p>Manage your training schedule</p>
              <Button variant="success" as={Link} to="/training-sessions">Manage Schedule</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>🏋️ Training Management</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Training Sessions</h6>
                      <p>Schedule and manage personal training sessions</p>
                      <Button size="sm" variant="outline-primary" as={Link} to="/training-sessions">
                        Manage Sessions
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Class Registrations</h6>
                      <p>Track class enrollments and attendance</p>
                      <Button size="sm" variant="outline-info" as={Link} to="/class-registrations">
                        Manage Registrations
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
              <h5>📈 Performance Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h4>15</h4>
                    <p>Active Clients</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>45</h4>
                    <p>Sessions This Month</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>4.8</h4>
                    <p>Average Rating</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>92%</h4>
                    <p>Client Satisfaction</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BoardTrainer; 