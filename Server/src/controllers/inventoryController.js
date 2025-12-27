import Inventory from '../models/Inventory.js';

// Get all inventory items
export const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single inventory item
export const getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new inventory item
export const createItem = async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update inventory item
export const updateItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete inventory item
export const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    const lowStock = items.filter(item => item.quantity <= item.minStock);
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expiring soon items
export const getExpiringSoonItems = async (req, res) => {
  try {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const items = await Inventory.find({
      expiryDate: {
        $lte: sevenDaysFromNow,
        $gte: new Date()
      }
    }).sort({ expiryDate: 1 });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
