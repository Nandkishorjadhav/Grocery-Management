import React, { useMemo } from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';

const Reports = () => {
  const { inventory, shoppingList } = useGrocery();

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
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Reports & Analytics</h1>
          <p className="page-subtitle">Insights into your grocery inventory and spending</p>
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
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="h-2 rounded-full"
                          style={{
                            width: `${(data.value / stats.totalValue) * 100}%`,
                            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                          }}
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
          <div className="flex flex-col gap-3">
            {stats.topExpensive.length > 0 ? (
              stats.topExpensive.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.quantity} {item.unit} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 dark:text-green-400">
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
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Items</p>
                <p className="text-2xl font-bold">{shoppingList.length}</p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${stats.shoppingEstimate.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">💵</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {shoppingList.filter(item => !item.purchased).length}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
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
