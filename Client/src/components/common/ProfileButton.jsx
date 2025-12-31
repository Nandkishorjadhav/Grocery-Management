import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import Modal from './Modal';
import Button from './Button';
import './ProfileButton.css';

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

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
      year: 'numeric'
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="profile-icon-btn"
        title="My Profile"
      >
        <span className="profile-avatar-icon">👤</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Profile"
      >
        <div className="profile-content">
          {/* User Information */}
          <div className="profile-user-section">
            <div className="profile-avatar-large">👤</div>
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
                {orders.slice(0, 5).map((order) => (
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
                      <h4 className="profile-products-title">Products Ordered:</h4>
                      <div className="profile-products-list">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="profile-product-item">
                            <div className="profile-product-info">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="profile-product-img"
                                />
                              ) : (
                                <div className="profile-product-placeholder">📦</div>
                              )}
                              <div className="profile-product-details">
                                <span className="profile-product-name">{item.name}</span>
                                <span className="profile-product-qty">Quantity: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="profile-product-price">₹{item.price?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="profile-order-address">
                      <h4 className="profile-address-title">📍 Delivery Address:</h4>
                      <div className="profile-address-content">
                        <p><strong>{order.deliveryAddress?.fullName}</strong></p>
                        <p>📱 {order.deliveryAddress?.phone}</p>
                        <p>{order.deliveryAddress?.addressLine1}</p>
                        {order.deliveryAddress?.addressLine2 && (
                          <p>{order.deliveryAddress?.addressLine2}</p>
                        )}
                        <p>
                          {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.postalCode}
                        </p>
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="profile-order-footer">
                      <div className="profile-payment-method">
                        💵 {order.paymentMethod || 'Cash on Delivery'}
                      </div>
                      <div className="profile-order-total">
                        <span>Total Amount:</span>
                        <strong>₹{order.totalAmount?.toFixed(2) || '0.00'}</strong>
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
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              icon="🚪"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileButton;
