import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url('/assets/images/4.jpg')`,  // Ensure gym.jpg is in public/assets/images/
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="mt-5">
              <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="shadow">
                <Card.Header style={{ backgroundColor: '#F44336' }}>
                  <h3 className="text-center mb-0 text-white">Login to Gym Management</h3>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  
                  <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={loading}
                      style={{ backgroundColor: '#F44336', borderColor: '#F44336' }}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Form>

                  <div className="text-center mt-3" style={{ fontFamily: "'Rubik', sans-serif" }}>
                    <p>
                      Don't have an account?{' '}
                      <Link to="/register" style={{ color: '#F44336', fontWeight: '600', textDecoration: 'none' }}>
                        Register here
                      </Link>
                    </p>
                  </div>

                  <div className="mt-4">
                    <h6>Sample Users:</h6>
                    <div className="small text-muted">
                      <div>Admin: admin / admin123</div>
                      <div>Trainer: trainer / trainer123</div>
                      <div>Staff: staff / staff123</div>
                      <div>Member: member / member123</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
