import Cart from '../models/Cart.js';
import Inventory from '../models/Inventory.js';

// Get all cart items
export const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('productId').sort({ addedAt: -1 });
    
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ 
      success: true,
      data: cartItems,
      count: cartItems.length,
      totalItems: count,
      totalPrice: total
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get cart count
export const getCartCount = async (req, res) => {
  try {
    const count = await Cart.countDocuments();
    const cartItems = await Cart.find();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ 
      success: true,
      count,
      totalItems
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, name, category, quantity, unit, price } = req.body;

    // Validate required fields
    if (!productId || !name || !category || !quantity || !unit || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Check if product exists in inventory
    const product = await Inventory.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found in inventory' 
      });
    }

    // Check if product already in cart
    const existingCartItem = await Cart.findOne({ productId });
    
    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += parseInt(quantity);
      existingCartItem.totalPrice = existingCartItem.quantity * existingCartItem.price;
      await existingCartItem.save();
      
      return res.status(200).json({ 
        success: true, 
        message: 'Cart updated successfully',
        data: existingCartItem 
      });
    }

    // Create new cart item
    const cartItem = await Cart.create({
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
      message: 'Item added to cart successfully',
      data: cartItem 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantity must be at least 1' 
      });
    }

    const cartItem = await Cart.findById(id);
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Cart item not found' 
      });
    }

    cartItem.quantity = parseInt(quantity);
    cartItem.totalPrice = cartItem.quantity * cartItem.price;
    await cartItem.save();

    res.json({ 
      success: true, 
      message: 'Cart item updated successfully',
      data: cartItem 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findByIdAndDelete(id);
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Cart item not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Item removed from cart successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({});
    
    res.json({ 
      success: true, 
      message: 'Cart cleared successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Increment cart item quantity
export const incrementQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cartItem = await Cart.findById(id);
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Cart item not found' 
      });
    }

    cartItem.quantity += 1;
    cartItem.totalPrice = cartItem.quantity * cartItem.price;
    await cartItem.save();

    res.json({ 
      success: true, 
      data: cartItem 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Decrement cart item quantity
export const decrementQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cartItem = await Cart.findById(id);
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Cart item not found' 
      });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.totalPrice = cartItem.quantity * cartItem.price;
      await cartItem.save();
      
      res.json({ 
        success: true, 
        data: cartItem 
      });
    } else {
      // If quantity is 1, remove from cart
      await Cart.findByIdAndDelete(id);
      res.json({ 
        success: true, 
        message: 'Item removed from cart' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
