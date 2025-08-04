import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    type: 'MEMBERSHIP',
    method: 'CASH',
    amount: '',
    description: '',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchPayments();
    fetchUsers();
  }, [isAuthenticated, navigate]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await axios.get('/api/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to fetch payments');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingPayment) {
        await axios.put(`/api/payments/${editingPayment.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Payment updated successfully');
      } else {
        await axios.post('/api/payments', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Payment created successfully');
      }
      setShowModal(false);
      setEditingPayment(null);
      resetForm();
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      userId: payment.user.id,
      type: payment.type,
      method: payment.method,
      amount: payment.amount,
      description: payment.description || '',
      dueDate: payment.dueDate ? payment.dueDate.split('T')[0] : '',
      notes: payment.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Payment deleted successfully');
        fetchPayments();
      } catch (err) {
        setError('Failed to delete payment');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/payments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Payment status updated successfully');
      fetchPayments();
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      type: 'MEMBERSHIP',
      method: 'CASH',
      amount: '',
      description: '',
      dueDate: '',
      notes: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'danger',
      REFUNDED: 'info',
      OVERDUE: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      MEMBERSHIP: 'primary',
      CLASS: 'success',
      TRAINING: 'warning',
      EQUIPMENT: 'info',
      OTHER: 'secondary'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const getMethodBadge = (method) => {
    const variants = {
      CASH: 'success',
      CARD: 'primary',
      BANK_TRANSFER: 'info',
      CHECK: 'warning',
      DIGITAL_WALLET: 'secondary'
    };
    return <Badge bg={variants[method] || 'secondary'}>{method}</Badge>;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Payment Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Payment
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Method</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Payment Date</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.user.firstName} {payment.user.lastName}</td>
                  <td>{getTypeBadge(payment.type)}</td>
                  <td>{getMethodBadge(payment.method)}</td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.description || 'N/A'}</td>
                  <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(payment)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(payment.id)}>
                      Delete
                    </Button>
                    <div className="mt-1">
                      {payment.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline-success" onClick={() => handleStatusUpdate(payment.id, 'COMPLETED')}>
                            Complete
                          </Button>
                          <Button size="sm" variant="outline-danger" className="ms-1" onClick={() => handleStatusUpdate(payment.id, 'CANCELLED')}>
                            Cancel
                          </Button>
                        </>
                      )}
                      {payment.status === 'COMPLETED' && (
                        <Button size="sm" variant="outline-info" onClick={() => handleStatusUpdate(payment.id, 'REFUNDED')}>
                          Refund
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

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingPayment(null); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPayment ? 'Edit Payment' : 'Add New Payment'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>User</Form.Label>
                  <Form.Select
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.username}) - {user.role}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Payment Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="MEMBERSHIP">Membership</option>
                    <option value="CLASS">Class</option>
                    <option value="TRAINING">Training Session</option>
                    <option value="EQUIPMENT">Equipment</option>
                    <option value="OTHER">Other</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value})}
                    required
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHECK">Check</option>
                    <option value="DIGITAL_WALLET">Digital Wallet</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

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
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingPayment(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingPayment ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentManagement; 