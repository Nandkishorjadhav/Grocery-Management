const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

// All routes require authentication
router.use(authenticate);

// Create a new order
router.post('/', createOrder);

// Get all orders for logged-in user
router.get('/', getUserOrders);

// Get specific order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
