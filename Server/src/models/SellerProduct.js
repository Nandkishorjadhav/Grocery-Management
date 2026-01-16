import mongoose from 'mongoose';

const sellerProductSchema = new mongoose.Schema({
  // Seller Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sellerName: {
    type: String,
    required: true
  },
  sellerContact: {
    email: String,
    mobile: String
  },

  // Product Details
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },

  // Pricing
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  gstPercentage: {
    type: Number,
    required: true,
    default: 5,
    enum: [0, 5, 12, 18, 28]
  },
  gstAmount: {
    type: Number
    // Auto-calculated in pre-save hook, not required in schema
  },
  finalPrice: {
    type: Number
    // Auto-calculated in pre-save hook, not required in schema
  },

  // Stock Information
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'piece', 'dozen', 'pack']
  },

  // Product Images
  images: [{
    url: {
      type: String,
      required: true
    },
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Additional Details
  expiryDate: {
    type: Date
  },
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },

  // Status and Approval
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'expired'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },

  // Sales Information
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  soldQuantity: {
    type: Number,
    default: 0
  },
  soldAt: {
    type: Date
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
sellerProductSchema.index({ seller: 1, status: 1 });
sellerProductSchema.index({ category: 1, status: 1 });
sellerProductSchema.index({ status: 1, createdAt: -1 });
sellerProductSchema.index({ productName: 'text', description: 'text' });

// Calculate GST and final price before saving
sellerProductSchema.pre('save', function(next) {
  // Always calculate if basePrice or gstPercentage exists (including initial creation)
  if (this.basePrice !== undefined && this.gstPercentage !== undefined) {
    this.gstAmount = (this.basePrice * this.gstPercentage) / 100;
    this.finalPrice = this.basePrice + this.gstAmount;
  }
  this.updatedAt = Date.now();
  next();
});

// Virtual for remaining quantity
sellerProductSchema.virtual('remainingQuantity').get(function() {
  return this.quantity - this.soldQuantity;
});

// Instance method to mark as sold
sellerProductSchema.methods.markAsSold = async function(buyerId, quantity) {
  this.soldQuantity += quantity;
  if (this.soldQuantity >= this.quantity) {
    this.status = 'sold';
    this.soldAt = Date.now();
  }
  this.soldTo = buyerId;
  await this.save();
};

// Instance method to increment views
sellerProductSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Instance method to increment inquiries
sellerProductSchema.methods.incrementInquiries = async function() {
  this.inquiries += 1;
  await this.save();
};

// Static method to get products by seller
sellerProductSchema.statics.getBySellerFiltered = function(sellerId, filters = {}) {
  const query = { seller: sellerId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get approved products
sellerProductSchema.statics.getApprovedProducts = function(filters = {}) {
  const query = { status: 'approved' };
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.minPrice) {
    query.finalPrice = { $gte: filters.minPrice };
  }
  
  if (filters.maxPrice) {
    query.finalPrice = { ...query.finalPrice, $lte: filters.maxPrice };
  }
  
  return this.find(query)
    .populate('seller', 'name email mobile')
    .sort({ createdAt: -1 });
};

const SellerProduct = mongoose.model('SellerProduct', sellerProductSchema);

export default SellerProduct;
