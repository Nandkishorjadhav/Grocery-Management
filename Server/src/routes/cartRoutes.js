import express from 'express';
import {
  getCartItems,
  getCartCount,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCartItems);
router.get('/count', getCartCount);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);
router.patch('/:id/increment', incrementQuantity);
router.patch('/:id/decrement', decrementQuantity);

export default router;
