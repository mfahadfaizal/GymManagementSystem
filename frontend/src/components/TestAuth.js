import React, { useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TestAuth = () => {
  const [testResult, setTestResult] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();

  const testAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      const response = await axios.get('/api/test/auth', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestResult(response.data);
      setError('');
    } catch (err) {
      console.error('Auth test error:', err);
      setError(`Error: ${err.response?.status} - ${err.response?.data || err.message}`);
      setTestResult('');
    }
  };

  const testPublic = async () => {
    try {
      const response = await axios.get('/api/test/all');
      setTestResult(response.data);
      setError('');
    } catch (err) {
      setError(`Error: ${err.response?.status} - ${err.response?.data || err.message}`);
      setTestResult('');
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4>Authentication Test</h4>
        </Card.Header>
        <Card.Body>
          <p><strong>Authentication Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
          {user && (
            <p><strong>User:</strong> {user.username} ({user.role})</p>
          )}
          
          <div className="mb-3">
            <Button onClick={testPublic} variant="outline-primary" className="me-2">
              Test Public Endpoint
            </Button>
            <Button onClick={testAuth} variant="primary">
              Test Authentication
            </Button>
          </div>

          {testResult && (
            <Alert variant="success">
              <strong>Success:</strong> {testResult}
            </Alert>
          )}

          {error && (
            <Alert variant="danger">
              <strong>Error:</strong> {error}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestAuth; 