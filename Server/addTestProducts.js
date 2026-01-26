import mongoose from 'mongoose';
import SellerProduct from './src/models/SellerProduct.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const addTestProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-management');
    console.log('✅ Connected to MongoDB');

    // Find or create a seller user
    let seller = await User.findOne({ email: 'seller@test.com' });
    
    if (!seller) {
      // Create a test seller
      seller = await User.create({
        name: 'Test Seller',
        email: 'seller@test.com',
        mobile: '9876543210',
        loginMethod: 'email',
        role: 'user',
        isVerified: true,
        isActive: true,
        status: 'approved'
      });
      console.log('✅ Created test seller:', seller.email);
    } else {
      console.log('✅ Using existing seller:', seller.email);
    }

    // Create test products
    const products = [
      {
        productName: 'Fresh Tomatoes',
        description: 'Organically grown fresh tomatoes',
        category: 'Vegetables',
        basePrice: 50,
        gstPercentage: 5,
        finalPrice: 52.5,
        quantity: 100,
        unit: 'kg',
        seller: seller._id,
        sellerName: seller.name,
        sellerContact: {
          email: seller.email,
          mobile: seller.mobile
        },
        status: 'pending',
        images: []
      },
      {
        productName: 'Fresh Apples',
        description: 'Juicy red apples from Kashmir',
        category: 'Fruits',
        basePrice: 150,
        gstPercentage: 5,
        finalPrice: 157.5,
        quantity: 50,
        unit: 'kg',
        seller: seller._id,
        sellerName: seller.name,
        sellerContact: {
          email: seller.email,
          mobile: seller.mobile
        },
        status: 'pending',
        images: []
      },
      {
        productName: 'Basmati Rice',
        description: 'Premium quality basmati rice',
        category: 'Grains',
        basePrice: 80,
        gstPercentage: 5,
        finalPrice: 84,
        quantity: 200,
        unit: 'kg',
        seller: seller._id,
        sellerName: seller.name,
        sellerContact: {
          email: seller.email,
          mobile: seller.mobile
        },
        status: 'pending',
        images: []
      }
    ];

    const createdProducts = await SellerProduct.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} test products for approval`);
    
    createdProducts.forEach(p => {
      console.log(`  - ${p.productName} (${p.category}) - Status: ${p.status}`);
    });

    console.log('\n✅ Test products added successfully!');
    console.log('👉 Refresh your Admin Panel to see the pending products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addTestProducts();
