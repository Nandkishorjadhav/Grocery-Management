import api from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grocery-management-lg7u.onrender.com/api';

const authService = {
  // Initiate authentication (send OTP)
  initiateAuth: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to initiate auth');
    return result;
  },

  // Verify OTP
  verifyOTP: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to verify OTP');
    return result;
  },

  // Resend OTP
  resendOTP: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to resend OTP');
    return result;
  },

  // Get user profile
  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get profile');
    return result;
  },

  // Update user profile
  updateProfile: async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update profile');
    return result;
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to logout');
    return result;
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
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
