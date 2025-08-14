import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import { classRegistrationAPI, gymClassAPI, membershipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClassRegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    memberId: '',
    gymClassId: '',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchRegistrations();
    fetchClasses();
    fetchMembers();
  }, [isAuthenticated, navigate]);

  const fetchRegistrations = async () => {
    try {
      const response = await classRegistrationAPI.getAll();
      setRegistrations(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to fetch class registrations');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await gymClassAPI.getAll();
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes');
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await membershipAPI.getAll();
      const memberships = response.data;

      // Extract unique users with active or valid memberships
      const seen = new Set();
      const uniqueMembers = [];

      memberships.forEach(m => {
        const user = m.user;
        if (user && !seen.has(user.id)) {
          seen.add(user.id);
          uniqueMembers.push(user);
        }
      });

      setMembers(uniqueMembers);
    } catch (err) {
      console.error('Failed to fetch members from memberships');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await classRegistrationAPI.registerForClass(formData.memberId, formData.gymClassId);
      setSuccess('Registration created successfully');
      setShowModal(false);
      setEditingRegistration(null);
      resetForm();
      fetchRegistrations();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  const handleEdit = (registration) => {
    setEditingRegistration(registration);
    setFormData({
      memberId: registration.member.id,
      gymClassId: registration.gymClass.id,
      notes: registration.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await classRegistrationAPI.delete(id);
        setSuccess('Registration deleted successfully');
        fetchRegistrations();
        fetchClasses();
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Authentication required. Please login again.');
          navigate('/login');
        } else {
          setError('Failed to delete registration');
        }
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await classRegistrationAPI.updateStatus(id, status);
      setSuccess('Registration status updated successfully');
      fetchRegistrations();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to update registration status');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      gymClassId: '',
      notes: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      REGISTERED: 'primary',
      ATTENDED: 'success',
      NO_SHOW: 'danger',
      CANCELLED: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Class Registration Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Register Member for Class
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Member</th>
                <th>Class</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Attendance Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id}>
                  <td>{registration.member.firstName} {registration.member.lastName}</td>
                  <td>{registration.gymClass.name} ({registration.gymClass.type})</td>
                  <td>{getStatusBadge(registration.status)}</td>
                  <td>{new Date(registration.registrationDate).toLocaleDateString()}</td>
                  <td>{registration.attendanceDate ? new Date(registration.attendanceDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{registration.notes || 'N/A'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(registration)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(registration.id)}>
                      Delete
                    </Button>
                    <div className="mt-1">
                      {registration.status === 'REGISTERED' && (
                        <>
                          <Button size="sm" variant="outline-success" onClick={() => handleStatusUpdate(registration.id, 'ATTENDED')}>
                            Mark Attended
                          </Button>
                          <Button size="sm" variant="outline-danger" className="ms-1" onClick={() => handleStatusUpdate(registration.id, 'NO_SHOW')}>
                            No Show
                          </Button>
                          <Button size="sm" variant="outline-warning" className="ms-1" onClick={() => handleStatusUpdate(registration.id, 'CANCELLED')}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>


      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingRegistration(null); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRegistration ? 'Edit Registration' : 'Register Member for Class'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Member</Form.Label>
                  <Form.Select
                    value={formData.memberId}
                    onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                    required
                  >
                    <option value="">Select Member</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.firstName} {member.lastName} ({member.username})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    value={formData.gymClassId}
                    onChange={(e) => setFormData({...formData, gymClassId: e.target.value})}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(gymClass => (
                      <option key={gymClass.id} value={gymClass.id}>
                        {gymClass.name} ({gymClass.type}) - {gymClass.currentEnrollment}/{gymClass.maxCapacity}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingRegistration(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingRegistration ? 'Update' : 'Register'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassRegistrationManagement; 