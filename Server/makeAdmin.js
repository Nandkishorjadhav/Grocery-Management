import mongoose from 'mongoose';
import User from './src/models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/grocery_management';

async function makeUserAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Update the actual user account
    const email = 'nandkishorjadhav9580@gmail.com';
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('========== BEFORE UPDATE ==========');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('role:', user.role);
    console.log('isAdmin:', user.isAdmin);

    // Make user admin
    user.isAdmin = true;
    user.role = 'admin';
    await user.save();

    console.log('\n========== AFTER UPDATE ==========');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('role:', user.role);
    console.log('isAdmin:', user.isAdmin);

    console.log('\n✅ User updated to admin successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 You can now login and see the Admin Panel button');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeUserAdmin();
