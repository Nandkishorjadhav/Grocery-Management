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

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      processing: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#757575';
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
        className="profile-btn"
        title="Profile"
      >
        <span className="profile-avatar">👤</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Profile"
      >
        <div className="profile-modal">
          {/* User Info Section */}
          <div className="profile-header">
            <div className="profile-avatar-large">👤</div>
            <div className="profile-info">
              <h2 className="profile-name">{user?.name || 'User'}</h2>
              <p className="profile-email">{user?.email || 'Not provided'}</p>
              <p className="profile-phone">{user?.mobile || 'Not provided'}</p>
              <p className="profile-joined">Member since {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">📦</div>
              <div className="profile-stat-info">
                <p className="profile-stat-value">{stats.totalOrders}</p>
                <p className="profile-stat-label">Orders</p>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">💰</div>
              <div className="profile-stat-info">
                <p className="profile-stat-value">₹{stats.totalSpent.toFixed(0)}</p>
                <p className="profile-stat-label">Spent</p>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon">✅</div>
              <div className="profile-stat-info">
                <p className="profile-stat-value">{stats.completedOrders}</p>
                <p className="profile-stat-label">Delivered</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="profile-section">
            <h3 className="profile-section-title">
              📋 Recent Orders
              {loading && <span className="loading-spinner-small">⏳</span>}
            </h3>
            
            {loading ? (
              <div className="loading-state-small">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <p className="empty-icon">🛒</p>
                <p className="empty-text">No orders yet</p>
                <p className="empty-subtext">Start shopping to see your orders here</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-id-section">
                        <span className="order-id">{order.orderId}</span>
                        <span 
                          className="order-status-badge" 
                          style={{ background: getStatusColor(order.status) }}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                      <span className="order-date">{formatDate(order.orderDate)}</span>
                    </div>
                    
                    <div className="order-card-body">
                      <div className="order-items-preview">
                        <span className="items-count">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                        <div className="items-names">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="item-name">{item.name}</span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="more-items">+{order.items.length - 2} more</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="order-card-footer">
                        <div className="order-total">
                          <span className="total-label">Total:</span>
                          <span className="total-amount">₹{order.finalAmount.toFixed(2)}</span>
                        </div>
                        <div className="order-payment">
                          <span className="payment-badge">💵 COD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
