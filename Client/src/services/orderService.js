import api from './api';

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      return await api.post('/orders', orderData);
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Get all orders for the logged-in user
  getUserOrders: async () => {
    try {
      return await api.get('/orders');
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    try {
      return await api.get(`/orders/${orderId}`);
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      return await api.patch(`/orders/${orderId}/cancel`);
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }
};

export default orderService;
