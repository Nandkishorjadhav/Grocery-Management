const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grocery-management-lg7u.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const inventoryService = {
  // Get all items
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get inventory');
    return result;
  },

  // Get item by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get item');
    return result;
  },

  // Create new item
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create item');
    return result;
  },

  // Update item
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update item');
    return result;
  },

  // Delete item
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete item');
    return result;
  },

  // Get low stock items
  getLowStock: async () => {
    const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get low stock items');
    return result;
  },

  // Get expiring soon items
  getExpiringSoon: async () => {
    const response = await fetch(`${API_BASE_URL}/inventory/expiring-soon`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get expiring soon items');
    return result;
  },
};

const shoppingListService = {
  // Get all items
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/shopping-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get shopping list');
    return result;
  },

  // Get item by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/shopping-list/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get item');
    return result;
  },

  // Create new item
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/shopping-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create item');
    return result;
  },

  // Update item
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/shopping-list/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update item');
    return result;
  },

  // Delete item
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/shopping-list/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete item');
    return result;
  },

  // Toggle purchased status
  togglePurchased: async (id) => {
    const response = await fetch(`${API_BASE_URL}/shopping-list/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to toggle purchased status');
    return result;
  },

  // Clear purchased items
  clearPurchased: async () => {
    const response = await fetch(`${API_BASE_URL}/shopping-list/purchased/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to clear purchased items');
    return result;
  },
};

export default {
  inventoryService,
  shoppingListService
};

export { inventoryService, shoppingListService };
