import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
  getExpiringSoonItems
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getAllItems);
router.get('/low-stock', getLowStockItems);
router.get('/expiring-soon', getExpiringSoonItems);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
