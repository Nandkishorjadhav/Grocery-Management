import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  togglePurchased,
  clearPurchased
} from '../controllers/shoppingListController.js';

const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.patch('/:id/toggle', togglePurchased);
router.delete('/purchased/clear', clearPurchased);

export default router;
