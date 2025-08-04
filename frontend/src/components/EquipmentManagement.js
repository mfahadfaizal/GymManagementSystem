import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'CARDIO',
    purchasePrice: '',
    purchaseDate: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    location: '',
    serialNumber: '',
    warrantyExpiry: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchEquipment();
  }, [isAuthenticated, navigate]);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }
      
      const response = await axios.get('/api/equipment', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEquipment(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to fetch equipment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingEquipment) {
        await axios.put(`/api/equipment/${editingEquipment.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Equipment updated successfully');
      } else {
        await axios.post('/api/equipment', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Equipment added successfully');
      }
      setShowModal(false);
      setEditingEquipment(null);
      resetForm();
      fetchEquipment();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      name: equipment.name,
      description: equipment.description || '',
      type: equipment.type,
      purchasePrice: equipment.purchasePrice,
      purchaseDate: equipment.purchaseDate.split('T')[0],
      lastMaintenanceDate: equipment.lastMaintenanceDate ? equipment.lastMaintenanceDate.split('T')[0] : '',
      nextMaintenanceDate: equipment.nextMaintenanceDate ? equipment.nextMaintenanceDate.split('T')[0] : '',
      location: equipment.location || '',
      serialNumber: equipment.serialNumber || '',
      warrantyExpiry: equipment.warrantyExpiry ? equipment.warrantyExpiry.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/equipment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Equipment deleted successfully');
        fetchEquipment();
      } catch (err) {
        setError('Failed to delete equipment');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/equipment/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Equipment status updated successfully');
      fetchEquipment();
    } catch (err) {
      setError('Failed to update equipment status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'CARDIO',
      purchasePrice: '',
      purchaseDate: '',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      location: '',
      serialNumber: '',
      warrantyExpiry: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      AVAILABLE: 'success',
      IN_USE: 'primary',
      MAINTENANCE: 'warning',
      OUT_OF_SERVICE: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      CARDIO: 'primary',
      STRENGTH: 'warning',
      FLEXIBILITY: 'info',
      FUNCTIONAL: 'success'
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
          <h4>Equipment Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Equipment
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
                <th>Status</th>
                <th>Location</th>
                <th>Purchase Price</th>
                <th>Last Maintenance</th>
                <th>Next Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{getTypeBadge(item.type)}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{item.location}</td>
                  <td>${item.purchasePrice}</td>
                  <td>{item.lastMaintenanceDate ? new Date(item.lastMaintenanceDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{item.nextMaintenanceDate ? new Date(item.nextMaintenanceDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                    <div className="mt-1">
                      <Button size="sm" variant="outline-success" onClick={() => handleStatusUpdate(item.id, 'AVAILABLE')}>
                        Available
                      </Button>
                      <Button size="sm" variant="outline-warning" className="ms-1" onClick={() => handleStatusUpdate(item.id, 'MAINTENANCE')}>
                        Maintenance
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingEquipment(null); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
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
                    <option value="FLEXIBILITY">Flexibility</option>
                    <option value="FUNCTIONAL">Functional</option>
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
                  <Form.Label>Purchase Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Purchase Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Last Maintenance Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.lastMaintenanceDate}
                    onChange={(e) => setFormData({...formData, lastMaintenanceDate: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Next Maintenance Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.nextMaintenanceDate}
                    onChange={(e) => setFormData({...formData, nextMaintenanceDate: e.target.value})}
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
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Serial Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Warranty Expiry Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({...formData, warrantyExpiry: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingEquipment(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingEquipment ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentManagement; 