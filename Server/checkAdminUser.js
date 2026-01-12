import mongoose from 'mongoose';
import User from './src/models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/grocery_management';

async function checkAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // First, check all users
    const allUsers = await User.find({});
    console.log(`\n📊 Total users in database: ${allUsers.length}`);

    // Find all admin users
    const adminUsers = await User.find({
      $or: [
        { role: 'admin' },
        { isAdmin: true }
      ]
    });

    console.log('\n========== ADMIN USERS IN DATABASE ==========');
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found!');
      console.log('\nTo create an admin user, run: npm run create-admin');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`\n--- Admin User ${index + 1} ---`);
        console.log('ID:', user._id);
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        console.log('Mobile:', user.mobile);
        console.log('role:', user.role, '(type:', typeof user.role + ')');
        console.log('isAdmin:', user.isAdmin, '(type:', typeof user.isAdmin + ')');
        console.log('isVerified:', user.isVerified);
        console.log('loginMethod:', user.loginMethod);
      });
    }
    console.log('=============================================\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdminUser();
