import React from 'react';
import { Card, Container, Row, Col, Button, ListGroup, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BoardAdmin = () => {
  return (<div
    style={{
      minHeight: '100vh',
      backgroundImage: `url('/assets/images/4.jpg')`,  // Ensure gym.jpg is in public/assets/images/
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      padding: '2rem',
    }}>
    <Container className="mt-4" >
      <h2 >Admin Dashboard</h2>
      <p className="text-muted">Full system administration and management.</p>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>👥 User Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Total Users:</strong> 150 <Badge bg="info" className="ms-2">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Members:</strong> 120 <Badge bg="success" className="ms-2">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Trainers:</strong> 8 <Badge bg="primary" className="ms-2">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Staff:</strong> 12 <Badge bg="warning" className="ms-2">Active</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Admins:</strong> 3 <Badge bg="danger" className="ms-2">Active</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>📊 System Statistics</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Revenue This Month:</strong> $45,000 <Badge bg="success" className="ms-2">+12%</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>New Memberships:</strong> 25 <Badge bg="info" className="ms-2">This Month</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>System Uptime:</strong> 99.9% <Badge bg="success" className="ms-2">Excellent</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Active Sessions:</strong> 45 <Badge bg="primary" className="ms-2">Current</Badge>
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
              <h5>📄 Membership Management</h5>
              <p>Manage all gym member subscriptions</p>
              <Button variant="primary" as={Link} to="/memberships">Manage Memberships</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>💰 Financial Reports</h5>
              <p>View and process all payments</p>
              <Button variant="info" as={Link} to="/payments">View Reports</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>⚙️ System Settings</h5>
              <p>Configure application settings</p>
              <Button variant="success" disabled>Coming Soon</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>🏋️ Gym Management</h5>
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
                      <p>Track and update gym equipment</p>
                      <Button size="sm" variant="outline-warning" as={Link} to="/equipment">
                        Manage Equipment
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Training Sessions</h6>
                      <p>Schedule and assign trainers</p>
                      <Button size="sm" variant="outline-info" as={Link} to="/training-sessions">
                        Manage Sessions
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Gym Classes</h6>
                      <p>Organize group workouts</p>
                      <Button size="sm" variant="outline-success" as={Link} to="/gym-classes">
                        Manage Classes
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Class Registrations</h6>
                      <p>Track who enrolled in what</p>
                      <Button size="sm" variant="outline-secondary" as={Link} to="/class-registrations">
                        Manage Registrations
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="text-center mb-3">
                    <Card.Body>
                      <h6>Payments</h6>
                      <p>View invoices and receipts</p>
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
              <h5>📈 Revenue Analytics</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h4>$45,000</h4>
                    <p>Monthly Revenue</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>$12,500</h4>
                    <p>Weekly Revenue</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>25</h4>
                    <p>New Members</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4>95%</h4>
                    <p>Retention Rate</p>
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
              <h5>🔐 Security Overview</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Security Metric</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Database Security</td>
                    <td><Badge bg="success">Secure</Badge></td>
                    <td>2 hours ago</td>
                    <td><Button size="sm" variant="outline-primary">View Details</Button></td>
                  </tr>
                  <tr>
                    <td>API Security</td>
                    <td><Badge bg="success">Secure</Badge></td>
                    <td>1 hour ago</td>
                    <td><Button size="sm" variant="outline-primary">View Details</Button></td>
                  </tr>
                  <tr>
                    <td>User Authentication</td>
                    <td><Badge bg="success">Active</Badge></td>
                    <td>30 minutes ago</td>
                    <td><Button size="sm" variant="outline-primary">View Details</Button></td>
                  </tr>
                  <tr>
                    <td>Backup Status</td>
                    <td><Badge bg="success">Up to Date</Badge></td>
                    <td>6 hours ago</td>
                    <td><Button size="sm" variant="outline-primary">View Details</Button></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>🚨 System Alerts</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="text-info">
                  <strong>ℹ️ Information:</strong> System backup completed successfully
                </ListGroup.Item>
                <ListGroup.Item className="text-warning">
                  <strong>⚠️ Warning:</strong> High memory usage detected
                </ListGroup.Item>
                <ListGroup.Item className="text-success">
                  <strong>✅ Success:</strong> All services running normally
                </ListGroup.Item>
                <ListGroup.Item className="text-info">
                  <strong>📊 Report:</strong> Monthly analytics report ready
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default BoardAdmin;
