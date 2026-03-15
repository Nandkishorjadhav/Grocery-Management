const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grocery-management-lg7u.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
};

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get dashboard stats');
    return result;
  },

  getSystemOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/system-overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get system overview');
    return result;
  },

  // User management
  getAllUsers: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/admin/users${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get users');
    return result;
  },

  approveUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to approve user');
    return result;
  },

  rejectUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to reject user');
    return result;
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ role }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update user role');
    return result;
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete user');
    return result;
  },

  // Bulk operations
  bulkApproveUsers: async (userIds) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/bulk-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ userIds }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to bulk approve users');
    return result;
  },

  bulkRejectUsers: async (userIds) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/bulk-reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ userIds }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to bulk reject users');
    return result;
  },

  // Activity logs
  getActivityLogs: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/admin/activity-logs${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get activity logs');
    return result;
  },

  // Pending approvals
  getPendingApprovals: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/pending-approvals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get pending approvals');
    return result;
  },

  // Orders management
  getAllOrders: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get orders');
    return result;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update order status');
    return result;
  },

  // Inventory management
  getInventoryData: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/admin/inventory${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get inventory data');
    return result;
  },

  updateInventory: async (itemId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/inventory/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update inventory');
    return result;
  },

  // Reports and analytics
  getReports: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/admin/reports${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get reports');
    return result;
  },
};

export default adminService;
