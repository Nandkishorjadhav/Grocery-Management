import React, { useMemo } from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Breadcrumb from '../components/common/Breadcrumb';

const Reports = () => {
  const { inventory, shoppingList } = useGrocery();

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Price', 'Total Value', 'Expiry Date', 'Status'];
    const rows = inventory.map(item => [
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.price,
      (item.price * item.quantity).toFixed(2),
      item.expiryDate || 'N/A',
      item.quantity <= item.minStock ? 'Low Stock' : 'Good'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grocery-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = inventory.filter(item => item.quantity <= item.minStock).length;
    const expiringSoonCount = inventory.filter(item => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7;
    }).length;

    const categoryBreakdown = inventory.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { count: 0, value: 0 };
      }
      acc[item.category].count += 1;
      acc[item.category].value += item.price * item.quantity;
      return acc;
    }, {});

    const topExpensive = [...inventory]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 5);

    const shoppingEstimate = shoppingList.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

    return {
      totalValue,
      totalItems,
      lowStockCount,
      expiringSoonCount,
      categoryBreakdown,
      topExpensive,
      shoppingEstimate
    };
  }, [inventory, shoppingList]);

  return (
    <div className="fade-in">
      <Breadcrumb />
      
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Reports & Analytics</h1>
          <p className="page-subtitle">Insights into your grocery inventory and spending</p>
        </div>
        <div className="tooltip">
          <Button 
            onClick={exportToCSV}
            icon="📥"
            variant="outline"
          >
            Export CSV
          </Button>
          <span className="tooltip-text">Download inventory as CSV file</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Total Inventory Value</p>
            <p className="stat-value">${stats.totalValue.toFixed(2)}</p>
          </div>
          <div className="stat-icon stat-icon-green">💰</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Total Items</p>
            <p className="stat-value">{stats.totalItems}</p>
          </div>
          <div className="stat-icon stat-icon-blue">📦</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Low Stock Alerts</p>
            <p className="stat-value">{stats.lowStockCount}</p>
          </div>
          <div className="stat-icon stat-icon-yellow">⚠️</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Expiring Soon</p>
            <p className="stat-value">{stats.expiringSoonCount}</p>
          </div>
          <div className="stat-icon stat-icon-purple">⏰</div>
        </div>
      </div>

      <div className="reports-grid">
        {/* Category Breakdown */}
        <Card title="📂 Inventory by Category" hover={true}>
          <div className="flex flex-col gap-4">
            {Object.keys(stats.categoryBreakdown).length > 0 ? (
              Object.entries(stats.categoryBreakdown)
                .sort((a, b) => b[1].value - a[1].value)
                .map(([category, data]) => (
                  <div key={category} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{category}</span>
                        <span className="badge badge-primary">{data.count} items</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(data.value / stats.totalValue) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-sm text-gray-600">
                        <span>${data.value.toFixed(2)}</span>
                        <span>{((data.value / stats.totalValue) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="empty-state">
                <p className="empty-state-text">No inventory data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Expensive Items */}
        <Card title="💎 Most Valuable Items" hover={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.topExpensive.length > 0 ? (
              stats.topExpensive.map((item, index) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--card-bg, #f9fafb)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                      {item.quantity} {item.unit} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#10b981' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p className="empty-state-text">No inventory items</p>
              </div>
            )}
          </div>
        </Card>

        {/* Shopping List Summary */}
        <Card title="🛒 Shopping List Summary" hover={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="info-card">
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.25rem' }}>Total Items</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{shoppingList.length}</p>
              </div>
              <div style={{ fontSize: '2.5rem' }}>🛒</div>
            </div>
            <div className="info-card" style={{
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderColor: '#10b981'
            }}>
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.25rem' }}>Estimated Cost</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                  ${stats.shoppingEstimate.toFixed(2)}
                </p>
              </div>
              <div style={{ fontSize: '2.5rem' }}>💵</div>
            </div>
            <div className="info-card" style={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              borderColor: '#a855f7'
            }}>
              <div>
                <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.25rem' }}>Pending</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a855f7' }}>
                  {shoppingList.filter(item => !item.purchased).length}
                </p>
              </div>
              <div style={{ fontSize: '2.5rem' }}>⏳</div>
            </div>
          </div>
        </Card>

        {/* Alerts Summary */}
        <Card title="🔔 Active Alerts" hover={true}>
          <div className="flex flex-col gap-3">
            <div className="alert-item alert-warning">
              <div className="alert-item-content">
                <div className="alert-icon">⚠️</div>
                <div className="alert-item-info">
                  <p className="alert-item-name">Low Stock Items</p>
                  <p className="alert-item-category">Items below minimum stock level</p>
                </div>
              </div>
              <div className="alert-badge alert-badge-warning">
                {stats.lowStockCount}
              </div>
            </div>
            <div className="alert-item alert-danger">
              <div className="alert-item-content">
                <div className="alert-icon alert-icon-danger">⏰</div>
                <div className="alert-item-info">
                  <p className="alert-item-name">Expiring Soon</p>
                  <p className="alert-item-category">Items expiring within 7 days</p>
                </div>
              </div>
              <div className="alert-badge alert-badge-danger">
                {stats.expiringSoonCount}
              </div>
            </div>
            {stats.lowStockCount === 0 && stats.expiringSoonCount === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🎉</div>
                <p className="empty-state-text">No active alerts. Everything looks good!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
