import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Table,
  Spinner,
  Nav,
  Tab,
  Row,
  Col,
} from 'react-bootstrap';
import { membershipAPI, authAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MembershipManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingMembership, setEditingMembership] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'MEMBER',
  });

  const [membershipFormData, setMembershipFormData] = useState({
    userId: '',
    type: 'BASIC',
    price: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const allowedRoles = () => {
    if (user?.role === 'ADMIN') return ['ADMIN', 'STAFF', 'TRAINER', 'MEMBER'];
    if (user?.role === 'STAFF') return ['STAFF', 'TRAINER', 'MEMBER'];
    return [];
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!['ADMIN', 'STAFF'].includes(user?.role)) {
      navigate('/unauthorized');
      return;
    }
    fetchData();
  }, [isAuthenticated, user?.role, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, membershipsRes] = await Promise.all([
        userAPI.getAll(),
        membershipAPI.getAll(),
      ]);
      setUsers(usersRes.data);
      setMemberships(membershipsRes.data);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const resetUserForm = () => {
    setUserFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      role: 'MEMBER',
    });
    setEditingUser(null);
  };

  const resetMembershipForm = () => {
    setMembershipFormData({
      userId: '',
      type: 'BASIC',
      price: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setEditingMembership(null);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!allowedRoles().includes(userFormData.role)) {
      setError(`You cannot register a user with role: ${userFormData.role}`);
      return;
    }

    try {
      setSubmitting(true);

      if (editingUser) {
        const updateData = {
          firstName: userFormData.firstName,
          lastName: userFormData.lastName,
          email: userFormData.email,
        };
        if (user.role === 'ADMIN') {
          updateData.role = userFormData.role;
        }

        await userAPI.update(editingUser.id, updateData);
        setSuccess('User updated successfully.');
      } else {
        const userPayload = {
          firstName: userFormData.firstName,
          lastName: userFormData.lastName,
          username: userFormData.username,
          email: userFormData.email,
          password: userFormData.password,
          role: userFormData.role,
        };
        await userAPI.create(userPayload);
        setSuccess('User created successfully.');
      }

      setShowUserModal(false);
      resetUserForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create/update user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMembershipSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (new Date(membershipFormData.startDate) > new Date(membershipFormData.endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    if (Number(membershipFormData.price) <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    if (!membershipFormData.userId) {
      setError('Please select a user.');
      return;
    }

    try {
      setSubmitting(true);

      const membershipPayload = {
        userId: Number(membershipFormData.userId),
        type: membershipFormData.type,
        price: Number(membershipFormData.price),
        startDate: `${membershipFormData.startDate}T00:00:00`,
        endDate: `${membershipFormData.endDate}T00:00:00`,
        description: membershipFormData.description,
      };

      if (editingMembership) {
        await membershipAPI.update(editingMembership.id, membershipPayload);
        setSuccess('Membership updated successfully.');
      } else {
        await membershipAPI.create(membershipPayload);
        setSuccess('Membership created successfully.');
      }

      setShowMembershipModal(false);
      resetMembershipForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create/update membership.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setUserFormData({
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      username: userToEdit.username,
      email: userToEdit.email,
      password: '',
      role: userToEdit.role,
    });
    setShowUserModal(true);
  };

  const handleEditMembership = (membership) => {
    setEditingMembership(membership);
    setMembershipFormData({
      userId: membership.userId.toString(),
      type: membership.type,
      price: membership.price.toString(),
      startDate: membership.startDate.split('T')[0],
      endDate: membership.endDate.split('T')[0],
      description: membership.description || '',
    });
    setShowMembershipModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(userId);
        setSuccess('User deleted successfully.');
        fetchData();
      } catch {
        setError('Failed to delete user.');
      }
    }
  };

  const handleDeleteMembership = async (membershipId) => {
    if (window.confirm('Are you sure you want to delete this membership?')) {
      try {
        await membershipAPI.delete(membershipId);
        setSuccess('Membership deleted successfully.');
        fetchData();
      } catch {
        setError('Failed to delete membership.');
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: 'success',
      EXPIRED: 'danger',
      CANCELLED: 'warning',
      PENDING: 'info',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      BASIC: 'primary',
      PREMIUM: 'warning',
      VIP: 'danger',
      STUDENT: 'info',
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      ADMIN: 'danger',
      STAFF: 'warning',
      TRAINER: 'info',
      MEMBER: 'primary',
    };
    return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url('/assets/images/4.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Container className="mt-4">
        <Card>
          <Card.Header>
            <h4>User & Membership Management</h4>
            <p className="mb-0">Manage users and memberships (Admin/Staff only)</p>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav.Item>
                <Nav.Link eventKey="users">User Management</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="memberships">Membership Management</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="mt-3">
              <Tab.Pane eventKey="users" active={activeTab === 'users'}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Users</h5>
                  <Button variant="primary" onClick={() => { resetUserForm(); setShowUserModal(true); }}>
                    Add New User
                  </Button>
                </div>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{getRoleBadge(u.role)}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" onClick={() => handleEditUser(u)} className="me-2">Edit</Button>
                          {u.role !== 'ADMIN' && (
                            <Button size="sm" variant="outline-danger" onClick={() => handleDeleteUser(u.id)}>Delete</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              <Tab.Pane eventKey="memberships" active={activeTab === 'memberships'}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Memberships</h5>
                  <Button variant="primary" onClick={() => { resetMembershipForm(); setShowMembershipModal(true); }}>
                    Add New Membership
                  </Button>
                </div>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map((m) => {
                      const membershipUser = users.find((u) => u.id === m.userId);
                      return (
                        <tr key={m.id}>
                          <td>
                            {membershipUser
                              ? `${membershipUser.firstName} ${membershipUser.lastName} (${membershipUser.username})`
                              : `User ID ${m.userId}`}
                          </td>
                          <td>{getTypeBadge(m.type)}</td>
                          <td>{getStatusBadge(m.status)}</td>
                          <td>${m.price.toFixed(2)}</td>
                          <td>{new Date(m.startDate).toLocaleDateString()}</td>
                          <td>{new Date(m.endDate).toLocaleDateString()}</td>
                          <td>{m.description || '-'}</td>
                          <td>
                            <Button size="sm" variant="outline-primary" onClick={() => handleEditMembership(m)} className="me-2">Edit</Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleDeleteMembership(m.id)}>Delete</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>

        {/* User Modal */}
        <Modal show={showUserModal} onHide={() => { setShowUserModal(false); resetUserForm(); }} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleUserSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={userFormData.firstName}
                      onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={userFormData.lastName}
                      onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={userFormData.username}
                      onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                      required
                      disabled={submitting || editingUser}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {!editingUser && (
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  required
                  disabled={submitting}
                >
                  {allowedRoles().map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setShowUserModal(false); resetUserForm(); }} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Submitting...' : editingUser ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Membership Modal */}
        <Modal show={showMembershipModal} onHide={() => { setShowMembershipModal(false); resetMembershipForm(); }} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{editingMembership ? 'Edit Membership' : 'Add New Membership'}</Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleMembershipSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="userId">
                <Form.Label>User</Form.Label>
                <Form.Select
                  value={membershipFormData.userId}
                  onChange={(e) => setMembershipFormData({ ...membershipFormData, userId: e.target.value })}
                  required
                  disabled={submitting}
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.username})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="type">
                    <Form.Label>Membership Type</Form.Label>
                    <Form.Select
                      value={membershipFormData.type}
                      onChange={(e) => setMembershipFormData({ ...membershipFormData, type: e.target.value })}
                      required
                      disabled={submitting}
                    >
                      <option value="BASIC">BASIC</option>
                      <option value="PREMIUM">PREMIUM</option>
                      <option value="VIP">VIP</option>
                      <option value="STUDENT">STUDENT</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      value={membershipFormData.price}
                      onChange={(e) => setMembershipFormData({ ...membershipFormData, price: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={membershipFormData.startDate}
                      onChange={(e) => setMembershipFormData({ ...membershipFormData, startDate: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={membershipFormData.endDate}
                      onChange={(e) => setMembershipFormData({ ...membershipFormData, endDate: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={membershipFormData.description}
                  onChange={(e) => setMembershipFormData({ ...membershipFormData, description: e.target.value })}
                  disabled={submitting}
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setShowMembershipModal(false); resetMembershipForm(); }} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Submitting...' : editingMembership ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default MembershipManagement;
