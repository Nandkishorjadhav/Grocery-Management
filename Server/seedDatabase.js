import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inventory from './src/models/Inventory.js';

dotenv.config();

const products = [
  { name: 'Fresh Red Apples', category: 'Fruits', quantity: 25, unit: 'kg', price: 120, expiryDate: '2025-12-15', minStock: 5, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', description: 'Fresh, crispy red apples' },
  { name: 'Whole Wheat Bread', category: 'Bakery', quantity: 15, unit: 'pcs', price: 45, expiryDate: '2025-11-28', minStock: 3, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', description: 'Healthy whole wheat bread' },
  { name: 'Full Cream Milk', category: 'Dairy', quantity: 30, unit: 'L', price: 60, expiryDate: '2025-11-27', minStock: 8, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', description: 'Fresh full cream milk' },
  { name: 'Organic Bananas', category: 'Fruits', quantity: 40, unit: 'kg', price: 50, expiryDate: '2025-12-01', minStock: 10, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', description: 'Ripe organic bananas' },
  { name: 'Fresh Tomatoes', category: 'Vegetables', quantity: 20, unit: 'kg', price: 35, expiryDate: '2025-11-30', minStock: 5, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', description: 'Fresh red tomatoes' },
  { name: 'Green Capsicum', category: 'Vegetables', quantity: 12, unit: 'kg', price: 80, expiryDate: '2025-11-29', minStock: 3, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', description: 'Fresh green capsicum' },
  { name: 'Farm Fresh Eggs', category: 'Dairy', quantity: 50, unit: 'dozen', price: 90, expiryDate: '2025-12-10', minStock: 15, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', description: 'Fresh farm eggs' },
  { name: 'Cheddar Cheese', category: 'Dairy', quantity: 8, unit: 'kg', price: 450, expiryDate: '2025-12-20', minStock: 2, image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400', description: 'Premium cheddar cheese' },
  { name: 'Brown Rice', category: 'Grains', quantity: 35, unit: 'kg', price: 85, expiryDate: '2026-03-15', minStock: 10, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Nutritious brown rice' },
  { name: 'Fresh Orange Juice', category: 'Beverages', quantity: 18, unit: 'L', price: 95, expiryDate: '2025-11-26', minStock: 5, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', description: 'Fresh orange juice' },
  { name: 'Potato Chips', category: 'Snacks', quantity: 45, unit: 'pcs', price: 25, expiryDate: '2026-01-15', minStock: 12, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', description: 'Crispy potato chips' },
  { name: 'Chocolate Cookies', category: 'Snacks', quantity: 30, unit: 'pcs', price: 40, expiryDate: '2025-12-30', minStock: 8, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', description: 'Delicious chocolate cookies' },
  { name: 'Fresh Spinach', category: 'Vegetables', quantity: 10, unit: 'kg', price: 30, expiryDate: '2025-11-26', minStock: 3, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', description: 'Fresh green spinach' },
  { name: 'Sweet Oranges', category: 'Fruits', quantity: 28, unit: 'kg', price: 70, expiryDate: '2025-12-05', minStock: 8, image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400', description: 'Sweet juicy oranges' },
  { name: 'Green Grapes', category: 'Fruits', quantity: 15, unit: 'kg', price: 110, expiryDate: '2025-11-28', minStock: 4, image: 'https://images.unsplash.com/photo-1599819177333-612e79d4a0f7?w=400', description: 'Fresh green grapes' },
  { name: 'Chicken Breast', category: 'Meat', quantity: 12, unit: 'kg', price: 280, expiryDate: '2025-11-25', minStock: 3, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', description: 'Fresh chicken breast' },
  { name: 'Fresh Carrots', category: 'Vegetables', quantity: 22, unit: 'kg', price: 45, expiryDate: '2025-12-08', minStock: 6, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', description: 'Crunchy fresh carrots' },
  { name: 'Greek Yogurt', category: 'Dairy', quantity: 25, unit: 'pcs', price: 65, expiryDate: '2025-11-30', minStock: 8, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', description: 'Creamy Greek yogurt' },
  { name: 'Mango Juice', category: 'Beverages', quantity: 20, unit: 'L', price: 85, expiryDate: '2025-11-27', minStock: 6, image: 'https://images.unsplash.com/photo-1591271300850-e3ff83228841?w=400', description: 'Fresh mango juice' },
  { name: 'Almond Nuts', category: 'Snacks', quantity: 15, unit: 'kg', price: 650, expiryDate: '2026-02-20', minStock: 4, image: 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=400', description: 'Premium almond nuts' },
  { name: 'Fresh Cauliflower', category: 'Vegetables', quantity: 18, unit: 'pcs', price: 40, expiryDate: '2025-11-27', minStock: 5, image: 'https://images.unsplash.com/photo-1568584711743-99496e0c170a?w=400', description: 'Fresh white cauliflower' },
  { name: 'Strawberries', category: 'Fruits', quantity: 10, unit: 'kg', price: 180, expiryDate: '2025-11-26', minStock: 2, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', description: 'Sweet strawberries' },
  { name: 'Butter', category: 'Dairy', quantity: 20, unit: 'pcs', price: 55, expiryDate: '2025-12-15', minStock: 6, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', description: 'Creamy butter' },
  { name: 'Green Peas', category: 'Vegetables', quantity: 14, unit: 'kg', price: 60, expiryDate: '2025-11-28', minStock: 4, image: 'https://images.unsplash.com/photo-1601493700603-3c5a3ca6c9e8?w=400', description: 'Fresh green peas' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery_management');
    console.log('✅ Connected to MongoDB');

    // Clear existing inventory
    await Inventory.deleteMany({});
    console.log('🗑️  Cleared existing inventory');

    // Insert products
    await Inventory.insertMany(products);
    console.log('✅ Added 24 products to inventory');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
