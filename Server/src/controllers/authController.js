import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import emailService from '../services/emailService.js';
import smsService from '../services/smsService.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d'
  });
};

// Display OTP prominently in terminal
const displayOTPInTerminal = (method, contact, otp) => {
  console.log('\n' + '='.repeat(60));
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║' + '           🔐 YOUR OTP CODE (COPY THIS!)'.padEnd(58) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║' + `           Method: ${method.toUpperCase()}`.padEnd(58) + '║');
  console.log('║' + `           ${method === 'email' ? 'Email' : 'Mobile'}: ${contact}`.padEnd(58) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║' + `                    OTP: ${otp}`.padEnd(58) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║' + '           Valid for: 10 minutes'.padEnd(58) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('='.repeat(60) + '\n');
};

// Send OTP via Email or SMS
const sendOTP = async (method, contact, otp, userName = 'User') => {
  try {
    console.log(`\n📤 Sending OTP via ${method} to ${contact}`);
    
    if (method === 'email') {
      const result = await emailService.sendOTP(contact, otp, userName);
      if (result.success) {
        console.log(`✅ Email OTP sent successfully${result.mode === 'development' ? ' (DEV MODE)' : ''}`);
        // Always show OTP in terminal for easy access
        displayOTPInTerminal(method, contact, otp);
        return true;
      }
    } else if (method === 'mobile') {
      const result = await smsService.sendOTP(contact, otp);
      if (result.success) {
        console.log(`✅ SMS OTP sent successfully${result.mode === 'development' ? ' (DEV MODE)' : ''}`);
        // Always show OTP in terminal for easy access
        displayOTPInTerminal(method, contact, otp);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Failed to send OTP via ${method}:`, error.message);
    
    // In development, log OTP to console as fallback
    if (process.env.NODE_ENV === 'development') {
      displayOTPInTerminal(method, contact, otp);
      return true;
    }
    
    throw error;
  }
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
    
    console.log(`\n🎯 Initiating authentication for: ${contact}`);
    console.log(`🔢 Generated OTP: ${otp}`);
    
    const otpSent = await sendOTP(method, contact, otp, name || user.name);
    
    if (!otpSent) {
      return res.status(500).json({
        success: false,
        error: `Failed to send OTP to your ${method}. Please try again.`
      });
    }

    res.json({
      success: true,
      message: `OTP sent to your ${method}. Check the server console for OTP code!`,
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
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        loginMethod: user.loginMethod,
        role: user.role,
        isAdmin: user.isAdmin
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
    
    console.log(`\n🔄 Resending OTP for: ${contact}`);
    console.log(`🔢 New OTP: ${otp}`);
    
    const otpSent = await sendOTP(user.loginMethod, contact, otp, user.name);
    
    if (!otpSent) {
      return res.status(500).json({
        success: false,
        error: `Failed to resend OTP to your ${user.loginMethod}. Please try again.`
      });
    }

    res.json({
      success: true,
      message: `OTP resent to your ${user.loginMethod}. Check the server console for OTP code!`
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
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        loginMethod: user.loginMethod,
        isVerified: user.isVerified,
        role: user.role,
        isAdmin: user.isAdmin,
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

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: 'Email is already in use'
        });
      }
    }

    // Check if mobile is being changed and if it's already in use
    if (mobile && mobile !== user.mobile) {
      const mobileExists = await User.findOne({ mobile, _id: { $ne: user._id } });
      if (mobileExists) {
        return res.status(400).json({
          success: false,
          error: 'Mobile number is already in use'
        });
      }
    }

    // Update user fields
    user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        loginMethod: user.loginMethod,
        isVerified: user.isVerified,
        role: user.role,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
