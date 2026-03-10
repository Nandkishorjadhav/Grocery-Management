import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import authService from '../services/authService';
import sellerProductService from '../services/sellerProductService';
import Button from '../components/common/Button';
import SellProductForm from '../components/common/SellProductForm';
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
  const [showSellForm, setShowSellForm] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    fetchOrders();
    fetchMyProducts();
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

  const fetchMyProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await sellerProductService.getMyProducts();
      if (response && response.success) {
        setMyProducts(response.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setMyProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSellProduct = async (productData) => {
    try {
      const imagePromises = productData.images.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              url: reader.result,
              filename: file.name,
              uploadedAt: new Date()
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);

      const payload = {
        productName: productData.name,
        category: productData.category,
        description: productData.description,
        basePrice: parseFloat(productData.basePrice),
        gstPercentage: parseInt(productData.gstPercent),
        quantity: parseFloat(productData.quantity),
        unit: productData.unit,
        expiryDate: productData.expiryDate || null,
        images: images
      };

      const response = await sellerProductService.createProduct(payload);
      
      if (response && response.success) {
        alert('Product listed successfully! Waiting for admin approval.');
        setShowSellForm(false);
        fetchMyProducts();
      } else {
        alert('Failed to list product: ' + (response.message || response.error));
      }
    } catch (error) {
      alert('Failed to list product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) {
      return;
    }

    try {
      // Optimistically remove from UI
      setMyProducts(prev => prev.filter(p => p._id !== productId));
      
      const response = await sellerProductService.deleteProduct(productId);
      
      if (response && response.success) {
        alert('Product deleted successfully!');
        // Refresh to ensure sync with server
        fetchMyProducts();
      } else {
        // Revert on failure
        alert('Failed to delete product: ' + (response.error || 'Unknown error'));
        fetchMyProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
      // Revert on error
      fetchMyProducts();
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
      const response = await authService.updateProfile(editForm);
      
      if (response && response.success) {
        updateUser(response.user);
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        setTimeout(() => setUpdateMessage({ type: '', text: '' }), 3000);
      } else {
        setUpdateMessage({ type: 'error', text: response?.error || 'Failed to update profile' });
      }
    } catch (error) {
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
                    <button 
                      className="profile-sell-btn" 
                      onClick={() => setShowSellForm(true)}
                      title="Sell Your Products"
                    >
                      🛒 Sell Product
                    </button>
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

        {/* My Products Section */}
        {myProducts.length > 0 && (
          <div className="profile-stats-section">
            <div className="profile-section-header">
              <h3 className="profile-section-title">📦 My Product Listings</h3>
              {myProducts.filter(p => p.status === 'pending').length > 0 && (
                <span className="pending-badge">
                  {myProducts.filter(p => p.status === 'pending').length} Awaiting Admin Approval
                </span>
              )}
            </div>
            
            {/* Info message for pending products */}
            {myProducts.filter(p => p.status === 'pending').length > 0 && (
              <div className="info-message" style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                border: '2px solid #3b82f6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{fontSize: '1.5rem'}}>ℹ️</span>
                <div>
                  <strong>Your products are under review!</strong>
                  <div style={{fontSize: '0.9rem', marginTop: '0.25rem', opacity: 0.9}}>
                    Admin will review your product(s) and approve them. Once approved, they will be visible to customers on the home page.
                  </div>
                </div>
              </div>
            )}
            
            {/* Notification for approved/rejected products */}
            {myProducts.filter(p => p.status === 'approved' || p.status === 'rejected').length > 0 && (
              <div className="product-notifications">
                {myProducts.filter(p => p.status === 'approved').map(product => (
                  <div key={product._id} className="notification approved">
                    <span className="notification-icon">✅</span>
                    <div className="notification-content">
                      <strong>Great news!</strong> Your product "<strong>{product.productName}</strong>" has been <strong>approved by admin</strong> and is now <strong>live in the marketplace</strong>! Customers can now see and purchase it on the home page.
                      {product.approvedAt && (
                        <div style={{fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.8}}>
                          Approved on {new Date(product.approvedAt).toLocaleDateString()} at {new Date(product.approvedAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {myProducts.filter(p => p.status === 'rejected').map(product => (
                  <div key={product._id} className="notification rejected">
                    <span className="notification-icon">❌</span>
                    <div className="notification-content">
                      <strong>Product Rejected:</strong> Your product "<strong>{product.productName}</strong>" was not approved. 
                      {product.rejectionReason && (
                        <div style={{marginTop: '0.5rem'}}>
                          <strong>Reason:</strong> {product.rejectionReason}
                        </div>
                      )}
                      <div style={{fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8}}>
                        Please update your product details and resubmit, or contact admin for more information.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {productsLoading ? (
              <div className="profile-loading">Loading your products...</div>
            ) : (
              <div className="my-products-grid">
                {myProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-status">
                      {product.status === 'pending' && '⏳ Pending Approval'}
                      {product.status === 'approved' && '✅ Approved'}
                      {product.status === 'rejected' && '❌ Rejected'}
                    </div>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].url || product.images[0]} 
                        alt={product.productName}
                        className="product-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="64"%3E📦%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="product-no-image">📦</div>
                    )}
                    <div className="product-info">
                      <h4>{product.productName}</h4>
                      <p className="product-category">{product.category.toUpperCase()}</p>
                      <p className="product-description">{product.description}</p>
                      <div className="product-pricing">
                        <div>Base: ₹{product.basePrice?.toFixed(2)}</div>
                        <div>GST ({product.gstPercentage}%): ₹{product.gstAmount?.toFixed(2)}</div>
                        <div className="product-final-price">
                          Final: ₹{product.finalPrice?.toFixed(2)}
                        </div>
                      </div>
                      <p className="product-quantity">
                        Quantity: {product.quantity} {product.unit}
                      </p>
                      {product.expiryDate && (
                        <p className="product-expiry">
                          Expires: {new Date(product.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                      <button 
                        className="btn-delete-product"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sell Product Form Modal */}
      {showSellForm && (
        <SellProductForm
          onClose={() => setShowSellForm(false)}
          onSubmit={handleSellProduct}
        />
      )}
    </div>
  );
};

export default Profile;
