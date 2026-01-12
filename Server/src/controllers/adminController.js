import User from '../models/User.js';
import Inventory from '../models/Inventory.js';
import Cart from '../models/Cart.js';
import ShoppingList from '../models/ShoppingList.js';
import Order from '../models/Order.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'approved' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const totalProducts = await Inventory.countDocuments();
    const lowStockProducts = await Inventory.countDocuments({ quantity: { $lt: 10 } });

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password -otp');

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        pendingUsers,
        totalProducts,
        lowStockProducts
      },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { status, role, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -otp')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'approved' },
      { new: true }
    ).select('-password -otp');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'rejected' },
      { new: true }
    ).select('-password -otp');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User rejected successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role, isAdmin: role === 'admin' },
      { new: true }
    ).select('-password -otp');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clean up user's data
    await Cart.deleteMany({ userId });
    await ShoppingList.deleteMany({ userId });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get activity logs
export const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get recent user logins
    const recentLogins = await User.find({ lastLogin: { $exists: true } })
      .sort({ lastLogin: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name email mobile lastLogin');

    // Get recent registrations
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email mobile createdAt status');

    res.json({
      recentLogins,
      recentRegistrations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending approvals
export const getPendingApprovals = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .select('-password -otp');

    res.json({ pendingUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk approve users
export const bulkApproveUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }

    await User.updateMany(
      { _id: { $in: userIds } },
      { status: 'approved' }
    );

    res.json({ message: `${userIds.length} users approved successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk reject users
export const bulkRejectUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }

    await User.updateMany(
      { _id: { $in: userIds } },
      { status: 'rejected' }
    );

    res.json({ message: `${userIds.length} users rejected successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get system overview
export const getSystemOverview = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const productStats = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          lowStock: {
            $sum: { $cond: [{ $lt: ['$quantity', 10] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      userStats,
      productStats: productStats[0] || { totalProducts: 0, totalValue: 0, lowStock: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'name email mobile');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory data
export const getInventoryData = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 100 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const inventory = await Inventory.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Inventory.countDocuments(query);

    res.json({
      inventory,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalItems: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update inventory item
export const updateInventory = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updateData = req.body;

    const item = await Inventory.findByIdAndUpdate(
      itemId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory updated successfully', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reports and analytics
export const getReports = async (req, res) => {
  try {
    // Calculate sales overview
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // User statistics
    const totalUsers = await User.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeToday = await User.countDocuments({
      lastLogin: { $gte: today }
    });

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Inventory status
    const totalProducts = await Inventory.countDocuments();
    const lowStockItems = await Inventory.countDocuments({ quantity: { $lt: 10, $gt: 0 } });
    const outOfStock = await Inventory.countDocuments({ quantity: 0 });

    // Order status breakdown
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          category: { $first: '$items.category' },
          orderCount: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalRevenue: orderStats[0]?.totalRevenue || 0,
      totalOrders: orderStats[0]?.totalOrders || 0,
      avgOrderValue: orderStats[0]?.avgOrderValue || 0,
      totalUsers,
      activeToday,
      newThisMonth,
      totalProducts,
      lowStockItems,
      outOfStock,
      pendingOrders,
      processingOrders,
      completedOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
