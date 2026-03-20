import api from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },

  getSystemOverview: async () => {
    return await api.get('/admin/system-overview');
  },

  // User management
  getAllUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },

  approveUser: async (userId) => {
    return await api.put(`/admin/users/${userId}/approve`);
  },

  rejectUser: async (userId) => {
    return await api.put(`/admin/users/${userId}/reject`);
  },

  updateUserRole: async (userId, role) => {
    return await api.put(`/admin/users/${userId}/role`, { role });
  },

  deleteUser: async (userId) => {
    return await api.delete(`/admin/users/${userId}`);
  },

  // Bulk operations
  bulkApproveUsers: async (userIds) => {
    return await api.post('/admin/users/bulk-approve', { userIds });
  },

  bulkRejectUsers: async (userIds) => {
    return await api.post('/admin/users/bulk-reject', { userIds });
  },

  // Activity logs
  getActivityLogs: async (params = {}) => {
    return await api.get('/admin/activity-logs', { params });
  },

  // Pending approvals
  getPendingApprovals: async () => {
    return await api.get('/admin/pending-approvals');
  },

  // Orders management
  getAllOrders: async (params = {}) => {
    return await api.get('/admin/orders', { params });
  },

  updateOrderStatus: async (orderId, status) => {
    return await api.put(`/admin/orders/${orderId}/status`, { status });
  },

  // Inventory management
  getInventoryData: async (params = {}) => {
    return await api.get('/admin/inventory', { params });
  },

  updateInventory: async (itemId, data) => {
    return await api.put(`/admin/inventory/${itemId}`, data);
  },

  // Reports and analytics
  getReports: async (params = {}) => {
    return await api.get('/admin/reports', { params });
  },
};

export default adminService;
