import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import Button from '../components/common/Button';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getUserOrders();
      if (response.success) {
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
            <h2 className="profile-user-name">{user?.name || 'User'}</h2>
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

        {/* Logout Button */}
        <div className="profile-actions">
          <Button 
            variant="danger" 
            fullWidth 
            onClick={handleLogout}
            icon="🚪"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
