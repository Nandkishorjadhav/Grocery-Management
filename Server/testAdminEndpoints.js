import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './src/models/User.js';
import http from 'http';

const MONGODB_URI = 'mongodb://localhost:27017/grocery_management';
const JWT_SECRET = 'your_jwt_secret_key_here_change_this_in_production';
const API_URL = 'http://localhost:5000';

// Simple HTTP request function
function makeRequest(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: { error: 'Invalid JSON response' }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testAdminEndpoints() {
  try {
    console.log('🔍 Testing Admin Panel Endpoints...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find an admin user
    const adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.log('❌ No admin user found!');
      process.exit(1);
    }

    console.log('👤 Using Admin User:');
    console.log('   Name:', adminUser.name);
    console.log('   Email:', adminUser.email);
    console.log('   Role:', adminUser.role);
    console.log('   IsAdmin:', adminUser.isAdmin);
    console.log('');

    // Generate JWT token with the same format as authController
    const token = jwt.sign({ id: adminUser._id }, JWT_SECRET, { expiresIn: '30d' });
    console.log('🔑 Generated JWT Token (first 50 chars):', token.substring(0, 50) + '...\n');

    // Test endpoints
    const endpoints = [
      { name: 'Dashboard Stats', path: '/admin/dashboard' },
      { name: 'All Users', path: '/admin/users' },
      { name: 'Pending Approvals', path: '/admin/pending-approvals' },
      { name: 'Activity Logs', path: '/admin/activity-logs' },
      { name: 'All Orders', path: '/admin/orders' },
      { name: 'Inventory Data', path: '/admin/inventory' },
      { name: 'Reports', path: '/admin/reports' }
    ];

    console.log('🧪 Testing Admin Endpoints:\n');
    console.log('='.repeat(80));
    
    for (const endpoint of endpoints) {
      try {
        const response = await makeRequest(endpoint.path, token);
        const data = response.data;
        
        if (response.status === 200) {
          console.log(`✅ ${endpoint.name.padEnd(25)} - Status: ${response.status} OK`);
          
          // Show sample data structure
          if (endpoint.path === '/admin/dashboard' && data.stats) {
            console.log(`   📊 Stats: ${JSON.stringify(data.stats)}`);
          } else if (endpoint.path === '/admin/users' && data.users) {
            console.log(`   👥 Users Count: ${data.users.length}`);
          } else if (endpoint.path === '/admin/orders' && data.orders) {
            console.log(`   🛒 Orders Count: ${data.orders.length}`);
          }
        } else {
          console.log(`❌ ${endpoint.name.padEnd(25)} - Status: ${response.status}`);
          console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name.padEnd(25)} - Connection Error`);
        console.log(`   ${error.message}`);
      }
      console.log('-'.repeat(80));
    }

    console.log('\n✅ Testing completed!\n');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    process.exit(1);
  }
}

testAdminEndpoints();
