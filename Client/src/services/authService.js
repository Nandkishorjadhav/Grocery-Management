import api from './api.js';

const authService = {
  // Initiate authentication (send OTP)
  initiateAuth: async (data) => {
    console.log('authService.initiateAuth called with:', data);
    const response = await api.post('/auth/initiate', data);
    console.log('authService.initiateAuth response:', response);
    return response;
  },

  // Verify OTP
  verifyOTP: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    return response;
  },

  // Resend OTP
  resendOTP: async (userId) => {
    const response = await api.post('/auth/resend-otp', { userId });
    return response;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },

  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Store user
  storeUser: (user) => {
    console.log('💾 Storing user in localStorage:', user);
    console.log('💾 Admin fields - isAdmin:', user?.isAdmin, 'role:', user?.role);
    localStorage.setItem('user', JSON.stringify(user));
    const stored = localStorage.getItem('user');
    console.log('💾 Verification - stored user:', JSON.parse(stored));
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
