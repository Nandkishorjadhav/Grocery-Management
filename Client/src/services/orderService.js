const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grocery-management-lg7u.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to create order');
      return result;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Get all orders for the logged-in user
  getUserOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to get orders');
      return result;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to get order');
      return result;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to cancel order');
      return result;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }
};

export default orderService;
