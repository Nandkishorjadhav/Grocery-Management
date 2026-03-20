import api from './api';

const sellerProductService = {
  // Create a new seller product
  createProduct: async (productData) => {
    const response = await api.post('/seller-products', productData);
    return response;
  },

  // Get my seller products
  getMyProducts: async (params = {}) => {
    const response = await api.get('/seller-products/my/products', { params });
    return response;
  },

  // Get all approved products (marketplace)
  getMarketplaceProducts: async (params = {}) => {
    const response = await api.get('/seller-products/marketplace', { params });
    return response;
  },

  // Get single product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/seller-products/${productId}`);
    return response;
  },

  // Update seller product
  updateProduct: async (productId, updates) => {
    const response = await api.put(`/seller-products/${productId}`, updates);
    return response;
  },

  // Delete seller product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/seller-products/${productId}`);
    return response;
  },

  // Record inquiry
  recordInquiry: async (productId) => {
    const response = await api.post(`/seller-products/${productId}/inquiry`);
    return response;
  },

  // Admin: Get all seller products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/seller-products/admin/all', { params });
    return response;
  },

  // Admin: Approve product
  approveProduct: async (productId) => {
    const response = await api.put(`/seller-products/admin/${productId}/approve`);
    return response;
  },

  // Admin: Reject product
  rejectProduct: async (productId, reason) => {
    const response = await api.put(`/seller-products/admin/${productId}/reject`, { reason });
    return response;
  },

  // Upload image (if you have a separate upload endpoint)
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/seller-products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  }
};

export default sellerProductService;
