import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

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
      } else if (activeTab === 'users') {
        const data = await adminService.getAllUsers({ 
          status: filterStatus, 
          search: searchQuery 
        });
        setUsers(data.users);
      } else if (activeTab === 'approvals') {
        const data = await adminService.getPendingApprovals();
        setPendingApprovals(data.pendingUsers);
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

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>
      {dashboardStats && (
        <>
          <div className="stats-grid">
            <Card className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{dashboardStats.stats.totalUsers}</p>
            </Card>
            <Card className="stat-card">
              <h3>Active Users</h3>
              <p className="stat-number">{dashboardStats.stats.activeUsers}</p>
            </Card>
            <Card className="stat-card">
              <h3>Pending Approvals</h3>
              <p className="stat-number warning">{dashboardStats.stats.pendingUsers}</p>
            </Card>
            <Card className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-number">{dashboardStats.stats.totalProducts}</p>
            </Card>
            <Card className="stat-card">
              <h3>Low Stock Items</h3>
              <p className="stat-number danger">{dashboardStats.stats.lowStockProducts}</p>
            </Card>
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
      <div className="users-header">
        <h2>User Management</h2>
        <div className="users-filters">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button onClick={loadData}>Search</Button>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <p>{selectedUsers.length} users selected</p>
          <Button onClick={handleBulkApprove} variant="success">
            Bulk Approve
          </Button>
          <Button onClick={handleBulkReject} variant="danger">
            Bulk Reject
          </Button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email || user.mobile}</td>
              <td>
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="role-select"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="actions-cell">
                {user.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApproveUser(user._id)}
                      variant="success"
                      size="small"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectUser(user._id)}
                      variant="danger"
                      size="small"
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => handleDeleteUser(user._id)}
                  variant="danger"
                  size="small"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderApprovals = () => (
    <div className="admin-approvals">
      <h2>Pending Approvals</h2>
      {pendingApprovals.length === 0 ? (
        <p className="no-data">No pending approvals</p>
      ) : (
        <div className="approvals-grid">
          {pendingApprovals.map(user => (
            <Card key={user._id} className="approval-card">
              <h3>{user.name}</h3>
              <p>{user.email || user.mobile}</p>
              <p className="joined-date">
                Requested: {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="approval-actions">
                <Button
                  onClick={() => handleApproveUser(user._id)}
                  variant="success"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleRejectUser(user._id)}
                  variant="danger"
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="admin-activity">
      <h2>Activity Logs</h2>
      {activityLogs && (
        <>
          <div className="activity-section">
            <h3>Recent Logins</h3>
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

          <div className="activity-section">
            <h3>Recent Registrations</h3>
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
        </>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="admin-orders">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p className="no-data">No orders found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.substring(0, 8)}</td>
                <td>{order.userId?.name || 'N/A'}</td>
                <td>{order.userId?.email || order.userId?.mobile || 'N/A'}</td>
                <td>{order.items?.length || 0}</td>
                <td>₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`payment-badge ${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderInventory = () => (
    <div className="admin-inventory">
      <h2>Inventory Management</h2>
      {inventory.length === 0 ? (
        <p className="no-data">No inventory items found</p>
      ) : (
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
      )}
    </div>
  );

  const renderReports = () => (
    <div className="admin-reports">
      <h2>Analytics & Reports</h2>
      {reports && (
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
      )}
    </div>
  );

  if (loading && !dashboardStats && !users.length) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-panel-wrapper">
      {/* Admin Navbar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="admin-brand">
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
            >
              <span className="exit-icon">🚪</span>
              Exit Admin Panel
            </button>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <div className="admin-panel">
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="tab-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👥</span>
            Users
          </button>
          <button
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="tab-icon">🛒</span>
            Orders
          </button>
          <button
            className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <span className="tab-icon">📦</span>
            Inventory
          </button>
          <button
            className={`tab-button ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <span className="tab-icon">✓</span>
            Approvals
            {dashboardStats?.stats.pendingUsers > 0 && (
              <span className="badge">{dashboardStats.stats.pendingUsers}</span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="tab-icon">📈</span>
            Reports
          </button>
          <button
            className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <span className="tab-icon">📝</span>
            Activity
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'approvals' && renderApprovals()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'activity' && renderActivity()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
