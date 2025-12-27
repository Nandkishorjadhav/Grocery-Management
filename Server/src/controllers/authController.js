import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d'
  });
};

// Send OTP (Mock implementation - in production, integrate with SMS/Email service)
const sendOTP = async (method, contact, otp) => {
  console.log(`📱 Sending OTP to ${method}: ${contact}`);
  console.log(`🔐 OTP: ${otp} (Valid for 10 minutes)`);
  // TODO: Integrate with actual SMS/Email service (Twilio, SendGrid, etc.)
  return true;
};

// Register/Login with Email or Mobile (Step 1: Send OTP)
export const initiateAuth = async (req, res) => {
  try {
    const { email, mobile, name, method } = req.body;

    if (!method || (method !== 'email' && method !== 'mobile')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid authentication method'
      });
    }

    if (method === 'email' && !email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    if (method === 'mobile' && !mobile) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number is required'
      });
    }

    // Find or create user
    const query = method === 'email' ? { email } : { mobile };
    let user = await User.findOne(query);

    let isNewUser = false;
    if (!user) {
      // New user registration
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Name is required for new users'
        });
      }

      user = new User({
        name,
        email: method === 'email' ? email : undefined,
        mobile: method === 'mobile' ? mobile : undefined,
        loginMethod: method
      });
      isNewUser = true;
    }

    // Generate and send OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via SMS or Email
    const contact = method === 'email' ? email : mobile;
    await sendOTP(method, contact, otp);

    res.json({
      success: true,
      message: `OTP sent to your ${method}`,
      isNewUser,
      userId: user._id
    });
  } catch (error) {
    console.error('Auth initiation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Verify OTP and complete authentication (Step 2: Verify OTP)
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        error: 'User ID and OTP are required'
      });
    }

    const user = await User.findById(userId).select('+otp +otpExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.lastLogin = Date.now();
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        loginMethod: user.loginMethod
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP
    const contact = user.email || user.mobile;
    await sendOTP(user.loginMethod, contact, otp);

    res.json({
      success: true,
      message: `OTP resent to your ${user.loginMethod}`
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        loginMethod: user.loginMethod,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
