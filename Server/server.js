import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/database.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import shoppingListRoutes from './src/routes/shoppingListRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import sellerProductRoutes from './src/routes/sellerProductRoutes.js';
import saveForLaterRoutes from './src/routes/saveForLaterRoutes.js';
import couponRoutes from './src/routes/couponRoutes.js';
import emailService from './src/services/emailService.js';
import smsService from './src/services/smsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/saved-for-later', saveForLaterRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seller-products', sellerProductRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: dbConnected ? 'OK' : 'DEGRADED',
    message: 'Grocery Management API is running',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// 🔧 DEBUG ENDPOINT - Check OTP service status
app.get('/api/debug/services', async (req, res) => {
  try {
    // Check email service
    const emailInitialized = await emailService.initialize();
    // Check SMS service
    const smsInitialized = await smsService.initialize();

    res.json({
      status: 'OK',
      message: 'Service Status Report',
      services: {
        email: {
          provider: process.env.EMAIL_SERVICE || 'not configured',
          initialized: emailInitialized,
          user: process.env.EMAIL_USER ? '✓ configured' : '✗ missing',
          mode: process.env.NODE_ENV
        },
        sms: {
          provider: process.env.SMS_PROVIDER || 'not configured',
          initialized: smsInitialized,
          credentials: process.env.MSG91_AUTH_KEY ? '✓ configured' : '✗ missing',
          mode: process.env.NODE_ENV
        }
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        OTP_FALLBACK_ENABLED: process.env.NODE_ENV === 'development'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Service check failed',
      message: error.message
    });
  }
});

// API docs route
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Grocery Management API',
    health: '/api/health',
    publicExamples: [
      { method: 'POST', path: '/api/auth/initiate' },
      { method: 'POST', path: '/api/auth/verify-otp' },
      { method: 'GET', path: '/api/inventory' },
      { method: 'GET', path: '/api/inventory/low-stock' },
      { method: 'GET', path: '/api/inventory/expiring-soon' }
    ],
    protectedExamples: [
      { method: 'GET', path: '/api/auth/profile', auth: 'Bearer token required' },
      { method: 'GET', path: '/api/cart', auth: 'Bearer token required' },
      { method: 'GET', path: '/api/orders', auth: 'Bearer token required' },
      { method: 'GET', path: '/api/admin/dashboard', auth: 'Admin Bearer token required' }
    ]
  });
});

// Root status route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Grocery Management backend is running',
    health: '/api/health',
    docs: '/api',
    note: 'Use exact endpoint + HTTP method. Some routes require Bearer token.'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  
  // Initialize OTP services on startup
  console.log('\n📧 Checking Email Service...');
  const emailReady = await emailService.initialize();
  if (!emailReady) {
    console.warn('⚠️  Email service will run in fallback mode (console only)');
  }
  
  console.log('📱 Checking SMS Service...');
  const smsReady = await smsService.initialize();
  if (!smsReady) {
    console.warn('⚠️  SMS service will run in fallback mode (console only)');
  }
  
  console.log(`\n🔍 Current Environment: ${process.env.NODE_ENV}`);
  console.log(`💡 To debug OTP issues, visit: http://localhost:${PORT}/api/debug/services\n`);
});
