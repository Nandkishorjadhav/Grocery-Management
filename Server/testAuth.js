import mongoose from 'mongoose';
import User from './src/models/User.js';
import jwt from 'jsonwebtoken';

const MONGODB_URI = 'mongodb://localhost:27017/grocery_management';
const JWT_SECRET = 'your_jwt_secret_key_here_change_this_in_production';

async function testAuthResponse() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const adminUser = await User.findOne({ email: 'nandkishorjadhav9580@gmail.com' });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('========== DATABASE USER ==========');
    console.log('Name:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('role:', adminUser.role);
    console.log('isAdmin:', adminUser.isAdmin);
    console.log('isVerified:', adminUser.isVerified);

    // Simulate verifyOTP response
    console.log('\n========== VERIFY OTP RESPONSE (Login) ==========');
    const loginResponse = {
      success: true,
      message: 'Authentication successful',
      token: jwt.sign({ id: adminUser._id }, JWT_SECRET, { expiresIn: '7d' }),
      user: {
        _id: adminUser._id,
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        mobile: adminUser.mobile,
        loginMethod: adminUser.loginMethod,
        role: adminUser.role,
        isAdmin: adminUser.isAdmin
      }
    };
    console.log(JSON.stringify(loginResponse.user, null, 2));

    // Simulate getProfile response
    console.log('\n========== GET PROFILE RESPONSE ==========');
    const profileResponse = {
      success: true,
      user: {
        _id: adminUser._id,
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        mobile: adminUser.mobile,
        loginMethod: adminUser.loginMethod,
        isVerified: adminUser.isVerified,
        role: adminUser.role,
        isAdmin: adminUser.isAdmin,
        createdAt: adminUser.createdAt,
        lastLogin: adminUser.lastLogin
      }
    };
    console.log(JSON.stringify(profileResponse.user, null, 2));

    console.log('\n========== ADMIN BUTTON CONDITION CHECK ==========');
    console.log('user?.isAdmin:', loginResponse.user.isAdmin);
    console.log('user?.role === "admin":', loginResponse.user.role === 'admin');
    console.log('Button should show:', (loginResponse.user.isAdmin || loginResponse.user.role === 'admin'));

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAuthResponse();
