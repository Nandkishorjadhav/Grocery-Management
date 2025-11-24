import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [inventory, setInventory] = useState(initialData.inventory);
  const [shoppingList, setShoppingList] = useState(initialData.shoppingList);
  const [categories, setCategories] = useState(initialData.categories);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Force clear old data and use new dummy products
      localStorage.removeItem(STORAGE_KEY);
      console.log('Loaded 24 dummy products:', initialData.inventory.length);
      
      // Uncomment below to enable localStorage persistence later
      /*
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setInventory(parsed.inventory || initialData.inventory);
        setShoppingList(parsed.shoppingList || initialData.shoppingList);
        setCategories(parsed.categories || initialData.categories);
      }
      */
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ inventory, shoppingList, categories }));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [inventory, shoppingList, categories]);

  // Inventory functions
  const addInventoryItem = (item) => {
    const newItem = { ...item, id: Date.now() };
    setInventory([...inventory, newItem]);
  };

  const updateInventoryItem = (id, updates) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // Shopping list functions
  const addShoppingItem = (item) => {
    const newItem = { ...item, id: Date.now(), purchased: false };
    setShoppingList([...shoppingList, newItem]);
  };

  const updateShoppingItem = (id, updates) => {
    setShoppingList(shoppingList.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteShoppingItem = (id) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const togglePurchased = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
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
    categories,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    togglePurchased,
    addCategory,
    getLowStockItems,
    getExpiringSoonItems,
  };

  return <GroceryContext.Provider value={value}>{children}</GroceryContext.Provider>;
};
