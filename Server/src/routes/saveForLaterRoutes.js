import express from 'express';
import {
  getSaveForLaterItems,
  addToSaveForLater,
  removeFromSaveForLater,
  moveToCart,
  clearSaveForLater
} from '../controllers/saveForLaterController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All save for later routes require authentication
router.use(authenticate);

router.get('/', getSaveForLaterItems);
router.post('/', addToSaveForLater);
router.delete('/:id', removeFromSaveForLater);
router.patch('/:id/move-to-cart', moveToCart);
router.delete('/', clearSaveForLater);

export default router;
