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
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with your grocery inventory.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group overflow-hidden relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">{stat.value}</p>
              </div>
              <div className={`${colorClasses[stat.color]} rounded-2xl p-4 text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
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
          title="⚠️ Low Stock Alert" 
          subtitle={`${lowStockItems.length} items need restocking`}
          headerAction={
            <Link to="/inventory" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <span>→</span>
            </Link>
          }
          hover={true}
        >
          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((item, idx) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-all hover:shadow-md group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                      !
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors">{item.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><span>📂</span>{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-3">🎉</div>
              <p className="text-gray-600 font-medium">All items are well stocked!</p>
            </div>
          )}
        </Card>

        {/* Expiring Soon Alert */}
        <Card 
          title="⏰ Expiring Soon" 
          subtitle={`${expiringSoonItems.length} items expiring within 7 days`}
          headerAction={
            <Link to="/inventory" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <span>→</span>
            </Link>
          }
          hover={true}
        >
          {expiringSoonItems.length > 0 ? (
            <div className="space-y-3">
              {expiringSoonItems.slice(0, 5).map((item, idx) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-4 bg-linear-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 hover:border-red-300 transition-all hover:shadow-md group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                      ⏰
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">{item.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><span>📂</span>{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.quantity} {item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-3">✅</div>
              <p className="text-gray-600 font-medium">No items expiring soon!</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="⚡ Quick Actions" subtitle="Navigate to key features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/inventory" 
            className="group relative p-8 bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📦</div>
              <h3 className="text-xl font-bold mb-2">Manage Inventory</h3>
              <p className="text-sm text-blue-100 leading-relaxed">Add, edit, or remove items from your inventory</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <span>Get Started</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/shopping-list" 
            className="group relative p-8 bg-linear-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🛒</div>
              <h3 className="text-xl font-bold mb-2">Shopping List</h3>
              <p className="text-sm text-green-100 leading-relaxed">Plan your next grocery trip efficiently</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <span>Get Started</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/reports" 
            className="group relative p-8 bg-linear-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📈</div>
              <h3 className="text-xl font-bold mb-2">View Reports</h3>
              <p className="text-sm text-purple-100 leading-relaxed">Analyze your grocery spending & trends</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <span>Get Started</span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
