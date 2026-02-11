import React, { createContext, useContext, useState, useEffect } from 'react';
import groceryService from '../services/groceryService.js';
import cartService from '../services/cartService.js';
import sellerProductService from '../services/sellerProductService.js';
import { useAuth } from './AuthContext';

const GroceryContext = createContext();

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};

const STORAGE_KEY = 'grocery_data';

const initialData = {
  inventory: [
    { id: 1, name: 'Fresh Red Apples', category: 'Fruits', quantity: 25, unit: 'kg', price: 120, expiryDate: '2025-12-15', minStock: 5 },
    { id: 2, name: 'Whole Wheat Bread', category: 'Bakery', quantity: 15, unit: 'pcs', price: 45, expiryDate: '2025-11-28', minStock: 3 },
    { id: 3, name: 'Full Cream Milk', category: 'Dairy', quantity: 30, unit: 'L', price: 60, expiryDate: '2025-11-27', minStock: 8 },
    { id: 4, name: 'Organic Bananas', category: 'Fruits', quantity: 40, unit: 'kg', price: 50, expiryDate: '2025-12-01', minStock: 10 },
    { id: 5, name: 'Fresh Tomatoes', category: 'Vegetables', quantity: 20, unit: 'kg', price: 35, expiryDate: '2025-11-30', minStock: 5 },
    { id: 6, name: 'Green Capsicum', category: 'Vegetables', quantity: 12, unit: 'kg', price: 80, expiryDate: '2025-11-29', minStock: 3 },
    { id: 7, name: 'Farm Fresh Eggs', category: 'Dairy', quantity: 50, unit: 'dozen', price: 90, expiryDate: '2025-12-10', minStock: 15 },
    { id: 8, name: 'Cheddar Cheese', category: 'Dairy', quantity: 8, unit: 'kg', price: 450, expiryDate: '2025-12-20', minStock: 2 },
    { id: 9, name: 'Brown Rice', category: 'Grains', quantity: 35, unit: 'kg', price: 85, expiryDate: '2026-03-15', minStock: 10 },
    { id: 10, name: 'Fresh Orange Juice', category: 'Beverages', quantity: 18, unit: 'L', price: 95, expiryDate: '2025-11-26', minStock: 5 },
    { id: 11, name: 'Potato Chips', category: 'Snacks', quantity: 45, unit: 'pcs', price: 25, expiryDate: '2026-01-15', minStock: 12 },
    { id: 12, name: 'Chocolate Cookies', category: 'Snacks', quantity: 30, unit: 'pcs', price: 40, expiryDate: '2025-12-30', minStock: 8 },
    { id: 13, name: 'Fresh Spinach', category: 'Vegetables', quantity: 10, unit: 'kg', price: 30, expiryDate: '2025-11-26', minStock: 3 },
    { id: 14, name: 'Sweet Oranges', category: 'Fruits', quantity: 28, unit: 'kg', price: 70, expiryDate: '2025-12-05', minStock: 8 },
    { id: 15, name: 'Green Grapes', category: 'Fruits', quantity: 15, unit: 'kg', price: 110, expiryDate: '2025-11-28', minStock: 4 },
    { id: 16, name: 'Chicken Breast', category: 'Meat', quantity: 12, unit: 'kg', price: 280, expiryDate: '2025-11-25', minStock: 3 },
    { id: 17, name: 'Fresh Carrots', category: 'Vegetables', quantity: 22, unit: 'kg', price: 45, expiryDate: '2025-12-08', minStock: 6 },
    { id: 18, name: 'Greek Yogurt', category: 'Dairy', quantity: 25, unit: 'pcs', price: 65, expiryDate: '2025-11-30', minStock: 8 },
    { id: 19, name: 'Mango Juice', category: 'Beverages', quantity: 20, unit: 'L', price: 85, expiryDate: '2025-11-27', minStock: 6 },
    { id: 20, name: 'Almond Nuts', category: 'Snacks', quantity: 15, unit: 'kg', price: 650, expiryDate: '2026-02-20', minStock: 4 },
    { id: 21, name: 'Fresh Cauliflower', category: 'Vegetables', quantity: 18, unit: 'pcs', price: 40, expiryDate: '2025-11-27', minStock: 5 },
    { id: 22, name: 'Strawberries', category: 'Fruits', quantity: 10, unit: 'kg', price: 180, expiryDate: '2025-11-26', minStock: 2 },
    { id: 23, name: 'Butter', category: 'Dairy', quantity: 20, unit: 'pcs', price: 55, expiryDate: '2025-12-15', minStock: 6 },
    { id: 24, name: 'Green Peas', category: 'Vegetables', quantity: 14, unit: 'kg', price: 60, expiryDate: '2025-11-28', minStock: 4 },
  ],
  shoppingList: [
    { id: 1, name: 'Bananas', category: 'Fruits', quantity: 3, unit: 'kg', purchased: false },
    { id: 2, name: 'Eggs', category: 'Dairy', quantity: 12, unit: 'pcs', purchased: false },
  ],
  categories: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Snacks', 'Beverages', 'Grains', 'Others'],
};

export const GroceryProvider = ({ children }) => {
  const auth = useAuth();
  const [inventory, setInventory] = useState(initialData.inventory);
  const [shoppingList, setShoppingList] = useState(initialData.shoppingList);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState(['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Snacks', 'Beverages', 'Grains', 'Others']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inventory from backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Fetch regular inventory
      const inventoryResponse = await groceryService.inventoryService.getAll();
      
      // Fetch approved seller products
      let approvedSellerProducts = [];
      try {
        const sellerResponse = await sellerProductService.getMarketplaceProducts();
        console.log('✅ Approved seller products:', sellerResponse);
        
        // Transform seller products to match inventory format
        approvedSellerProducts = (sellerResponse.products || []).map(product => ({
          _id: product._id,
          id: product._id,
          name: product.productName,
          category: product.category,
          quantity: product.quantity,
          unit: product.unit,
          price: product.finalPrice,
          expiryDate: product.expiryDate,
          description: product.description,
          images: product.images,
          seller: product.sellerName,
          minStock: 5,
          isSellerProduct: true // Flag to identify seller products
        }));
        console.log('🔄 Transformed seller products:', approvedSellerProducts.length);
      } catch (sellerError) {
        console.log('No seller products available:', sellerError.message);
      }
      
      // Combine regular inventory with approved seller products
      const combinedInventory = [...inventoryResponse, ...approvedSellerProducts];
      console.log('📦 Combined inventory count:', combinedInventory.length);
      
      setInventory(combinedInventory);
      setError(null);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError(error.message);
      // Keep using initialData as fallback
      console.log('Using local dummy data as fallback');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    // Only fetch cart if user is authenticated
    if (!auth?.isAuthenticated || !auth.isAuthenticated()) {
      setCart([]);
      setCartCount(0);
      return;
    }

    try {
      const response = await cartService.getCartItems();
      if (response && response.success) {
        setCart(response.data || []);
        setCartCount(response.totalItems || 0);
      }
    } catch (error) {
      // Silently handle 401 errors for unauthenticated users
      if (error.message !== 'Invalid token') {
        console.error('Error fetching cart:', error);
      }
      setCart([]);
      setCartCount(0);
    }
  };

  // Fetch shopping list from backend
  const fetchShoppingList = async () => {
    try {
      const response = await groceryService.shoppingListService.getAll();
      setShoppingList(response);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      // Keep initial shopping list as fallback
    }
  };

  // Load data on mount
  useEffect(() => {
    // Try to fetch from API, but don't block rendering
    fetchInventory().catch(err => console.log('Failed to fetch inventory, using local data'));
    fetchShoppingList().catch(err => console.log('Failed to fetch shopping list, using local data'));
  }, []);

  // Fetch cart when auth state changes
  useEffect(() => {
    if (!auth?.loading) {
      fetchCart().catch(err => console.log('Failed to fetch cart, starting with empty cart'));
    }
  }, [auth?.user, auth?.loading]);

  // Inventory functions
  const addInventoryItem = async (item) => {
    try {
      const newItem = await groceryService.inventoryService.create(item);
      setInventory([...inventory, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const updateInventoryItem = async (id, updates) => {
    try {
      const updatedItem = await groceryService.inventoryService.update(id, updates);
      setInventory(inventory.map(item => item._id === id ? updatedItem : item));
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteInventoryItem = async (id) => {
    try {
      await groceryService.inventoryService.delete(id);
      setInventory(inventory.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  // Cart functions
  const addToCart = async (product) => {
    if (!auth.isAuthenticated()) {
      auth.openAuthModal();
      return null;
    }

    try {
      const cartItem = {
        productId: product._id || product.id,
        name: product.name,
        category: product.category,
        quantity: 1,
        unit: product.unit,
        price: product.price
      };
      
      const response = await cartService.addToCart(cartItem);
      if (response && response.success) {
        await fetchCart(); // Refresh cart
        return response.data;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback: add to local state
      const newCartItem = {
        _id: Date.now().toString(),
        ...product,
        quantity: 1,
        totalPrice: product.price
      };
      setCart([...cart, newCartItem]);
      setCartCount(cartCount + 1);
      return newCartItem;
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await cartService.removeFromCart(id);
      if (response && response.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateCartItemQuantity = async (id, quantity) => {
    try {
      const response = await cartService.updateCartItem(id, quantity);
      if (response && response.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const incrementCartItem = async (id) => {
    try {
      const response = await cartService.incrementQuantity(id);
      if (response && response.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error incrementing cart item:', error);
      throw error;
    }
  };

  const decrementCartItem = async (id) => {
    try {
      const response = await cartService.decrementQuantity(id);
      if (response && response.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error decrementing cart item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      if (response && response.success) {
        setCart([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Shopping list functions
  const addShoppingItem = async (item) => {
    try {
      const newItem = await groceryService.shoppingListService.create(item);
      setShoppingList([...shoppingList, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error adding shopping item:', error);
      throw error;
    }
  };

  const updateShoppingItem = async (id, updates) => {
    try {
      const updatedItem = await groceryService.shoppingListService.update(id, updates);
      setShoppingList(shoppingList.map(item => item._id === id ? updatedItem : item));
      return updatedItem;
    } catch (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
  };

  const deleteShoppingItem = async (id) => {
    try {
      await groceryService.shoppingListService.delete(id);
      setShoppingList(shoppingList.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      throw error;
    }
  };

  const togglePurchased = async (id) => {
    try {
      const updatedItem = await groceryService.shoppingListService.togglePurchased(id);
      setShoppingList(shoppingList.map(item => item._id === id ? updatedItem : item));
    } catch (error) {
      console.error('Error toggling purchased:', error);
      throw error;
    }
  };

  // Category functions
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Get low stock items
  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.minStock);
  };

  // Get expiring soon items (within 7 days)
  const getExpiringSoonItems = () => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return inventory.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= sevenDaysFromNow && expiryDate >= new Date();
    });
  };

  const value = {
    inventory,
    shoppingList,
    cart,
    cartCount,
    categories,
    loading,
    error,
    // Inventory methods
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    fetchInventory,
    // Cart methods
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    incrementCartItem,
    decrementCartItem,
    clearCart,
    fetchCart,
    // Shopping list methods
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    togglePurchased,
    fetchShoppingList,
    // Utility methods
    addCategory,
    getLowStockItems,
    getExpiringSoonItems,
  };

  return <GroceryContext.Provider value={value}>{children}</GroceryContext.Provider>;
};
