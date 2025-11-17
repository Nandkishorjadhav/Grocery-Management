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
    { id: 1, name: 'Apples', category: 'Fruits', quantity: 5, unit: 'kg', price: 3.99, expiryDate: '2025-11-25', minStock: 2 },
    { id: 2, name: 'Bread', category: 'Bakery', quantity: 2, unit: 'pcs', price: 2.49, expiryDate: '2025-11-20', minStock: 1 },
    { id: 3, name: 'Milk', category: 'Dairy', quantity: 4, unit: 'L', price: 3.29, expiryDate: '2025-11-22', minStock: 2 },
  ],
  shoppingList: [
    { id: 1, name: 'Bananas', category: 'Fruits', quantity: 3, unit: 'kg', purchased: false },
    { id: 2, name: 'Eggs', category: 'Dairy', quantity: 12, unit: 'pcs', purchased: false },
  ],
  categories: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Snacks', 'Beverages', 'Others'],
};

export const GroceryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [categories, setCategories] = useState(initialData.categories);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setInventory(parsed.inventory || initialData.inventory);
        setShoppingList(parsed.shoppingList || initialData.shoppingList);
        setCategories(parsed.categories || initialData.categories);
      } else {
        setInventory(initialData.inventory);
        setShoppingList(initialData.shoppingList);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setInventory(initialData.inventory);
      setShoppingList(initialData.shoppingList);
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
