import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import './ProfileButton.css';

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock user data - will be replaced with actual auth data later
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    joinedDate: 'November 2024',
    avatar: '👤'
  };

  const userStats = {
    totalOrders: 24,
    totalSpent: '₹12,450',
    activeItems: 15,
    completedOrders: 20,
    pendingOrders: 4
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="profile-btn"
        title="Profile"
      >
        <span className="profile-avatar">{userData.avatar}</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Profile"
      >
        <div className="profile-modal">
          {/* User Info Section */}
          <div className="profile-header">
            <div className="profile-avatar-large">{userData.avatar}</div>
            <div className="profile-info">
              <h2 className="profile-name">{userData.name}</h2>
              <p className="profile-email">{userData.email}</p>
              <p className="profile-phone">{userData.phone}</p>
              <p className="profile-joined">Member since {userData.joinedDate}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">📦</div>
              <div className="profile-stat-info">
                <p className="profile-stat-value">{userStats.totalOrders}</p>
                <p className="profile-stat-label">Total Orders</p>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">💰</div>
              <div className="profile-stat-info">
                <p className="profile-stat-value">{userStats.totalSpent}</p>
                <p className="profile-stat-label">Total Spent</p>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">🛒</div>
              <div className="profile-stat-info">
                <p className="profile-stat-value">{userStats.activeItems}</p>
                <p className="profile-stat-label">Active Items</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="profile-section">
            <h3 className="profile-section-title">Order Summary</h3>
            <div className="order-summary">
              <div className="order-summary-item">
                <span className="order-status completed">✓</span>
                <div className="order-info">
                  <p className="order-label">Completed Orders</p>
                  <p className="order-value">{userStats.completedOrders}</p>
                </div>
              </div>
              <div className="order-summary-item">
                <span className="order-status pending">⏳</span>
                <div className="order-info">
                  <p className="order-label">Pending Orders</p>
                  <p className="order-value">{userStats.pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile-section">
            <h3 className="profile-section-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">🛒</span>
                <div className="activity-details">
                  <p className="activity-text">Added 5 items to shopping list</p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">📦</span>
                <div className="activity-details">
                  <p className="activity-text">Order #1234 delivered</p>
                  <p className="activity-time">1 day ago</p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">✅</span>
                <div className="activity-details">
                  <p className="activity-text">Completed shopping list</p>
                  <p className="activity-time">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <Button variant="outline" fullWidth onClick={() => alert('Edit profile feature coming soon!')}>
              ✏️ Edit Profile
            </Button>
            <Button variant="outline" fullWidth onClick={() => alert('Settings feature coming soon!')}>
              ⚙️ Settings
            </Button>
            <Button variant="danger" fullWidth onClick={() => alert('Logout feature coming soon!')}>
              🚪 Logout
            </Button>
          </div>

          {/* Notice */}
          <div className="profile-notice">
            <p>🔒 Login and signup features will be added soon. This is a preview of your profile dashboard.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileButton;
