import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { inventory, shoppingList, getLowStockItems, getExpiringSoonItems } = useGrocery();

  const lowStockItems = getLowStockItems();
  const expiringSoonItems = getExpiringSoonItems();
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const pendingShoppingItems = shoppingList.filter(item => !item.purchased).length;

  const stats = [
    { label: 'Total Items', value: inventory.length, icon: '📦', color: 'blue' },
    { label: 'Inventory Value', value: `$${totalInventoryValue.toFixed(2)}`, icon: '💰', color: 'green' },
    { label: 'Low Stock', value: lowStockItems.length, icon: '⚠️', color: 'yellow' },
    { label: 'Shopping List', value: pendingShoppingItems, icon: '🛒', color: 'purple' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title gradient-text">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your grocery inventory.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className={`stat-icon stat-icon-${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="alerts-grid">
        {/* Low Stock Alert */}
        <Card 
          title="⚠️ Low Stock Alert" 
          subtitle={`${lowStockItems.length} items need restocking`}
          headerAction={
            <Link to="/inventory" className="card-action-link">
              View All <span>→</span>
            </Link>
          }
          hover={true}
        >
          {lowStockItems.length > 0 ? (
            <div className="alert-items">
              {lowStockItems.slice(0, 5).map((item, idx) => (
                <div 
                  key={item.id} 
                  className="alert-item alert-warning"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="alert-item-content">
                    <div className="alert-icon">
                      !
                    </div>
                    <div className="alert-item-info">
                      <p className="alert-item-name">{item.name}</p>
                      <p className="alert-item-category"><span>📂</span>{item.category}</p>
                    </div>
                  </div>
                  <div className="alert-item-details">
                    <p className="alert-badge alert-badge-warning">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="alert-item-meta">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert-empty">
              <div className="alert-empty-icon">🎉</div>
              <p className="alert-empty-text">All items are well stocked!</p>
            </div>
          )}
        </Card>

        {/* Expiring Soon Alert */}
        <Card 
          title="⏰ Expiring Soon" 
          subtitle={`${expiringSoonItems.length} items expiring within 7 days`}
          headerAction={
            <Link to="/inventory" className="card-action-link">
              View All <span>→</span>
            </Link>
          }
          hover={true}
        >
          {expiringSoonItems.length > 0 ? (
            <div className="alert-items">
              {expiringSoonItems.slice(0, 5).map((item, idx) => (
                <div 
                  key={item.id} 
                  className="alert-item alert-danger"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="alert-item-content">
                    <div className="alert-icon alert-icon-danger">
                      ⏰
                    </div>
                    <div className="alert-item-info">
                      <p className="alert-item-name">{item.name}</p>
                      <p className="alert-item-category"><span>📂</span>{item.category}</p>
                    </div>
                  </div>
                  <div className="alert-item-details">
                    <p className="alert-badge alert-badge-danger">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="alert-item-meta">{item.quantity} {item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert-empty">
              <div className="alert-empty-icon">✅</div>
              <p className="alert-empty-text">No items expiring soon!</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="⚡ Quick Actions" subtitle="Navigate to key features">
        <div className="quick-actions-grid">
          <Link to="/inventory" className="action-card action-card-blue">
            <div className="action-card-icon">📦</div>
            <h3 className="action-card-title">Manage Inventory</h3>
            <p className="action-card-text">Add, edit, or remove items from your inventory</p>
            <div className="action-card-cta">
              <span>Get Started</span>
              <span className="action-arrow">→</span>
            </div>
          </Link>
          
          <Link to="/shopping-list" className="action-card action-card-green">
            <div className="action-card-icon">🛒</div>
            <h3 className="action-card-title">Shopping List</h3>
            <p className="action-card-text">Plan your next grocery trip efficiently</p>
            <div className="action-card-cta">
              <span>Get Started</span>
              <span className="action-arrow">→</span>
            </div>
          </Link>
          
          <Link to="/reports" className="action-card action-card-purple">
            <div className="action-card-icon">📈</div>
            <h3 className="action-card-title">View Reports</h3>
            <p className="action-card-text">Analyze your grocery spending & trends</p>
            <div className="action-card-cta">
              <span>Get Started</span>
              <span className="action-arrow">→</span>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
