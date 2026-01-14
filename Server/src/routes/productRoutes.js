import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate as auth } from '../middleware/auth.js';
import Inventory from '../models/Inventory.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create a new product listing (user selling)
router.post('/sell', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      basePrice,
      gstPercent,
      gstAmount,
      finalPrice,
      quantity,
      unit,
      expiryDate
    } = req.body;

    // Get uploaded image paths
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create new product with seller information
    const product = new Inventory({
      name,
      category,
      description,
      basePrice: parseFloat(basePrice),
      gstPercent: parseFloat(gstPercent),
      gstAmount: parseFloat(gstAmount),
      price: parseFloat(finalPrice),
      quantity: parseFloat(quantity),
      unit,
      expiryDate: expiryDate || undefined,
      images,
      seller: req.user.id,
      sellerName: req.user.name,
      isUserListed: true,
      status: 'pending', // Admin approval required
      inStock: true
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product listed successfully! Waiting for admin approval.',
      product
    });
  } catch (error) {
    console.error('Error creating product listing:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to list product',
      message: error.message
    });
  }
});

// Get user's product listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const products = await Inventory.find({
      seller: req.user.id,
      isUserListed: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listings'
    });
  }
});

// Delete user's product listing
router.delete('/my-listings/:id', auth, async (req, res) => {
  try {
    const product = await Inventory.findOne({
      _id: req.params.id,
      seller: req.user.id,
      isUserListed: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Inventory.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Product listing deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product listing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete listing'
    });
  }
});

export default router;
