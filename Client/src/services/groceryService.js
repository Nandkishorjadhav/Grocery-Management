import api from './api';

export const inventoryService = {
  // Get all items
  getAll: () => api.get('/inventory'),

  // Get item by ID
  getById: (id) => api.get(`/inventory/${id}`),

  // Create new item
  create: (data) => api.post('/inventory', data),

  // Update item
  update: (id, data) => api.put(`/inventory/${id}`, data),

  // Delete item
  delete: (id) => api.delete(`/inventory/${id}`),

  // Get low stock items
  getLowStock: () => api.get('/inventory/low-stock'),

  // Get expiring soon items
  getExpiringSoon: () => api.get('/inventory/expiring-soon'),
};

export const shoppingListService = {
  // Get all items
  getAll: () => api.get('/shopping-list'),

  // Get item by ID
  getById: (id) => api.get(`/shopping-list/${id}`),

  // Create new item
  create: (data) => api.post('/shopping-list', data),

  // Update item
  update: (id, data) => api.put(`/shopping-list/${id}`, data),

  // Delete item
  delete: (id) => api.delete(`/shopping-list/${id}`),

  // Toggle purchased status
  togglePurchased: (id) => api.patch(`/shopping-list/${id}/toggle`),

  // Clear purchased items
  clearPurchased: () => api.delete('/shopping-list/purchased/clear'),
};
