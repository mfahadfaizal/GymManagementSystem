import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import { trainingSessionAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TrainingSessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trainerId: '',
    memberId: '',
    type: 'PERSONAL_TRAINING',
    scheduledDate: '',
    duration: 60,
    price: '',
    notes: '',
    location: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchSessions();
    fetchUsers();
  }, [isAuthenticated, navigate]);

  const fetchSessions = async () => {
    try {
      const response = await trainingSessionAPI.getAll();
      setSessions(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to fetch training sessions');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setTrainers(response.data.filter(user => user.role === 'TRAINER'));
      setMembers(response.data.filter(user => user.role === 'MEMBER'));
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionData = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString()
      };

      if (editingSession) {
        await trainingSessionAPI.update(editingSession.id, sessionData);
        setSuccess('Training session updated successfully');
      } else {
        await trainingSessionAPI.create(sessionData);
        setSuccess('Training session created successfully');
      }
      setShowModal(false);
      setEditingSession(null);
      resetForm();
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      trainerId: session.trainer.id,
      memberId: session.member.id,
      type: session.type,
      scheduledDate: session.scheduledDate.split('T')[0],
      duration: session.duration,
      price: session.price,
      notes: session.notes || '',
      location: session.location || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this training session?')) {
      try {
        await trainingSessionAPI.delete(id);
        setSuccess('Training session deleted successfully');
        fetchSessions();
      } catch (err) {
        setError('Failed to delete training session');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await trainingSessionAPI.updateStatus(id, status);
      setSuccess('Session status updated successfully');
      fetchSessions();
    } catch (err) {
      setError('Failed to update session status');
    }
  };

  const resetForm = () => {
    setFormData({
      trainerId: '',
      memberId: '',
      type: 'PERSONAL_TRAINING',
      scheduledDate: '',
      duration: 60,
      price: '',
      notes: '',
      location: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      SCHEDULED: 'primary',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'danger',
      NO_SHOW: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      PERSONAL: 'primary',
      GROUP: 'success',
      ASSESSMENT: 'warning',
      NUTRITION: 'info'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Training Session Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Schedule New Session
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Member</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.trainer.firstName} {session.trainer.lastName}</td>
                  <td>{session.member.firstName} {session.member.lastName}</td>
                  <td>{getTypeBadge(session.type)}</td>
                  <td>{getStatusBadge(session.status)}</td>
                  <td>{new Date(session.scheduledDate).toLocaleString()}</td>
                  <td>{session.duration} minutes</td>
                  <td>${session.price}</td>
                  <td>{session.location || 'N/A'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(session)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(session.id)}>
                      Delete
                    </Button>
                    <div className="mt-1">
                      {session.status === 'SCHEDULED' && (
                        <>
                          <Button size="sm" variant="outline-warning" onClick={() => handleStatusUpdate(session.id, 'IN_PROGRESS')}>
                            Start
                          </Button>
                          <Button size="sm" variant="outline-danger" className="ms-1" onClick={() => handleStatusUpdate(session.id, 'CANCELLED')}>
                            Cancel
                          </Button>
                        </>
                      )}
                      {session.status === 'IN_PROGRESS' && (
                        <Button size="sm" variant="outline-success" onClick={() => handleStatusUpdate(session.id, 'COMPLETED')}>
                          Complete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingSession(null); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingSession ? 'Edit Training Session' : 'Schedule New Training Session'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Trainer</Form.Label>
                  <Form.Select
                    value={formData.trainerId}
                    onChange={(e) => setFormData({...formData, trainerId: e.target.value})}
                    required
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map(trainer => (
                      <option key={trainer.id} value={trainer.id}>
                        {trainer.firstName} {trainer.lastName} ({trainer.username})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
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
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Session Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="PERSONAL">Personal Training</option>
                    <option value="GROUP">Group Training</option>
                    <option value="ASSESSMENT">Assessment</option>
                    <option value="NUTRITION">Nutrition Consultation</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Scheduled Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
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
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingSession(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingSession ? 'Update' : 'Schedule'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainingSessionManagement; 