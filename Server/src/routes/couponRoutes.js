import express from 'express';
import {
  getActiveCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { authenticate } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getActiveCoupons);
router.post('/validate', validateCoupon);

// Admin only routes
router.post('/', authenticate, adminAuth, createCoupon);
router.put('/:id', authenticate, adminAuth, updateCoupon);
router.delete('/:id', authenticate, adminAuth, deleteCoupon);

export default router;
