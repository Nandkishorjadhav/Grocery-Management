import React, { useMemo } from 'react';
import { useGrocery } from '../context/GroceryContext';
import Card from '../components/common/Card';

const Reports = () => {
  const { inventory, shoppingList } = useGrocery();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const lowStockItems = inventory.filter(item => item.quantity <= item.minStock).length;
    
    const categoryBreakdown = inventory.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { count: 0, value: 0 };
      }
      acc[item.category].count += 1;
      acc[item.category].value += item.price * item.quantity;
      return acc;
    }, {});

    const topValueItems = [...inventory]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 5);

    const expiringItems = inventory.filter(item => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    });

    return {
      totalItems,
      totalValue,
      lowStockItems,
      categoryBreakdown,
      topValueItems,
      expiringItems,
    };
  }, [inventory]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Items</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalItems}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Value</p>
            <p className="text-3xl font-bold text-green-600 mt-2">${stats.totalValue.toFixed(2)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Low Stock</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.lowStockItems}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Expiring Soon</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.expiringItems.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Breakdown */}
        <Card title="Category Breakdown">
          <div className="space-y-4">
            {Object.entries(stats.categoryBreakdown)
              .sort(([, a], [, b]) => b.value - a.value)
              .map(([category, data]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-600">
                      {data.count} items • ${data.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(data.value / stats.totalValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            {Object.keys(stats.categoryBreakdown).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </Card>

        {/* Top Value Items */}
        <Card title="Top 5 Most Valuable Items">
          <div className="space-y-3">
            {stats.topValueItems.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit} × ${item.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {stats.topValueItems.length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Shopping List Analysis */}
      <Card title="Shopping List Summary" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Total Items</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{shoppingList.length}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {shoppingList.filter(item => !item.purchased).length}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Purchased</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {shoppingList.filter(item => item.purchased).length}
            </p>
          </div>
        </div>
      </Card>

      {/* Inventory Health */}
      <Card title="Inventory Health">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Stock Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Well Stocked</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {inventory.filter(item => item.quantity > item.minStock).length} items
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Stock</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {stats.lowStockItems} items
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {inventory.filter(item => item.quantity === 0).length} items
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Expiry Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fresh</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {inventory.filter(item => {
                    if (!item.expiryDate) return true;
                    const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return days > 7;
                  }).length} items
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expiring Soon (≤7 days)</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {stats.expiringItems.length} items
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expired</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {inventory.filter(item => {
                    if (!item.expiryDate) return false;
                    return new Date(item.expiryDate) < new Date();
                  }).length} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
