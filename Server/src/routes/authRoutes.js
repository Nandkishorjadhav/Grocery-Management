import express from 'express';
import {
  initiateAuth,
  verifyOTP,
  resendOTP,
  getProfile,
  logout,
  updateProfile
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/initiate', initiateAuth);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

export default router;
