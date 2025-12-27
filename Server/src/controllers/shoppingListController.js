import ShoppingList from '../models/ShoppingList.js';

// Get all shopping list items
export const getAllItems = async (req, res) => {
  try {
    const items = await ShoppingList.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single shopping list item
export const getItemById = async (req, res) => {
  try {
    const item = await ShoppingList.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new shopping list item
export const createItem = async (req, res) => {
  try {
    const item = new ShoppingList(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update shopping list item
export const updateItem = async (req, res) => {
  try {
    const item = await ShoppingList.findByIdAndUpdate(
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

// Delete shopping list item
export const deleteItem = async (req, res) => {
  try {
    const item = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle purchased status
export const togglePurchased = async (req, res) => {
  try {
    const item = await ShoppingList.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    item.purchased = !item.purchased;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear purchased items
export const clearPurchased = async (req, res) => {
  try {
    const result = await ShoppingList.deleteMany({ purchased: true });
    res.json({ message: `${result.deletedCount} items deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
