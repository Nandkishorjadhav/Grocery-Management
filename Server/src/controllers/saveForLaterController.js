import SaveForLater from '../models/SaveForLater.js';
import Inventory from '../models/Inventory.js';
import SellerProduct from '../models/SellerProduct.js';

// Get all items in save for later
export const getSaveForLaterItems = async (req, res) => {
  try {
    const items = await SaveForLater.find().populate('productId').sort({ addedAt: -1 });
    
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ 
      success: true,
      data: items,
      count: items.length,
      totalItems: count,
      totalPrice: total
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add item to save for later
export const addToSaveForLater = async (req, res) => {
  try {
    const { productId, name, category, quantity, unit, price } = req.body;

    // Validate required fields
    if (!productId || !name || !category || !quantity || !unit || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Check if product exists
    const inventoryProduct = await Inventory.findById(productId);
    const sellerProduct = inventoryProduct
      ? null
      : await SellerProduct.findOne({ _id: productId, status: 'approved' });

    if (!inventoryProduct && !sellerProduct) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    // Check if product already in save for later
    const existingItem = await SaveForLater.findOne({ productId });
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
      await existingItem.save();
      
      return res.status(200).json({ 
        success: true, 
        message: 'Save for later updated successfully',
        data: existingItem 
      });
    }

    // Create new save for later item
    const item = await SaveForLater.create({
      productId,
      name,
      category,
      quantity: parseInt(quantity),
      unit,
      price: parseFloat(price),
      totalPrice: parseInt(quantity) * parseFloat(price)
    });

    res.status(201).json({ 
      success: true, 
      message: 'Item saved for later successfully',
      data: item 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove item from save for later
export const removeFromSaveForLater = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await SaveForLater.findByIdAndDelete(id);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found in save for later' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Item removed from save for later successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Move item from save for later to cart
export const moveToCart = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await SaveForLater.findByIdAndDelete(id);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found in save for later' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Item moved to cart successfully',
      data: item 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Clear all items from save for later
export const clearSaveForLater = async (req, res) => {
  try {
    await SaveForLater.deleteMany({});
    
    res.json({ 
      success: true, 
      message: 'Save for later cleared successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
