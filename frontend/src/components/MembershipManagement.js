import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import { membershipAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MembershipManagement = () => {
  const [memberships, setMemberships] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    type: 'MONTHLY',
    price: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchMemberships();
    fetchUsers();
  }, [isAuthenticated, navigate]);

  const fetchMemberships = async () => {
    try {
      const response = await membershipAPI.getAll();
      setMemberships(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to fetch memberships');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMembership) {
        await membershipAPI.update(editingMembership.id, formData);
        setSuccess('Membership updated successfully');
      } else {
        await membershipAPI.create(formData);
        setSuccess('Membership created successfully');
      }
      setShowModal(false);
      setEditingMembership(null);
      resetForm();
      fetchMemberships();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (membership) => {
    setEditingMembership(membership);
    setFormData({
      userId: membership.user.id,
      type: membership.type,
      price: membership.price,
      startDate: membership.startDate.split('T')[0],
      endDate: membership.endDate.split('T')[0],
      description: membership.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this membership?')) {
      try {
        await membershipAPI.delete(id);
        setSuccess('Membership deleted successfully');
        fetchMemberships();
      } catch (err) {
        setError('Failed to delete membership');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      type: 'BASIC',
      price: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: 'success',
      EXPIRED: 'danger',
      CANCELLED: 'warning',
      PENDING: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      BASIC: 'primary',
      PREMIUM: 'warning',
      VIP: 'danger',
      STUDENT: 'info'
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
          <h4>Membership Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Membership
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Member</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id}>
                  <td>{membership.user.firstName} {membership.user.lastName}</td>
                  <td>{getTypeBadge(membership.type)}</td>
                  <td>{getStatusBadge(membership.status)}</td>
                  <td>${membership.price}</td>
                  <td>{new Date(membership.startDate).toLocaleDateString()}</td>
                  <td>{new Date(membership.endDate).toLocaleDateString()}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(membership)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(membership.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingMembership(null); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMembership ? 'Edit Membership' : 'Add New Membership'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Member</Form.Label>
              <Form.Select
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                required
              >
                <option value="">Select Member</option>
                {users.filter(user => user.role === 'MEMBER').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.username})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
                <option value="VIP">VIP</option>
                <option value="STUDENT">Student</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingMembership(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingMembership ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MembershipManagement; 