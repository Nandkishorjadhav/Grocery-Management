import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import sellerProductService from '../services/sellerProductService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [activityLogs, setActivityLogs] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [reports, setReports] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Skeleton Components ─────────────────────────────
  const StatSkeleton = () => (
    <div className="stat-card sk-card">
      <div className="sk-circle sk-pulse" style={{ width: 52, height: 52 }}></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="sk-line sk-pulse" style={{ width: '55%', height: 11 }}></div>
        <div className="sk-line sk-pulse" style={{ width: '38%', height: 28 }}></div>
        <div className="sk-line sk-pulse" style={{ width: '60%', height: 11 }}></div>
      </div>
    </div>
  );

  const SkRows = ({ rows = 6, cells = [140, 180, 100, 90, 110, 130] }) => (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="sk-row">
          {cells.map((w, j) => (
            <td key={j}>
              <div className="sk-line sk-pulse" style={{ width: w, height: 13 }}></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
  // ────────────────────────────────────────────────────

  useEffect(() => {
    // Check if user is admin
    if (!user || (!user.isAdmin && user.role !== 'admin')) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const stats = await adminService.getDashboardStats();
        setDashboardStats(stats);
        // Also load pending seller products for dashboard display
        try {
          const productsData = await sellerProductService.getAllProducts({ status: 'pending' });
          setSellerProducts(productsData.products || []);
        } catch (err) {
          console.error('Error loading pending products for dashboard:', err);
          setSellerProducts([]);
        }
      } else if (activeTab === 'users') {
        const data = await adminService.getAllUsers({ 
          status: filterStatus, 
          search: searchQuery 
        });
        setUsers(data.users);
      } else if (activeTab === 'approvals') {
        try {
          const data = await adminService.getPendingApprovals();
          setPendingApprovals(data.pendingUsers || []);
        } catch (err) {
          setPendingApprovals([]);
        }
        
        try {
          const productsData = await sellerProductService.getAllProducts({ status: 'pending' });
          setSellerProducts(productsData.products || []);
        } catch (err) {
          setSellerProducts([]);
        }
      } else if (activeTab === 'activity') {
        const data = await adminService.getActivityLogs();
        setActivityLogs(data);
      } else if (activeTab === 'orders') {
        const data = await adminService.getAllOrders();
        setOrders(data.orders || []);
      } else if (activeTab === 'inventory') {
        const data = await adminService.getInventoryData();
        setInventory(data.inventory || []);
      } else if (activeTab === 'reports') {
        const data = await adminService.getReports();
        setReports(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await adminService.approveUser(userId);
      loadData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await adminService.rejectUser(userId);
      loadData();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      loadData();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedUsers.length === 0) return;
    try {
      await adminService.bulkApproveUsers(selectedUsers);
      setSelectedUsers([]);
      loadData();
    } catch (error) {
      console.error('Error bulk approving:', error);
    }
  };

  const handleBulkReject = async () => {
    if (selectedUsers.length === 0) return;
    try {
      await adminService.bulkRejectUsers(selectedUsers);
      setSelectedUsers([]);
      loadData();
    } catch (error) {
      console.error('Error bulk rejecting:', error);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleApproveProduct = async (productId) => {
    try {
      await sellerProductService.approveProduct(productId);
      loadData();
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  const handleRejectProduct = async (productId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await sellerProductService.rejectProduct(productId, reason);
      loadData();
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">📊 Dashboard Overview</h2>
          <p className="dashboard-subtitle">Welcome back, {user?.name}! Here's what's happening today.</p>
        </div>
        <button 
          className="refresh-btn"
          onClick={loadData}
          title="Refresh Data"
        >
          🔄 Refresh
        </button>
      </div>
      
      {!dashboardStats ? (
        <>
          <div className="stats-grid">
            {[0, 1, 2, 3, 4].map(i => <StatSkeleton key={i} />)}
          </div>
          <div className="recent-users">
            <h3>Recent Users</h3>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email/Mobile</th><th>Status</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody><SkRows rows={5} cells={[140, 180, 90, 70, 110]} /></tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="stats-grid">
            <Card className="stat-card users-card">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">👥</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Users</p>
                <h3 className="stat-number">{dashboardStats.stats.totalUsers}</h3>
                <p className="stat-trend positive">+{dashboardStats.stats.activeUsers} active</p>
              </div>
            </Card>
            
            <Card className="stat-card active-card">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">✅</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Active Users</p>
                <h3 className="stat-number">{dashboardStats.stats.activeUsers}</h3>
                <p className="stat-trend">{((dashboardStats.stats.activeUsers / dashboardStats.stats.totalUsers) * 100).toFixed(0)}% of total</p>
              </div>
            </Card>
            
            <Card className="stat-card pending-card">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">⏳</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Pending Approvals</p>
                <h3 className="stat-number warning">{dashboardStats.stats.pendingUsers}</h3>
                {dashboardStats.stats.pendingUsers > 0 && (
                  <button 
                    className="stat-action-btn"
                    onClick={() => setActiveTab('approvals')}
                  >
                    Review Now →
                  </button>
                )}
              </div>
            </Card>
            
            <Card className="stat-card products-card">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📦</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Products</p>
                <h3 className="stat-number">{dashboardStats.stats.totalProducts}</h3>
                <p className="stat-trend">{dashboardStats.stats.lowStockProducts} low stock</p>
              </div>
            </Card>
            
            <Card className="stat-card warning-card">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">⚠️</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">Low Stock Items</p>
                <h3 className="stat-number danger">{dashboardStats.stats.lowStockProducts}</h3>
                {dashboardStats.stats.lowStockProducts > 0 && (
                  <button 
                    className="stat-action-btn"
                    onClick={() => setActiveTab('inventory')}
                  >
                    View Items →
                  </button>
                )}
              </div>
            </Card>
            
            {sellerProducts.length > 0 && (
              <Card 
                className="stat-card attention-card" 
                onClick={() => setActiveTab('approvals')} 
                style={{cursor: 'pointer'}}
                title="Click to view pending products"
              >
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">🛍️</span>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Pending Products</p>
                  <h3 className="stat-number warning">{sellerProducts.length}</h3>
                  <p className="stat-action-text">Click to approve →</p>
                </div>
              </Card>
            )}
          </div>

          <div className="recent-users">
            <h3>Recent Users</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email/Mobile</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.recentUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email || user.mobile}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="section-header">
        <div>
          <h2 className="section-title">👥 User Management</h2>
          <p className="section-subtitle">Manage and monitor all users in the system</p>
        </div>
      </div>

      <div className="users-controls">
        <div className="search-filter-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadData()}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => { setSearchQuery(''); loadData(); }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <Button onClick={loadData} className="search-btn">
            <span>🔍</span> Search
          </Button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="bulk-actions-bar">
            <div className="bulk-info">
              <span className="bulk-count">{selectedUsers.length}</span> user{selectedUsers.length > 1 ? 's' : ''} selected
            </div>
            <div className="bulk-buttons">
              <Button onClick={handleBulkApprove} variant="success" size="small">
                ✓ Bulk Approve
              </Button>
              <Button onClick={handleBulkReject} variant="danger" size="small">
                ✗ Bulk Reject
              </Button>
              <button 
                className="clear-selection-btn"
                onClick={() => setSelectedUsers([])}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="table-container">
          <table className="admin-table">
            <thead><tr>
              <th className="checkbox-col"></th>
              <th>Name</th><th>Contact</th><th>Status</th><th>Role</th><th>Joined</th><th>Actions</th>
            </tr></thead>
            <tbody><SkRows rows={7} cells={[30, 160, 180, 100, 100, 110, 70]} /></tbody>
          </table>
        </div>
      ) : users.length === 0 ? (
        <div className="no-data-card">
          <span className="no-data-icon">👤</span>
          <h3>No Users Found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(u => u._id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers.length === users.length && users.length > 0}
                  />
                </th>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className={selectedUsers.includes(user._id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                    />
                  </td>
                  <td>
                    <div className="user-cell">
                      <span className="user-avatar">👤</span>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      {user.email && (
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          {user.email}
                        </div>
                      )}
                      {user.mobile && (
                        <div className="contact-item">
                          <span className="contact-icon">📱</span>
                          {user.mobile}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${user.status}`}>
                      {user.status === 'approved' && '✓'}
                      {user.status === 'pending' && '⏳'}
                      {user.status === 'rejected' && '✗'}
                      {' '}{user.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => {
                        if (window.confirm(`Change role for ${user.name} to ${e.target.value}?`)) {
                          handleRoleChange(user._id, e.target.value);
                        }
                      }}
                      className="role-select"
                    >
                      <option value="user">👤 User</option>
                      <option value="admin">🔑 Admin</option>
                    </select>
                  </td>
                  <td>
                    <div className="date-cell">
                      <span className="date-icon">📅</span>
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="actions-col">
                    <div className="action-buttons">
                      {user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveUser(user._id)}
                            className="action-btn approve-btn"
                            title="Approve user"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleRejectUser(user._id)}
                            className="action-btn reject-btn"
                            title="Reject user"
                          >
                            ✗
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                            handleDeleteUser(user._id);
                          }
                        }}
                        className="action-btn delete-btn"
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderApprovals = () => (
    <div className="admin-approvals">
      <h2>Pending Approvals</h2>
      
      {/* Seller Product Approvals - Show First for Priority */}
      <div className="approval-section">
        <div className="section-header-with-count">
          <h3>🛒 Seller Product Approvals</h3>
          {sellerProducts.length > 0 && (
            <span className="count-badge">{sellerProducts.length} Pending</span>
          )}
        </div>
        {sellerProducts.length === 0 ? (
          <p className="no-data">✅ No pending product approvals</p>
        ) : (
          <div className="approvals-grid">
            {sellerProducts.map(product => (
              <Card key={product._id} className="approval-card product-approval-card">
                <div className="product-status-badge pending-approval">⏳ Awaiting Approval</div>
                {product.images && product.images.length > 0 && (
                  <div className="product-image">
                    <img src={product.images[0].url} alt={product.productName} />
                  </div>
                )}
                <h3>{product.productName}</h3>
                <p className="product-category">📂 {product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <p><strong>👤 Seller:</strong> {product.sellerName}</p>
                  {product.sellerContact?.email && (
                    <p><strong>📧 Email:</strong> {product.sellerContact.email}</p>
                  )}
                  {product.sellerContact?.mobile && (
                    <p><strong>📱 Mobile:</strong> {product.sellerContact.mobile}</p>
                  )}
                  <p><strong>💰 Base Price:</strong> ₹{product.basePrice} + GST ({product.gstPercentage}%)</p>
                  <p><strong>💳 Final Price:</strong> ₹{product.finalPrice?.toFixed(2)}</p>
                  <p><strong>📦 Quantity:</strong> {product.quantity} {product.unit}</p>
                  <p><strong>📅 Submitted:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="approval-actions">
                  <Button
                    onClick={() => handleApproveProduct(product._id)}
                    variant="success"
                  >
                    ✓ Approve & Publish
                  </Button>
                  <Button
                    onClick={() => handleRejectProduct(product._id)}
                    variant="danger"
                  >
                    ✗ Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="admin-activity">
      <h2>Activity Logs</h2>
      {loading ? (
        <>
          <div className="activity-section">
            <h3>Recent Logins</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead><tr><th>User</th><th>Contact</th><th>Last Login</th></tr></thead>
                <tbody><SkRows rows={5} cells={[150, 190, 200]} /></tbody>
              </table>
            </div>
          </div>
          <div className="activity-section">
            <h3>Recent Registrations</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead><tr><th>User</th><th>Contact</th><th>Status</th><th>Registered</th></tr></thead>
                <tbody><SkRows rows={5} cells={[150, 190, 90, 180]} /></tbody>
              </table>
            </div>
          </div>
        </>
      ) : activityLogs ? (
        <>
          <div className="activity-section">
            <h3>Recent Logins</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.recentLogins.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email || user.mobile}</td>
                      <td>{new Date(user.lastLogin).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="activity-section">
            <h3>Recent Registrations</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.recentRegistrations.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email || user.mobile}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );

  const renderOrders = () => (
    <div className="admin-orders">
      <div className="section-header">
        <div>
          <h2 className="section-title">🛍️ All Orders</h2>
          <p className="section-subtitle">Track and manage customer orders</p>
        </div>
        <button 
          className="refresh-btn"
          onClick={loadData}
          title="Refresh Orders"
        >
          🔄 Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="table-container">
          <table className="admin-table orders-table">
            <thead><tr>
              <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th><th>Actions</th>
            </tr></thead>
            <tbody><SkRows rows={6} cells={[100, 140, 60, 100, 100, 90, 100, 34]} /></tbody>
          </table>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-data-card">
          <span className="no-data-icon">📫</span>
          <h3>No Orders Yet</h3>
          <p>Orders will appear here once customers start placing them</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>
                    <div className="order-id-cell">
                      <span className="order-icon">📦</span>
                      <code>#{order._id.substring(0, 8)}</code>
                    </div>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <span className="customer-name">{order.user?.name || 'Guest'}</span>
                      <span className="customer-contact">{order.user?.email || order.user?.mobile || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="items-badge">{order.items?.length || 0} items</span>
                  </td>
                  <td>
                    <div className="amount-cell">
                      <span className="currency">₹</span>
                      <span className="amount">{order.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge order-status-${order.status}`}>
                      {order.status === 'pending' && '⏳'}
                      {order.status === 'confirmed' && '✓'}
                      {order.status === 'processing' && '📦'}
                      {order.status === 'delivered' && '✅'}
                      {order.status === 'cancelled' && '✗'}
                      {' '}{order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-badge payment-${order.paymentStatus}`}>
                      {order.paymentStatus === 'paid' && '✅'}
                      {order.paymentStatus === 'pending' && '⏳'}
                      {order.paymentStatus === 'failed' && '✗'}
                      {' '}{order.paymentStatus || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="actions-col">
                    <button
                      className="action-btn view-btn"
                      onClick={() => alert('Order details coming soon!')}
                      title="View Order Details"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderInventory = () => (
    <div className="admin-inventory">
      <h2>Inventory Management</h2>
      {loading ? (
        <div className="table-container">
          <table className="admin-table">
            <thead><tr>
              <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Unit</th><th>Status</th><th>Last Updated</th>
            </tr></thead>
            <tbody><SkRows rows={8} cells={[160, 110, 80, 60, 60, 90, 110]} /></tbody>
          </table>
        </div>
      ) : inventory.length === 0 ? (
        <div className="no-data-card">
          <span className="no-data-icon">📦</span>
          <h3>No Inventory Items</h3>
          <p>Add products to get started</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-icon">{item.icon || '📦'}</span>
                      {item.name}
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>
                    <span className={item.quantity < 10 ? 'low-stock' : ''}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{item.unit}</td>
                  <td>
                    <span className={`stock-badge ${item.quantity === 0 ? 'out' : item.quantity < 10 ? 'low' : 'good'}`}>
                      {item.quantity === 0 ? 'Out of Stock' : item.quantity < 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="admin-reports">
      <h2>Analytics & Reports</h2>
      {loading ? (
        <div className="reports-grid">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="report-card-sk">
              <div className="sk-line sk-pulse" style={{ width: '60%', height: 18, marginBottom: '1.5rem' }}></div>
              {[0, 1, 2].map(j => (
                <div key={j} className="stat-item" style={{ marginBottom: '0.75rem' }}>
                  <div className="sk-line sk-pulse" style={{ width: '45%', height: 13 }}></div>
                  <div className="sk-line sk-pulse" style={{ width: '25%', height: 13 }}></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : reports ? (
        <>
          <div className="reports-grid">
            <Card className="report-card">
              <h3>📊 Sales Overview</h3>
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">₹{reports.totalRevenue?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">{reports.totalOrders || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Order Value</span>
                  <span className="stat-value">₹{reports.avgOrderValue?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </Card>

            <Card className="report-card">
              <h3>👥 User Statistics</h3>
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">{reports.totalUsers || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Today</span>
                  <span className="stat-value">{reports.activeToday || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">New This Month</span>
                  <span className="stat-value">{reports.newThisMonth || 0}</span>
                </div>
              </div>
            </Card>

            <Card className="report-card">
              <h3>📦 Inventory Status</h3>
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Products</span>
                  <span className="stat-value">{reports.totalProducts || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Stock Items</span>
                  <span className="stat-value danger">{reports.lowStockItems || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Out of Stock</span>
                  <span className="stat-value danger">{reports.outOfStock || 0}</span>
                </div>
              </div>
            </Card>

            <Card className="report-card">
              <h3>📈 Order Status</h3>
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value warning">{reports.pendingOrders || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Processing</span>
                  <span className="stat-value">{reports.processingOrders || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value success">{reports.completedOrders || 0}</span>
                </div>
              </div>
            </Card>
          </div>

          {reports.topProducts && reports.topProducts.length > 0 && (
            <div className="top-products-section">
              <h3>🏆 Top Selling Products</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.topProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td>#{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.orderCount}</td>
                      <td>₹{product.revenue?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
  );

  return (
    <div className="admin-panel-wrapper">
      {/* Admin Navbar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="admin-brand">
            <button 
              className="menu-toggle-btn" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Menu"
              type="button"
            >
              <span className="hamburger-icon">{sidebarOpen ? '✕' : '☰'}</span>
            </button>
            <span className="admin-brand-icon">⚙️</span>
            <div className="admin-brand-text">
              <h1 className="admin-brand-title">Admin Dashboard</h1>
              <p className="admin-brand-subtitle">GroceryHub Management</p>
            </div>
          </div>
          
          <div className="admin-navbar-actions">
            <div className="admin-user-info">
              <span className="admin-user-avatar">👤</span>
              <div className="admin-user-details">
                <span className="admin-user-name">{user?.name}</span>
                <span className="admin-user-role">Administrator</span>
              </div>
            </div>
            <button 
              className="admin-exit-btn" 
              onClick={() => navigate('/dashboard')}
              title="Exit Admin Panel"
              type="button"
            >
              <span className="exit-icon">🚪</span>
              Exit Admin Panel
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Content Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button
            type="button"
            className={`sidebar-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('dashboard');
              setSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-text">Dashboard</span>
          </button>
          <button
            type="button"
            className={`sidebar-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('users');
              setSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">👥</span>
            <span className="sidebar-text">Users</span>
          </button>
          <button
            type="button"
            className={`sidebar-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              setSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">🛒</span>
            <span className="sidebar-text">Orders</span>
          </button>
          <button
            type="button"
            className={`sidebar-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('inventory');
              setSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">📦</span>
            <span className="sidebar-text">Inventory</span>
          </button>
          <button
            type="button"
            className={`sidebar-button ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('approvals');
              setSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">✓</span>
            <span className="sidebar-text">Approvals</span>
            {dashboardStats?.stats.pendingUsers > 0 && (
              <span className="sidebar-badge">{dashboardStats.stats.pendingUsers}</span>
            )}
          </button>
          <button
            type="button"
            className={`sidebar-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('reports');
              setSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">📈</span>
            <span className="sidebar-text">Reports</span>
          </button>
          <button
            type="button"
            className={`sidebar-button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('activity');
              setSidebarOpen(false);
            }}
          >
            <span className="sidebar-icon">📝</span>
            <span className="sidebar-text">Activity</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-main-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'approvals' && renderApprovals()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'activity' && renderActivity()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
