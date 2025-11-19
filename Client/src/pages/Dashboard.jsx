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

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${colorClasses[stat.color]} rounded-full p-3 text-3xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Low Stock Alert */}
        <Card 
          title="Low Stock Alert" 
          subtitle={`${lowStockItems.length} items need restocking`}
          headerAction={
            <Link to="/inventory" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          }
        >
          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-yellow-700">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">All items are well stocked! 🎉</p>
          )}
        </Card>

        {/* Expiring Soon Alert */}
        <Card 
          title="Expiring Soon" 
          subtitle={`${expiringSoonItems.length} items expiring within 7 days`}
          headerAction={
            <Link to="/inventory" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          }
        >
          {expiringSoonItems.length > 0 ? (
            <div className="space-y-3">
              {expiringSoonItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-700">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No items expiring soon! ✅</p>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/inventory" 
            className="p-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold">Manage Inventory</h3>
            <p className="text-sm text-blue-100 mt-1">Add, edit, or remove items</p>
          </Link>
          
          <Link 
            to="/shopping-list" 
            className="p-6 bg-linear-to-br from-green-500 to-green-600 rounded-lg text-white hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="text-lg font-semibold">Shopping List</h3>
            <p className="text-sm text-green-100 mt-1">Plan your next grocery trip</p>
          </Link>
          
          <Link 
            to="/reports" 
            className="p-6 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg text-white hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-2">📈</div>
            <h3 className="text-lg font-semibold">View Reports</h3>
            <p className="text-sm text-purple-100 mt-1">Analyze your grocery data</p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
