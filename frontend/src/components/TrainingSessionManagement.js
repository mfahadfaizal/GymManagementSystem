import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import { trainingSessionAPI, userAPI, membershipAPI } from '../services/api';
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
  }, [isAuthenticated]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response =
        user.role === 'TRAINER'
          ? await trainingSessionAPI.getByTrainer(user.id)
          : await trainingSessionAPI.getAll();
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
      if (user.role === 'TRAINER') {
        const response = await membershipAPI.getAll();
        const memberships = response.data;

        const uniqueMembers = [];
        const memberMap = new Map();

        memberships.forEach(m => {
          const member = m.user || m.member;
          if (member && !memberMap.has(member.id)) {
            memberMap.set(member.id, member);
            uniqueMembers.push(member);
          }
        });

        setMembers(uniqueMembers);
        setTrainers([user]);
      } else {
        const response = await userAPI.getAll();
        const users = response.data;
        setTrainers(users.filter(u => u.role === 'TRAINER'));
        setMembers(users.filter(u => u.role === 'MEMBER'));
      }
    } catch (err) {
      console.error('Failed to fetch users or memberships', err);
      setError('Failed to load users or memberships');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionData = {
        ...formData,
        trainerId: Number(formData.trainerId),
        memberId: Number(formData.memberId),
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        duration: Number(formData.duration),
        price: Number(formData.price),
        status: 'SCHEDULED'
      };

      if (editingSession) {
        await trainingSessionAPI.update(editingSession.id, sessionData);
        setSuccess('Training session updated successfully');
      } else {
        await trainingSessionAPI.createAsStaff(sessionData);
        setSuccess('Training session created successfully');
      }

      setShowModal(false);
      setEditingSession(null);
      resetForm();
      fetchSessions();
    } catch (err) {
      console.error('Failed to submit session:', err);
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (session) => {
    if (user.role === 'TRAINER' && session.trainer.id !== user.id) {
      setError('You can only edit your own sessions');
      return;
    }

    setEditingSession(session);
    setFormData({
      trainerId: String(session.trainer.id),
      memberId: String(session.member.id),
      type: session.type,
      scheduledDate: session.scheduledDate.slice(0, 16),
      duration: session.duration,
      price: session.price,
      notes: session.notes || '',
      location: session.location || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id, trainerId) => {
    if (user.role === 'TRAINER' && trainerId !== user.id) {
      setError('You can only delete your own sessions');
      return;
    }

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
      trainerId: user.role === 'TRAINER' ? String(user.id) : '',
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
      PERSONAL_TRAINING: 'primary',
      GROUP_TRAINING: 'success',
      ASSESSMENT: 'warning',
      CONSULTATION: 'info',
      NUTRITION_COUNSELING: 'secondary'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type.replace(/_/g, ' ')}</Badge>;
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Training Session Management</h4>
          <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Schedule New Session
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

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
                  <td>{session.duration} mins</td>
                  <td>${session.price}</td>
                  <td>{session.location || 'N/A'}</td>
                  <td>
                    {(user.role !== 'TRAINER' || session.trainer.id === user.id) && (
                      <>
                        <Button size="sm" variant="outline-primary" onClick={() => handleEdit(session)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(session.id, session.trainer.id)}>Delete</Button>
                      </>
                    )}
                    <div className="mt-1">
                      {session.status === 'SCHEDULED' && (
                        <>
                          <Button size="sm" variant="outline-warning" onClick={() => handleStatusUpdate(session.id, 'IN_PROGRESS')}>Start</Button>
                          <Button size="sm" variant="outline-danger" className="ms-1" onClick={() => handleStatusUpdate(session.id, 'CANCELLED')}>Cancel</Button>
                        </>
                      )}
                      {session.status === 'IN_PROGRESS' && (
                        <Button size="sm" variant="outline-success" onClick={() => handleStatusUpdate(session.id, 'COMPLETED')}>Complete</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingSession(null); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingSession ? 'Edit Training Session' : 'Schedule New Training Session'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              {user.role !== 'TRAINER' && (
                <div className="col-md-6">
                  <Form.Group className="mb-3" controlId="trainerSelect">
                    <Form.Label>Trainer</Form.Label>
                    <Form.Select
                      value={formData.trainerId}
                      onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                      required
                    >
                      <option value="">Select Trainer</option>
                      {trainers.map((trainer) => (
                        <option key={trainer.id} value={String(trainer.id)}>
                          {trainer.firstName} {trainer.lastName} ({trainer.username})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              )}
              <div className={`col-md-${user.role === 'TRAINER' ? 12 : 6}`}>
                <Form.Group className="mb-3" controlId="memberSelect">
                  <Form.Label>Member</Form.Label>
                  <Form.Select
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    required
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={String(member.id)}>
                        {member.firstName} {member.lastName} ({member.username})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="sessionType">
                  <Form.Label>Session Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="PERSONAL_TRAINING">Personal Training</option>
                    <option value="GROUP_TRAINING">Group Training</option>
                    <option value="ASSESSMENT">Assessment</option>
                    <option value="CONSULTATION">Consultation</option>
                    <option value="NUTRITION_COUNSELING">Nutrition Counseling</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="scheduledDate">
                  <Form.Label>Scheduled Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="duration">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
