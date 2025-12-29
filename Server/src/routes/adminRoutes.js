import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  getDashboardStats,
  getAllUsers,
  approveUser,
  rejectUser,
  updateUserRole,
  deleteUser,
  getActivityLogs,
  getPendingApprovals,
  bulkApproveUsers,
  bulkRejectUsers,
  getSystemOverview
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Dashboard stats
router.get('/dashboard', getDashboardStats);
router.get('/system-overview', getSystemOverview);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/approve', approveUser);
router.put('/users/:userId/reject', rejectUser);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Bulk operations
router.post('/users/bulk-approve', bulkApproveUsers);
router.post('/users/bulk-reject', bulkRejectUsers);

// Activity logs
router.get('/activity-logs', getActivityLogs);

// Pending approvals
router.get('/pending-approvals', getPendingApprovals);

export default router;
