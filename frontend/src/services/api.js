import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login'; // You can replace with router navigate if preferred
    }
    return Promise.reject(error);
  }
);

// --- Auth API ---
export const authAPI = {
  login: (credentials) => api.post('/api/auth/signin', credentials),
  register: (userData) => api.post('/api/auth/signup', userData),
};

// --- User API ---
export const userAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
};

// --- Membership API ---
export const membershipAPI = {
  getAll: () => api.get('/api/memberships'),
  getById: (id) => api.get(`/api/memberships/${id}`),
  getByUserId: (userId) => api.get(`/api/memberships/user/${userId}`),
  getActiveByUserId: (userId) => api.get(`/api/memberships/user/${userId}/active`),
  getByStatus: (status) => api.get(`/api/memberships/status/${status}`),
  getExpiring: (startDate, endDate) => 
    api.get(`/api/memberships/expiring?startDate=${startDate}&endDate=${endDate}`),
  getExpired: () => api.get('/api/memberships/expired'),
  getActiveCount: () => api.get('/api/memberships/stats/active-count'),
  checkUserHasActive: (userId) => api.get(`/api/memberships/check/${userId}`),
  create: (data) => api.post('/api/memberships', data),
  update: (id, data) => api.put(`/api/memberships/${id}`, data),
  delete: (id) => api.delete(`/api/memberships/${id}`),
  updateStatus: (id, status) => api.put(`/api/memberships/${id}/status?status=${status}`),
  renew: (id, newEndDate) => api.put(`/api/memberships/${id}/renew?newEndDate=${newEndDate}`),
};

// --- Equipment API ---
export const equipmentAPI = {
  getAll: () => api.get('/api/equipment'),
  getById: (id) => api.get(`/api/equipment/${id}`),
  getByType: (type) => api.get(`/api/equipment/type/${type}`),
  getByStatus: (status) => api.get(`/api/equipment/status/${status}`),
  getByLocation: (location) => api.get(`/api/equipment/location/${location}`),
  getNeedingMaintenance: () => api.get('/api/equipment/maintenance/needing'),
  getWithExpiringWarranty: (expiryDate) => api.get(`/api/equipment/warranty/expiring?expiryDate=${expiryDate}`),
  getAvailableCount: () => api.get('/api/equipment/stats/available-count'),
  getMaintenanceCount: () => api.get('/api/equipment/stats/maintenance-count'),
  search: (searchTerm) => api.get(`/api/equipment/search?searchTerm=${searchTerm}`),
  getPurchasedBetween: (startDate, endDate) => 
    api.get(`/api/equipment/purchased?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/api/equipment', data),
  update: (id, data) => api.put(`/api/equipment/${id}`, data),
  delete: (id) => api.delete(`/api/equipment/${id}`),
  updateStatus: (id, status) => api.put(`/api/equipment/${id}/status?status=${status}`),
  scheduleMaintenance: (id, nextMaintenanceDate) => 
    api.put(`/api/equipment/${id}/maintenance/schedule?nextMaintenanceDate=${nextMaintenanceDate}`),
  completeMaintenance: (id) => api.put(`/api/equipment/${id}/maintenance/complete`),
  setWarrantyExpiry: (id, warrantyExpiry) => 
    api.put(`/api/equipment/${id}/warranty?warrantyExpiry=${warrantyExpiry}`),
};

// --- Gym Class API ---
export const gymClassAPI = {
  getAll: () => api.get('/api/gym-classes'),
  getById: (id) => api.get(`/api/gym-classes/${id}`),
  getByType: (type) => api.get(`/api/gym-classes/type/${type}`),
  getByStatus: (status) => api.get(`/api/gym-classes/status/${status}`),
  getByTrainer: (trainerId) => api.get(`/api/gym-classes/trainer/${trainerId}`),
  getByLocation: (location) => api.get(`/api/gym-classes/location/${location}`),
  getAvailable: () => api.get('/api/gym-classes/available'),
  getFull: () => api.get('/api/gym-classes/full'),
  getActiveByTrainer: (trainerId) => api.get(`/api/gym-classes/trainer/${trainerId}/active`),
  getActiveByType: (type) => api.get(`/api/gym-classes/type/${type}/active`),
  getByTimeRange: (startTime, endTime) => 
    api.get(`/api/gym-classes/time-range?startTime=${startTime}&endTime=${endTime}`),
  getByDay: (day) => api.get(`/api/gym-classes/day/${day}`),
  getActiveCount: () => api.get('/api/gym-classes/stats/active-count'),
  search: (searchTerm) => api.get(`/api/gym-classes/search?searchTerm=${searchTerm}`),
  create: (data) => api.post('/api/gym-classes', data),
  update: (id, data) => api.put(`/api/gym-classes/${id}`, data),
  delete: (id) => api.delete(`/api/gym-classes/${id}`),
  updateStatus: (id, status) => api.put(`/api/gym-classes/${id}/status?status=${status}`),
  updateEnrollment: (id, currentEnrollment) => 
    api.put(`/api/gym-classes/${id}/enrollment?currentEnrollment=${currentEnrollment}`),
  incrementEnrollment: (id) => api.put(`/api/gym-classes/${id}/enrollment/increment`),
  decrementEnrollment: (id) => api.put(`/api/gym-classes/${id}/enrollment/decrement`),
};

// --- Training Session API ---
export const trainingSessionAPI = {
  getAll: () => api.get('/api/training-sessions'),
  getById: (id) => api.get(`/api/training-sessions/${id}`),
  getByTrainer: (trainerId) => api.get(`/api/training-sessions/trainer/${trainerId}`),
  getByMember: (memberId) => api.get(`/api/training-sessions/member/${memberId}`),
  getByStatus: (status) => api.get(`/api/training-sessions/status/${status}`),
  getByType: (type) => api.get(`/api/training-sessions/type/${type}`),
  getUpcoming: () => api.get('/api/training-sessions/upcoming'),
  getUpcomingByTrainer: (trainerId) => api.get(`/api/training-sessions/trainer/${trainerId}/upcoming`),
  getUpcomingByMember: (memberId) => api.get(`/api/training-sessions/member/${memberId}/upcoming`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/api/training-sessions/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByTrainerAndDateRange: (trainerId, startDate, endDate) => 
    api.get(`/api/training-sessions/trainer/${trainerId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByMemberAndDateRange: (memberId, startDate, endDate) => 
    api.get(`/api/training-sessions/member/${memberId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getCompletedByTrainer: (trainerId) => api.get(`/api/training-sessions/stats/trainer/${trainerId}/completed`),
  getCompletedByMember: (memberId) => api.get(`/api/training-sessions/stats/member/${memberId}/completed`),
  bookSession: (data) => api.post('/api/training-sessions/book', data),
  create: (data) => api.post('/api/training-sessions', data),
  update: (id, data) => api.put(`/api/training-sessions/${id}`, data),
  delete: (id) => api.delete(`/api/training-sessions/${id}`),
  updateStatus: (id, status) => api.put(`/api/training-sessions/${id}/status?status=${status}`),
  reschedule: (id, newScheduledDate) => 
    api.put(`/api/training-sessions/${id}/reschedule?newScheduledDate=${newScheduledDate}`),
};

// --- Class Registration API ---
export const classRegistrationAPI = {
  getAll: () => api.get('/api/class-registrations'),
  getById: (id) => api.get(`/api/class-registrations/${id}`),
  getByMember: (memberId) => api.get(`/api/class-registrations/member/${memberId}`),
  getByGymClass: (classId) => api.get(`/api/class-registrations/class/${classId}`),
  getByMemberAndStatus: (memberId, status) => api.get(`/api/class-registrations/member/${memberId}/status/${status}`),
  getByGymClassAndStatus: (classId, status) => api.get(`/api/class-registrations/class/${classId}/status/${status}`),
  getUpcoming: () => api.get('/api/class-registrations/upcoming'),
  getUpcomingByMember: (memberId) => api.get(`/api/class-registrations/member/${memberId}/upcoming`),
  getByMemberAndDateRange: (memberId, startDate, endDate) => 
    api.get(`/api/class-registrations/member/${memberId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByGymClassAndDateRange: (classId, startDate, endDate) => 
    api.get(`/api/class-registrations/class/${classId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getCountByGymClass: (classId) => api.get(`/api/class-registrations/class/${classId}/count`),
  getAttendedCountByMember: (memberId) => api.get(`/api/class-registrations/member/${memberId}/attended-count`),
  checkMemberRegistered: (memberId, classId) => api.get(`/api/class-registrations/check/${memberId}/${classId}`),
  registerForClass: (memberId, classId) => api.post(`/api/class-registrations/register?memberId=${memberId}&classId=${classId}`),
  updateStatus: (id, status) => api.put(`/api/class-registrations/${id}/status?status=${status}`),
  cancelRegistration: (id) => api.put(`/api/class-registrations/${id}/cancel`),
  delete: (id) => api.delete(`/api/class-registrations/${id}`),
  markAttendance: (id) => api.put(`/api/class-registrations/${id}/attendance`),
  markNoShow: (id) => api.put(`/api/class-registrations/${id}/no-show`),
};

// --- Payment API ---
export const paymentAPI = {
  getAll: () => api.get('/api/payments'),
  getById: (id) => api.get(`/api/payments/${id}`),
  getByUser: (userId) => api.get(`/api/payments/user/${userId}`),
  getByStatus: (status) => api.get(`/api/payments/status/${status}`),
  getByType: (type) => api.get(`/api/payments/type/${type}`),
  getByMethod: (method) => api.get(`/api/payments/method/${method}`),
  getCompletedByUser: (userId) => api.get(`/api/payments/user/${userId}/completed`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/api/payments/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByUserAndDateRange: (userId, startDate, endDate) => 
    api.get(`/api/payments/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getTotalByUser: (userId) => api.get(`/api/payments/user/${userId}/total`),
  getRevenueByDateRange: (startDate, endDate) => 
    api.get(`/api/payments/revenue/date-range?startDate=${startDate}&endDate=${endDate}`),
  getCompletedCount: () => api.get('/api/payments/stats/completed-count'),
  getPendingCount: () => api.get('/api/payments/stats/pending-count'),
  getOverdue: (dueDate) => api.get(`/api/payments/overdue?dueDate=${dueDate}`),
  getHighValue: (minAmount) => api.get(`/api/payments/high-value?minAmount=${minAmount}`),
  create: (data) => api.post('/api/payments', data),
  update: (id, data) => api.put(`/api/payments/${id}`, data),
  delete: (id) => api.delete(`/api/payments/${id}`),
  updateStatus: (id, status) => api.put(`/api/payments/${id}/status?status=${status}`),
  processPayment: (id) => api.put(`/api/payments/${id}/process`),
  refundPayment: (id, notes) => api.put(`/api/payments/${id}/refund?notes=${notes}`),
  cancelPayment: (id) => api.put(`/api/payments/${id}/cancel`),
  createMembershipPayment: (userId, amount, method) => 
    api.post(`/api/payments/membership?userId=${userId}&amount=${amount}&method=${method}`),
  createClassPayment: (userId, amount, method) => 
    api.post(`/api/payments/class?userId=${userId}&amount=${amount}&method=${method}`),
  createTrainingSessionPayment: (userId, amount, method) => 
    api.post(`/api/payments/training-session?userId=${userId}&amount=${amount}&method=${method}`),
};

export default api;
