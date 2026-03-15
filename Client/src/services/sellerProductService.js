const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grocery-management-lg7u.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
};

const sellerProductService = {
  // Create a new seller product
  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/seller-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(productData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create product');
    return result;
  },

  // Get my seller products
  getMyProducts: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/my/products${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get my products');
    return result;
  },

  // Get all approved products (marketplace)
  getMarketplaceProducts: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/marketplace${buildQueryString(params)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get marketplace products');
    return result;
  },

  // Get single product by ID
  getProductById: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get product');
    return result;
  },

  // Update seller product
  updateProduct: async (productId, updates) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update product');
    return result;
  },

  // Delete seller product
  deleteProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete product');
    return result;
  },

  // Record inquiry
  recordInquiry: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/${productId}/inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to record inquiry');
    return result;
  },

  // Admin: Get all seller products
  getAllProducts: async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/admin/all${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get all products');
    return result;
  },

  // Admin: Approve product
  approveProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/admin/${productId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to approve product');
    return result;
  },

  // Admin: Reject product
  rejectProduct: async (productId, reason) => {
    const response = await fetch(`${API_BASE_URL}/seller-products/admin/${productId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ reason }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to reject product');
    return result;
  },

  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_BASE_URL}/seller-products/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to upload image');
    return result;
  }
};

export default sellerProductService;
