# Authentication System Documentation

## Overview
This document describes the authentication system implemented in the Grocery Management application. The system uses JWT tokens with OTP verification for user authentication via email or mobile number.

## Features
- **Dual Login Methods**: Users can authenticate using either email or mobile number
- **OTP Verification**: 6-digit OTP sent for authentication
- **JWT Tokens**: Secure token-based authentication with 30-day validity
- **Protected Routes**: Cart operations require authentication
- **Read-Only Browsing**: Unauthenticated users can browse products

## Backend Implementation

### User Model (`Server/src/models/User.js`)
```javascript
{
  name: String (required),
  email: String (optional, unique, validated),
  mobile: String (optional, unique, 10-digit validated),
  password: String (hashed with bcrypt),
  isVerified: Boolean (default: false),
  otp: String (6-digit, temporary),
  otpExpiry: Date (10 minutes validity),
  loginMethod: String (enum: 'email' | 'mobile'),
  createdAt: Date,
  lastLogin: Date
}
```

### Authentication Flow

#### 1. Initiate Authentication
**Endpoint**: `POST /api/auth/initiate`

**Request Body**:
```json
{
  "method": "email" | "mobile",
  "name": "John Doe",
  "email": "john@example.com" | null,
  "mobile": "9876543210" | null
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent to your email/mobile",
  "isNewUser": false,
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Process**:
1. Check if user exists by email/mobile
2. Create new user if not exists
3. Generate 6-digit OTP
4. Store OTP with 10-minute expiry
5. Send OTP (currently logs to console, needs SMS/Email integration)

#### 2. Verify OTP
**Endpoint**: `POST /api/auth/verify-otp`

**Request Body**:
```json
{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": null,
    "loginMethod": "email"
  }
}
```

**Process**:
1. Find user by ID
2. Verify OTP matches and not expired
3. Mark user as verified
4. Clear OTP from database
5. Generate JWT token
6. Return token and user data

#### 3. Resend OTP
**Endpoint**: `POST /api/auth/resend-otp`

**Request Body**:
```json
{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

### Authentication Middleware (`Server/src/middleware/auth.js`)
- Extracts JWT token from `Authorization` header
- Verifies token signature and expiry
- Attaches user data to `req.user`
- Returns 401 for invalid/expired tokens

### Protected Routes
All cart operations require authentication:
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `PATCH /api/cart/:id/increment` - Increment quantity
- `PATCH /api/cart/:id/decrement` - Decrement quantity
- `DELETE /api/cart/` - Clear cart
- `GET /api/cart/count` - Get cart count

## Frontend Implementation

### AuthContext (`Client/src/context/AuthContext.jsx`)
Manages authentication state globally:
- `user`: Current user object or null
- `loading`: Initial auth check loading state
- `showAuthModal`: Boolean to show/hide login modal
- `login(token, userData)`: Save token and user data
- `logout()`: Clear token and user data
- `openAuthModal()`: Show login modal
- `closeAuthModal()`: Hide login modal
- `isAuthenticated()`: Check if user is logged in

### AuthModal Component (`Client/src/components/common/AuthModal.jsx`)
Two-step authentication flow:

#### Step 1: Email/Mobile Input
- Toggle between email and mobile
- Name input (required for new users)
- Email or mobile number input with validation
- "Send OTP" button

#### Step 2: OTP Verification
- 6-digit OTP input
- Auto-focus on OTP field
- 60-second countdown timer
- "Resend OTP" button (enabled after countdown)
- "Change email/mobile" button to go back

### Protected Cart Actions
In `GroceryContext.jsx`, the `addToCart` function checks authentication:

```javascript
const addToCart = async (product) => {
  // Check authentication first
  if (!auth.isAuthenticated()) {
    auth.openAuthModal();
    return null;
  }
  
  // Proceed with adding to cart...
};
```

### Token Management
Tokens are stored in `localStorage` and automatically attached to all API requests via the `ApiService` class.

**Token Storage**:
- Key: `token`
- Value: JWT token string

**Auto-attach to requests**:
```javascript
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`,
  ...
}
```

## User Experience Flow

### For New Users
1. User browses products (read-only)
2. User clicks "Add to Cart"
3. Authentication modal opens
4. User selects email/mobile method
5. User enters name and email/mobile
6. User receives OTP (logged to console in development)
7. User enters OTP
8. User is authenticated
9. Product is added to cart
10. User can continue shopping

### For Returning Users
1. Token is loaded from localStorage
2. User is automatically authenticated
3. User can add to cart immediately
4. User profile shows in navbar
5. User can logout from dropdown menu

### For Logout
1. User clicks profile button in navbar
2. User clicks "Logout" in dropdown
3. Token and user data are cleared
4. User is redirected to browse mode
5. Cart actions now require re-authentication

## Security Features
1. **Password Hashing**: Bcrypt with salt rounds (currently not used for OTP-only auth)
2. **JWT Secret**: Stored in environment variable
3. **Token Expiry**: 30-day validity
4. **OTP Expiry**: 10-minute validity
5. **HTTPS Ready**: Token transmitted in Authorization header
6. **Input Validation**: Email and mobile validation on both client and server
7. **Error Handling**: Graceful error messages for invalid credentials

## Environment Variables
```env
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocery_management
```

## TODO: Production Enhancements
1. **SMS Integration**: Integrate Twilio or similar for mobile OTP
2. **Email Integration**: Use SendGrid or Nodemailer for email OTP
3. **Rate Limiting**: Prevent OTP spam
4. **Captcha**: Add captcha for OTP requests
5. **Password Option**: Allow traditional email/password authentication
6. **Refresh Tokens**: Implement refresh token rotation
7. **Session Management**: Track active sessions
8. **Account Recovery**: Password reset flow
9. **Email Verification**: Verify email addresses
10. **2FA**: Optional two-factor authentication

## Testing

### Test OTP Flow (Development)
1. Start backend server
2. Check console for OTP when initiating auth
3. Copy OTP from console logs
4. Paste in frontend modal
5. Verify successful authentication

### Sample Test User
```javascript
// Request
POST http://localhost:5000/api/auth/initiate
{
  "method": "email",
  "name": "Test User",
  "email": "test@example.com"
}

// Check server console for OTP
// Example: 🔐 OTP: 123456 (Valid for 10 minutes)

// Verify OTP
POST http://localhost:5000/api/auth/verify-otp
{
  "userId": "<userId_from_previous_response>",
  "otp": "123456"
}
```

## API Error Responses
- `400`: Bad request (missing fields, invalid input)
- `401`: Unauthorized (invalid/expired token or OTP)
- `404`: User not found
- `500`: Internal server error

## Frontend Components Updated
1. ✅ `App.jsx` - Added AuthProvider wrapper
2. ✅ `Navbar.jsx` - Added user menu and login button
3. ✅ `GroceryContext.jsx` - Protected addToCart action
4. ✅ `AuthModal.jsx` - New authentication modal
5. ✅ `api.js` - Auto-attach token to requests

## Database Collections
### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  mobile: String,
  isVerified: Boolean,
  loginMethod: String,
  createdAt: Date,
  lastLogin: Date
}
```

## API Service Methods
```javascript
authService.initiateAuth(data)
authService.verifyOTP(data)
authService.resendOTP(userId)
authService.getProfile()
authService.logout()
authService.setAuthToken(token)
authService.getToken()
authService.getStoredUser()
authService.storeUser(user)
authService.clearAuth()
```

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Author**: Grocery Management Team
