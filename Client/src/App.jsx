import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GroceryProvider } from './context/GroceryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ShoppingList from './pages/ShoppingList';
import Reports from './pages/Reports';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Preloader from './components/common/Preloader';
import AuthModal from './components/common/AuthModal';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show preloader for 1 second on initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <GroceryProvider>
          <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </GroceryProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent({ searchQuery, setSearchQuery }) {
  const { showAuthModal } = useAuth();

  return (
    <>
      <Layout onSearch={setSearchQuery}>
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
      {showAuthModal && <AuthModal />}
    </>
  );
}

export default App;

