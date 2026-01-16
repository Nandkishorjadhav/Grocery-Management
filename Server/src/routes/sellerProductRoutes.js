import express from 'express';
import { authenticate } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  createSellerProduct,
  getMySellerProducts,
  getApprovedSellerProducts,
  getSellerProductById,
  updateSellerProduct,
  deleteSellerProduct,
  approveSellerProduct,
  rejectSellerProduct,
  getAllSellerProducts,
  recordInquiry
} from '../controllers/sellerProductController.js';

const router = express.Router();

// Public routes
router.get('/marketplace', getApprovedSellerProducts);
router.get('/:productId', getSellerProductById);
router.post('/:productId/inquiry', authenticate, recordInquiry);

// Seller routes (authenticated users)
router.post('/', authenticate, createSellerProduct);
router.get('/my/products', authenticate, getMySellerProducts);
router.put('/:productId', authenticate, updateSellerProduct);
router.delete('/:productId', authenticate, deleteSellerProduct);

// Admin routes
router.get('/admin/all', adminAuth, getAllSellerProducts);
router.put('/admin/:productId/approve', adminAuth, approveSellerProduct);
router.put('/admin/:productId/reject', adminAuth, rejectSellerProduct);

export default router;
