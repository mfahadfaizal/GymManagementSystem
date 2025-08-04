import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/signin', credentials),
  register: (userData) => api.post('/api/auth/signup', userData),
};

// User API
export const userAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
};

// Membership API
export const membershipAPI = {
  getAll: () => api.get('/api/memberships'),
  getById: (id) => api.get(`/api/memberships/${id}`),
  create: (membershipData) => api.post('/api/memberships', membershipData),
  update: (id, membershipData) => api.put(`/api/memberships/${id}`, membershipData),
  delete: (id) => api.delete(`/api/memberships/${id}`),
};

// Equipment API
export const equipmentAPI = {
  getAll: () => api.get('/api/equipment'),
  getById: (id) => api.get(`/api/equipment/${id}`),
  create: (equipmentData) => api.post('/api/equipment', equipmentData),
  update: (id, equipmentData) => api.put(`/api/equipment/${id}`, equipmentData),
  delete: (id) => api.delete(`/api/equipment/${id}`),
};

// Gym Class API
export const gymClassAPI = {
  getAll: () => api.get('/api/gym-classes'),
  getById: (id) => api.get(`/api/gym-classes/${id}`),
  create: (classData) => api.post('/api/gym-classes', classData),
  update: (id, classData) => api.put(`/api/gym-classes/${id}`, classData),
  delete: (id) => api.delete(`/api/gym-classes/${id}`),
};

// Training Session API
export const trainingSessionAPI = {
  getAll: () => api.get('/api/training-sessions'),
  getById: (id) => api.get(`/api/training-sessions/${id}`),
  create: (sessionData) => api.post('/api/training-sessions', sessionData),
  update: (id, sessionData) => api.put(`/api/training-sessions/${id}`, sessionData),
  delete: (id) => api.delete(`/api/training-sessions/${id}`),
};

// Class Registration API
export const classRegistrationAPI = {
  getAll: () => api.get('/api/class-registrations'),
  getById: (id) => api.get(`/api/class-registrations/${id}`),
  create: (registrationData) => api.post('/api/class-registrations', registrationData),
  update: (id, registrationData) => api.put(`/api/class-registrations/${id}`, registrationData),
  delete: (id) => api.delete(`/api/class-registrations/${id}`),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get('/api/payments'),
  getById: (id) => api.get(`/api/payments/${id}`),
  create: (paymentData) => api.post('/api/payments', paymentData),
  update: (id, paymentData) => api.put(`/api/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/api/payments/${id}`),
};

export default api; 