import React from 'react';
import { Card, Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';  



const BoardMember = () => {
  return (
    <div
    style={{
      minHeight: '100vh',
      backgroundImage: `url('/assets/images/4.jpg')`,  // Path to your gym.jpg in public/assets/images/
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      padding: '2rem'
    }}
  >
    <Container className="mt-4">
      <h2
        style={{ 
          color: 'white', 
          backgroundColor: '#007bff', 
          display: 'inline-block', 
          padding: '15px 30px', 
          borderRadius: '15px',
          textShadow: '2px 2px 4px rgba(255, 0, 0, 0.5)' 
        }}
      >Member Dashboard</h2>
      <p className="text-muted"
        style={{ 
            color: 'black',
            textShadow: '2px 2px 4px rgba(255, 0, 0, 0.5)' 
        }}
      >Welcome to your member dashboard. Here you can manage your gym activities.</p>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>📊 My Progress</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Current Weight:</strong> 75 kg
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Target Weight:</strong> 70 kg
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Workouts This Month:</strong> 12
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Membership Status:</strong>
                  <span className="badge bg-success ms-2">Active</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>📅 Upcoming Sessions</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Today:</strong> Cardio Training (2:00 PM)
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Tomorrow:</strong> Strength Training (10:00 AM)
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Friday:</strong> Yoga Class (6:00 PM)
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
              <h5>💪 Book Training</h5>
              <p>Schedule a session with our trainers</p>
              <Button variant="primary" as={Link} to="/book-session">
                Book Session
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>📋 View Schedule</h5>
              <p>Check your workout schedule</p>
              <Button variant="info" as={Link} to="/gym-classes">View Classes</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>📈 Progress Report</h5>
              <p>Track your fitness progress</p>
              <Button variant="success" as={Link} to="/class-registrations">View Registrations</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>🏋️ My Activities</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Training Sessions</h6>
                      <p>View your scheduled training sessions</p>
                      <Button size="sm" variant="outline-primary" as={Link} to="/training-sessions">
                        View Sessions
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Class Registrations</h6>
                      <p>Check your class enrollments</p>
                      <Button size="sm" variant="outline-info" as={Link} to="/class-registrations">
                        View Registrations
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Gym Classes</h6>
                      <p>Browse available gym classes</p>
                      <Button size="sm" variant="outline-success" as={Link} to="/gym-classes">
                        View Classes
                      </Button>
                    </Card.Body>
                  </Card>
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

export default BoardMember; 