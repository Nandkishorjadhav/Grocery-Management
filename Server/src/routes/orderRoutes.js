import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

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

export default router;
