import SellerProduct from '../models/SellerProduct.js';
import User from '../models/User.js';

// Create a new seller product
export const createSellerProduct = async (req, res) => {
  try {
    console.log('📦 Creating seller product...');
    console.log('📦 User ID:', req.user?.id);
    console.log('📦 Request body keys:', Object.keys(req.body));
    console.log('📦 Product name:', req.body.productName);
    
    const sellerId = req.user.id;
    const {
      productName,
      category,
      description,
      basePrice,
      gstPercentage,
      quantity,
      unit,
      expiryDate,
      brand,
      origin,
      images
    } = req.body;

    console.log('📦 Parsed data:', {
      productName,
      category,
      basePrice,
      gstPercentage,
      quantity,
      unit,
      imagesCount: images?.length
    });

    // Get seller details
    const seller = await User.findById(sellerId);
    if (!seller) {
      console.error('❌ Seller not found:', sellerId);
      return res.status(404).json({
        success: false,
        error: 'Seller not found'
      });
    }

    console.log('👤 Seller found:', seller.name);

    // Create seller product
    const sellerProduct = new SellerProduct({
      seller: sellerId,
      sellerName: seller.name,
      sellerContact: {
        email: seller.email,
        mobile: seller.mobile
      },
      productName,
      category,
      description,
      basePrice,
      gstPercentage: gstPercentage || 5,
      quantity,
      unit,
      expiryDate: expiryDate || null,
      brand: brand || '',
      origin: origin || '',
      images: images || []
    });

    console.log('💾 Saving product to database...');
    await sellerProduct.save();
    console.log('✅ Product saved successfully!');

    res.status(201).json({
      success: true,
      message: 'Product submitted for approval',
      product: sellerProduct
    });
  } catch (error) {
    console.error('❌ Create seller product error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create product'
    });
  }
};

// Get all seller products (for sellers to see their own products)
export const getMySellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { status, category, page = 1, limit = 10 } = req.query;

    const query = { seller: sellerId };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    const products = await SellerProduct.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SellerProduct.countDocuments(query);

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count
    });
  } catch (error) {
    console.error('Get my seller products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all approved seller products (public marketplace)
export const getApprovedSellerProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;

    const query = { status: 'approved', quantity: { $gt: 0 } };
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.finalPrice.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await SellerProduct.find(query)
      .populate('seller', 'name email mobile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SellerProduct.countDocuments(query);

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count
    });
  } catch (error) {
    console.error('Get approved seller products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single seller product by ID
export const getSellerProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await SellerProduct.findById(productId)
      .populate('seller', 'name email mobile');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Increment views
    await product.incrementViews();

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get seller product by ID error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update seller product (only by seller)
export const updateSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;
    const updates = req.body;

    const product = await SellerProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if user is the seller
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this product'
      });
    }

    // Don't allow updating if already approved or sold
    if (['approved', 'sold'].includes(product.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update approved or sold products'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'productName', 'category', 'description', 'basePrice',
      'gstPercentage', 'quantity', 'unit', 'expiryDate',
      'brand', 'origin', 'images'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        product[field] = updates[field];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update seller product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete seller product (only by seller)
export const deleteSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;

    const product = await SellerProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if user is the seller
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this product'
      });
    }

    // Don't allow deleting if sold
    if (product.status === 'sold') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete sold products'
      });
    }

    await SellerProduct.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete seller product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Approve seller product
export const approveSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const adminId = req.user.id;

    const product = await SellerProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    product.status = 'approved';
    product.approvedBy = adminId;
    product.approvedAt = Date.now();
    
    await product.save();

    res.json({
      success: true,
      message: 'Product approved successfully',
      product
    });
  } catch (error) {
    console.error('Approve seller product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Reject seller product
export const rejectSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { reason } = req.body;

    const product = await SellerProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    product.status = 'rejected';
    product.rejectionReason = reason || 'Not meeting quality standards';
    
    await product.save();

    res.json({
      success: true,
      message: 'Product rejected',
      product
    });
  } catch (error) {
    console.error('Reject seller product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Get all seller products with filters
export const getAllSellerProducts = async (req, res) => {
  try {
    const { status, seller, category, page = 1, limit = 20 } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (seller) {
      query.seller = seller;
    }
    
    if (category) {
      query.category = category;
    }

    const products = await SellerProduct.find(query)
      .populate('seller', 'name email mobile')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SellerProduct.countDocuments(query);

    // Get stats
    const stats = await SellerProduct.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      products,
      stats,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count
    });
  } catch (error) {
    console.error('Get all seller products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Record product inquiry
export const recordInquiry = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await SellerProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    await product.incrementInquiries();

    res.json({
      success: true,
      message: 'Inquiry recorded'
    });
  } catch (error) {
    console.error('Record inquiry error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
