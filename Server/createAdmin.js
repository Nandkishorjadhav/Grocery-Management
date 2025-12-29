import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery_management');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@groceryhub.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      
      // Update existing user to be admin
      existingAdmin.isAdmin = true;
      existingAdmin.role = 'admin';
      existingAdmin.status = 'approved';
      await existingAdmin.save();
      console.log('✅ Updated existing user to admin');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@groceryhub.com',
        password: hashedPassword,
        mobile: '9999999999',
        isVerified: true,
        isAdmin: true,
        role: 'admin',
        status: 'approved',
        loginMethod: 'email'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@groceryhub.com');
      console.log('🔑 Password: admin123');
    }

    console.log('🎉 Admin setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
