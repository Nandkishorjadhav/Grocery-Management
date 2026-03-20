import Coupon from '../models/Coupon.js';

// Get all active coupons
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    }).select('code description discountType discountValue minPurchaseAmount');
    
    res.json({ 
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Validate coupon code
export const validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coupon code is required' 
      });
    }

    const now = new Date();
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });

    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid or expired coupon code' 
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coupon usage limit exceeded' 
      });
    }

    // Check minimum purchase amount
    if (totalAmount < coupon.minPurchaseAmount) {
      return res.status(400).json({ 
        success: false, 
        error: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (totalAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    // Apply max discount limit if set
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    res.json({ 
      success: true,
      message: 'Coupon applied successfully',
      data: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: discount,
        finalAmount: totalAmount - discount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create coupon (admin only)
export const createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minPurchaseAmount, maxDiscountAmount, usageLimit, validFrom, validUntil } = req.body;

    // Validate required fields
    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ 
        success: false, 
        error: 'Coupon code already exists' 
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minPurchaseAmount: minPurchaseAmount || 0,
      maxDiscountAmount: maxDiscountAmount || null,
      usageLimit: usageLimit || null,
      validFrom,
      validUntil
    });

    res.status(201).json({ 
      success: true, 
      message: 'Coupon created successfully',
      data: coupon 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update coupon (admin only)
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true });
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        error: 'Coupon not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Coupon updated successfully',
      data: coupon 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete coupon (admin only)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        error: 'Coupon not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Coupon deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
