import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GymClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'YOGA',
    trainerId: '',
    startTime: '',
    endTime: '',
    maxCapacity: '',
    price: '',
    location: '',
    scheduleDays: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchClasses();
    fetchTrainers();
  }, [isAuthenticated, navigate]);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await axios.get('/api/gym-classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to fetch gym classes');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainers(response.data.filter(user => user.role === 'TRAINER'));
    } catch (err) {
      console.error('Failed to fetch trainers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const classData = {
        ...formData,
        scheduleDays: formData.scheduleDays.join(',')
      };

      if (editingClass) {
        await axios.put(`/api/gym-classes/${editingClass.id}`, classData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Gym class updated successfully');
      } else {
        await axios.post('/api/gym-classes', classData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Gym class created successfully');
      }
      setShowModal(false);
      setEditingClass(null);
      resetForm();
      fetchClasses();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (gymClass) => {
    setEditingClass(gymClass);
    setFormData({
      name: gymClass.name,
      description: gymClass.description || '',
      type: gymClass.type,
      trainerId: gymClass.trainer.id,
      startTime: gymClass.startTime,
      endTime: gymClass.endTime,
      maxCapacity: gymClass.maxCapacity,
      price: gymClass.price,
      location: gymClass.location || '',
      scheduleDays: gymClass.scheduleDays ? gymClass.scheduleDays.split(',') : []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gym class?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/gym-classes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Gym class deleted successfully');
        fetchClasses();
      } catch (err) {
        setError('Failed to delete gym class');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/gym-classes/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Class status updated successfully');
      fetchClasses();
    } catch (err) {
      setError('Failed to update class status');
    }
  };

  const handleScheduleDayChange = (day) => {
    const updatedDays = formData.scheduleDays.includes(day)
      ? formData.scheduleDays.filter(d => d !== day)
      : [...formData.scheduleDays, day];
    setFormData({...formData, scheduleDays: updatedDays});
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'YOGA',
      trainerId: '',
      startTime: '',
      endTime: '',
      maxCapacity: '',
      price: '',
      location: '',
      scheduleDays: []
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: 'success',
      INACTIVE: 'secondary',
      CANCELLED: 'danger',
      FULL: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      CARDIO: 'primary',
      STRENGTH: 'warning',
      YOGA: 'info',
      PILATES: 'success',
      SPINNING: 'danger',
      ZUMBA: 'secondary'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Gym Class Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Class
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Trainer</th>
                <th>Status</th>
                <th>Time</th>
                <th>Capacity</th>
                <th>Enrolled</th>
                <th>Price</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((gymClass) => (
                <tr key={gymClass.id}>
                  <td>{gymClass.name}</td>
                  <td>{getTypeBadge(gymClass.type)}</td>
                  <td>{gymClass.trainer.firstName} {gymClass.trainer.lastName}</td>
                  <td>{getStatusBadge(gymClass.status)}</td>
                  <td>{gymClass.startTime} - {gymClass.endTime}</td>
                  <td>{gymClass.maxCapacity}</td>
                  <td>{gymClass.currentEnrollment}/{gymClass.maxCapacity}</td>
                  <td>${gymClass.price}</td>
                  <td>{gymClass.location || 'N/A'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(gymClass)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(gymClass.id)}>
                      Delete
                    </Button>
                    <div className="mt-1">
                      {gymClass.status === 'ACTIVE' && (
                        <Button size="sm" variant="outline-secondary" onClick={() => handleStatusUpdate(gymClass.id, 'INACTIVE')}>
                          Deactivate
                        </Button>
                      )}
                      {gymClass.status === 'INACTIVE' && (
                        <Button size="sm" variant="outline-success" onClick={() => handleStatusUpdate(gymClass.id, 'ACTIVE')}>
                          Activate
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

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingClass(null); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingClass ? 'Edit Gym Class' : 'Add New Gym Class'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Class Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="CARDIO">Cardio</option>
                    <option value="STRENGTH">Strength</option>
                    <option value="YOGA">Yoga</option>
                    <option value="PILATES">Pilates</option>
                    <option value="SPINNING">Spinning</option>
                    <option value="ZUMBA">Zumba</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

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
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Max Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
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

            <Form.Group className="mb-3">
              <Form.Label>Schedule Days</Form.Label>
              <div className="row">
                {daysOfWeek.map((day) => (
                  <div key={day} className="col-md-3 mb-2">
                    <Form.Check
                      type="checkbox"
                      label={day}
                      checked={formData.scheduleDays.includes(day)}
                      onChange={() => handleScheduleDayChange(day)}
                    />
                  </div>
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingClass(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingClass ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default GymClassManagement; 