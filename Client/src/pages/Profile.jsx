import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import authService from '../services/authService';
import Button from '../components/common/Button';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    // Debug: Check user object for admin status
    console.log('========== PROFILE DEBUG ==========');
    console.log('📋 Full user object:', user);
    console.log('📋 user.isAdmin:', user?.isAdmin, '(type:', typeof user?.isAdmin, ')');
    console.log('📋 user.role:', user?.role, '(type:', typeof user?.role, ')');
    console.log('📋 Condition check: user?.isAdmin =', user?.isAdmin);
    console.log('📋 Condition check: user?.role === "admin" =', user?.role === 'admin');
    console.log('📋 Button should show:', (user?.isAdmin || user?.role === 'admin'));
    console.log('📋 LocalStorage user:', JSON.parse(localStorage.getItem('user') || '{}'));
    console.log('===================================');
    fetchOrders();
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getUserOrders();
      if (response && response.success) {
        setOrders(response.orders || []);
        setStats(response.stats || {
          totalOrders: 0,
          totalSpent: 0,
          completedOrders: 0,
          pendingOrders: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Set empty state on error
      setOrders([]);
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
        pendingOrders: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✓',
      processing: '📦',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
      confirmed: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
      processing: { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
      delivered: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
      cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
    };
    return colors[status] || colors.pending;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || ''
      });
      setUpdateMessage({ type: '', text: '' });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!editForm.name || editForm.name.trim() === '') {
      setUpdateMessage({ type: 'error', text: 'Name is required' });
      return;
    }

    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setUpdateMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    if (editForm.mobile && !/^[0-9]{10}$/.test(editForm.mobile)) {
      setUpdateMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    setUpdateLoading(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      console.log('Sending update request with:', editForm);
      const response = await authService.updateProfile(editForm);
      console.log('Update profile response:', response);
      
      if (response && response.success) {
        // Update user in context and localStorage
        updateUser(response.user);
        
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setUpdateMessage({ type: 'error', text: response?.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.message || 'Failed to update profile. Please check your connection and try again.';
      setUpdateMessage({ type: 'error', text: errorMessage });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header-section">
          <h1 className="profile-page-title">My Profile</h1>
          <p className="profile-page-subtitle">Manage your account and view your order history</p>
        </div>

        {/* User Information */}
        <div className="profile-user-section">
          <div className="profile-avatar-large">
            <span className="profile-avatar-emoji">👤</span>
          </div>
          <div className="profile-user-info">
            {!isEditing ? (
              <>
                <div className="profile-header-with-actions">
                  <h2 className="profile-user-name">{user?.name || 'User'}</h2>
                  <div className="profile-action-buttons">
                    {(user?.isAdmin || user?.role === 'admin') && (
                      <button 
                        className="profile-admin-btn" 
                        onClick={() => navigate('/admin')}
                        title="Go to Admin Panel"
                      >
                        ⚙️ Admin Panel
                      </button>
                    )}
                    <button className="profile-edit-btn" onClick={handleEditToggle}>
                      ✏️ Edit Profile
                    </button>
                  </div>
                </div>
                <div className="profile-user-details">
                  <div className="profile-detail-row">
                    <span className="profile-detail-icon">📧</span>
                    <span className="profile-detail-text">{user?.email || 'Not provided'}</span>
                  </div>
                  <div className="profile-detail-row">
                    <span className="profile-detail-icon">📱</span>
                    <span className="profile-detail-text">{user?.mobile || 'Not provided'}</span>
                  </div>
                  {user?.role && (
                    <div className="profile-detail-row">
                      <span className="profile-detail-icon">👔</span>
                      <span className="profile-detail-text">
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </div>
                  )}
                  {user?.createdAt && (
                    <div className="profile-detail-row">
                      <span className="profile-detail-icon">📅</span>
                      <span className="profile-detail-text">
                        Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                <h3 className="profile-edit-title">✏️ Edit Profile</h3>
                
                {updateMessage.text && (
                  <div className={`profile-update-message ${updateMessage.type}`}>
                    {updateMessage.text}
                  </div>
                )}

                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <span className="profile-form-icon">👤</span>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <span className="profile-form-icon">📧</span>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">
                    <span className="profile-form-icon">📱</span>
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={editForm.mobile}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    placeholder="Enter your mobile number"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                  />
                </div>

                <div className="profile-form-actions">
                  <button
                    type="submit"
                    className="profile-form-btn profile-form-btn-save"
                    disabled={updateLoading}
                  >
                    {updateLoading ? '💾 Saving...' : '💾 Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="profile-form-btn profile-form-btn-cancel"
                    onClick={handleEditToggle}
                    disabled={updateLoading}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="profile-header-actions">
            <button className="profile-logout-btn-corner" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="profile-stats-section">
          <h3 className="profile-section-title">📊 Order Statistics</h3>
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">📦</div>
              <div className="profile-stat-value">{stats.totalOrders}</div>
              <div className="profile-stat-label">Total Orders</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">💰</div>
              <div className="profile-stat-value">₹{stats.totalSpent?.toFixed(0) || 0}</div>
              <div className="profile-stat-label">Total Spent</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">✅</div>
              <div className="profile-stat-value">{stats.completedOrders}</div>
              <div className="profile-stat-label">Completed</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">⏳</div>
              <div className="profile-stat-value">{stats.pendingOrders}</div>
              <div className="profile-stat-label">Pending</div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="profile-orders-section">
          <h3 className="profile-section-title">🛍️ Order History</h3>
          
          {loading ? (
            <div className="profile-loading">
              <div className="profile-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="profile-empty">
              <div className="profile-empty-icon">🛒</div>
              <p className="profile-empty-text">No orders yet</p>
              <p className="profile-empty-subtext">Start shopping to see your orders here!</p>
            </div>
          ) : (
            <div className="profile-orders-list">
              {orders.map((order) => (
                <div key={order._id} className="profile-order-card">
                  {/* Order Header */}
                  <div className="profile-order-header">
                    <div className="profile-order-id">
                      <span className="profile-order-number">
                        Order #{order.orderId || order._id?.slice(-8)}
                      </span>
                      <span className="profile-order-date">
                        📅 {formatDate(order.orderDate)}
                      </span>
                    </div>
                    <span className={`profile-order-status status-${order.status}`}>
                      {getStatusIcon(order.status)} {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>

                  {/* Ordered Products */}
                  <div className="profile-order-products">
                    <h4 className="profile-products-title">🛍️ Products Ordered ({order.items?.length || 0} items)</h4>
                    <div className="profile-products-list">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="profile-product-item">
                          <div className="profile-product-info">
                            <div className="profile-product-placeholder">
                              {item.category === 'Fruits' && '🍎'}
                              {item.category === 'Vegetables' && '🥬'}
                              {item.category === 'Dairy' && '🥛'}
                              {item.category === 'Bakery' && '🍞'}
                              {item.category === 'Meat' && '🍗'}
                              {item.category === 'Snacks' && '🍿'}
                              {item.category === 'Beverages' && '🧃'}
                              {item.category === 'Grains' && '🌾'}
                              {!item.category && '📦'}
                            </div>
                            <div className="profile-product-details">
                              <span className="profile-product-name">{item.name}</span>
                              <span className="profile-product-meta">
                                {item.category && <span className="profile-product-category">{item.category}</span>}
                                <span className="profile-product-qty">Qty: {item.quantity} {item.unit || 'unit'}</span>
                              </span>
                            </div>
                          </div>
                          <div className="profile-product-pricing">
                            <span className="profile-product-price">₹{item.price?.toFixed(2)}</span>
                            <span className="profile-product-total">Total: ₹{item.totalPrice?.toFixed(2) || (item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="profile-order-address">
                    <h4 className="profile-address-title">📍 Delivery Address:</h4>
                    <div className="profile-address-content">
                      <p><strong>{order.deliveryAddress?.fullName}</strong></p>
                      <p>📱 {order.deliveryAddress?.mobile}</p>
                      <p>{order.deliveryAddress?.addressLine1}</p>
                      {order.deliveryAddress?.addressLine2 && (
                        <p>{order.deliveryAddress?.addressLine2}</p>
                      )}
                      <p>
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="profile-order-footer">
                    <div className="profile-order-summary">
                      <div className="profile-summary-row">
                        <span>Items Total:</span>
                        <span>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                      {order.deliveryCharges > 0 && (
                        <div className="profile-summary-row">
                          <span>Delivery Charges:</span>
                          <span>₹{order.deliveryCharges?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="profile-summary-row profile-summary-total">
                        <span>Final Amount:</span>
                        <strong>₹{order.finalAmount?.toFixed(2) || '0.00'}</strong>
                      </div>
                      <div className="profile-payment-info">
                        <span className="profile-payment-icon">
                          {order.paymentMethod === 'cod' ? '💵' : '💳'}
                        </span>
                        <span className="profile-payment-text">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </span>
                      </div>
                      {order.deliveryDate && (
                        <div className="profile-delivery-info">
                          <span className="profile-delivery-icon">✅</span>
                          <span className="profile-delivery-text">
                            Delivered on {formatDate(order.deliveryDate)}
                          </span>
                        </div>
                      )}
                      {order.notes && (
                        <div className="profile-order-notes">
                          <span className="profile-notes-icon">📝</span>
                          <span className="profile-notes-text">{order.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
