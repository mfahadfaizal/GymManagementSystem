import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Table, Badge, Spinner, Col, Row } from 'react-bootstrap';
import { authAPI, userAPI, membershipAPI, equipmentAPI, gymClassAPI, trainingSessionAPI, classRegistrationAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TestAuth = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, isAuthenticated } = useAuth();

  const runTests = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setTestResults({});

    const results = {};

    try {
      // Test 1: Authentication
      try {
        const authResponse = await authAPI.login({ username: 'admin', password: 'admin123' });
        results.auth = { success: true, data: authResponse.data };
      } catch (err) {
        results.auth = { success: false, error: err.response?.data?.message || err.message };
      }

      // Test 2: Users API
      try {
        const usersResponse = await userAPI.getAll();
        results.users = { success: true, count: usersResponse.data.length };
      } catch (err) {
        results.users = { success: false, error: err.response?.data?.message || err.message };
      }

      // Test 3: Memberships API
      try {
        const membershipsResponse = await membershipAPI.getAll();
        results.memberships = { success: true, count: membershipsResponse.data.length };
      } catch (err) {
        results.memberships = { success: false, error: err.response?.data?.message || err.message };
      }

      // Test 4: Equipment API
      try {
        const equipmentResponse = await equipmentAPI.getAll();
        results.equipment = { success: true, count: equipmentResponse.data.length };
      } catch (err) {
        results.equipment = { success: false, error: err.response?.data?.message || err.message };
      }

      // Test 5: Gym Classes API
      try {
        const classesResponse = await gymClassAPI.getAll();
        results.gymClasses = { success: true, count: classesResponse.data.length };
      } catch (err) {
        results.gymClasses = { success: false, error: err.response?.data?.message || err.message };
      }

      // Test 6: Training Sessions API
      try {
        const sessionsResponse = await trainingSessionAPI.getAll();
        results.trainingSessions = { success: true, count: sessionsResponse.data.length };
      } catch (err) {
        results.trainingSessions = { success: false, error: err.response?.data?.message || err.message };
      }

      // Test 7: Class Registrations API
      try {
        const registrationsResponse = await classRegistrationAPI.getAll();
        results.classRegistrations = { success: true, count: registrationsResponse.data.length };
      } catch (err) {
        results.classRegistrations = { success: false, error: err.response?.data?.message || err.message };
      }

      // Test 8: Payments API
      try {
        const paymentsResponse = await paymentAPI.getAll();
        results.payments = { success: true, count: paymentsResponse.data.length };
      } catch (err) {
        results.payments = { success: false, error: err.response?.data?.message || err.message };
      }

      setTestResults(results);
      setSuccess('API tests completed successfully!');
    } catch (err) {
      setError('Failed to run tests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (success) => {
    return success ? (
      <Badge bg="success">✓ PASS</Badge>
    ) : (
      <Badge bg="danger">✗ FAIL</Badge>
    );
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
        <h4
          style={{
            color: 'white',
            backgroundColor: '#007bff',
            display: 'inline-block',
            padding: '15px 30px',
            borderRadius: '15px',
            textShadow: '2px 2px 4px rgba(255, 0, 0, 0.5)'
          }}
        >API Connectivity Test</h4>
        <p className="mb-0" style={{
          color: 'black',
          textShadow: '2px 2px 4px rgba(255, 0, 0, 0.5)'
        }}>Test all API endpoints to verify system functionality</p>
        <Row className="justify-content-center">
        <Col md={8}>
        <Card>
          <Card.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            <Button
              variant="primary"
              onClick={runTests}
              disabled={loading}
              className="me-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Running Tests...
                </>
              ) : (
                'Run API Tests'
              )}
            </Button>
            <div className="mb-3">

              {isAuthenticated && (
                <span className="text-muted">
                  Logged in as: <strong>{user?.username}</strong> ({user?.role})
                </span>
              )}
            </div>

            {Object.keys(testResults).length > 0 && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>API Endpoint</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Authentication</td>
                    <td>{getStatusBadge(testResults.auth?.success)}</td>
                    <td>
                      {testResults.auth?.success ? (
                        `Token received: ${testResults.auth.data?.accessToken ? 'Yes' : 'No'}`
                      ) : (
                        testResults.auth?.error
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Users API</td>
                    <td>{getStatusBadge(testResults.users?.success)}</td>
                    <td>
                      {testResults.users?.success ? (
                        `${testResults.users.count} users found`
                      ) : (
                        testResults.users?.error
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Memberships API</td>
                    <td>{getStatusBadge(testResults.memberships?.success)}</td>
                    <td>
                      {testResults.memberships?.success ? (
                        `${testResults.memberships.count} memberships found`
                      ) : (
                        testResults.memberships?.error
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Equipment API</td>
                    <td>{getStatusBadge(testResults.equipment?.success)}</td>
                    <td>
                      {testResults.equipment?.success ? (
                        `${testResults.equipment.count} equipment items found`
                      ) : (
                        testResults.equipment?.error
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Gym Classes API</td>
                    <td>{getStatusBadge(testResults.gymClasses?.success)}</td>
                    <td>
                      {testResults.gymClasses?.success ? (
                        `${testResults.gymClasses.count} classes found`
                      ) : (
                        testResults.gymClasses?.error
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Training Sessions API</td>
                    <td>{getStatusBadge(testResults.trainingSessions?.success)}</td>
                    <td>
                      {testResults.trainingSessions?.success ? (
                        `${testResults.trainingSessions.count} sessions found`
                      ) : (
                        testResults.trainingSessions?.error
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Class Registrations API</td>
                    <td>{getStatusBadge(testResults.classRegistrations?.success)}</td>
                    <td>
                      {testResults.classRegistrations?.success ? (
                        `${testResults.classRegistrations.count} registrations found`
                      ) : (
                        testResults.classRegistrations?.error
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Payments API</td>
                    <td>{getStatusBadge(testResults.payments?.success)}</td>
                    <td>
                      {testResults.payments?.success ? (
                        `${testResults.payments.count} payments found`
                      ) : (
                        testResults.payments?.error
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}

            <div className="mt-3">
              <h6>Test Credentials:</h6>
              <ul className="list-unstyled">
                <li><strong>Admin:</strong> admin/admin123</li>
                <li><strong>Staff:</strong> staff/staff123</li>
                <li><strong>Trainer:</strong> trainer/trainer123</li>
                <li><strong>Member:</strong> member/member123</li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Col>
      </Row>
      </Container>
    </div>
  );
};

export default TestAuth; 