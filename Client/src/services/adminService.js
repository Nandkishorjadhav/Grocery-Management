import api from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getSystemOverview: async () => {
    const response = await api.get('/admin/system-overview');
    return response.data;
  },

  // User management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  approveUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/approve`);
    return response.data;
  },

  rejectUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/reject`);
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Bulk operations
  bulkApproveUsers: async (userIds) => {
    const response = await api.post('/admin/users/bulk-approve', { userIds });
    return response.data;
  },

  bulkRejectUsers: async (userIds) => {
    const response = await api.post('/admin/users/bulk-reject', { userIds });
    return response.data;
  },

  // Activity logs
  getActivityLogs: async (params = {}) => {
    const response = await api.get('/admin/activity-logs', { params });
    return response.data;
  },

  // Pending approvals
  getPendingApprovals: async () => {
    const response = await api.get('/admin/pending-approvals');
    return response.data;
  },
};

export default adminService;
