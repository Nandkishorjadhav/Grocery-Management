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
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
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
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={
          <Layout onSearch={setSearchQuery}>
            <Home searchQuery={searchQuery} />
          </Layout>
        } />
        <Route path="/product/:id" element={
          <Layout onSearch={setSearchQuery}>
            <ProductDetail />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout onSearch={setSearchQuery}>
            <Dashboard />
          </Layout>
        } />
        <Route path="/products" element={
          <Layout onSearch={setSearchQuery}>
            <Products />
          </Layout>
        } />
        <Route path="/inventory" element={
          <Layout onSearch={setSearchQuery}>
            <Inventory />
          </Layout>
        } />
        <Route path="/cart" element={
          <Layout onSearch={setSearchQuery}>
            <Cart />
          </Layout>
        } />
        <Route path="/checkout" element={
          <Layout onSearch={setSearchQuery}>
            <Checkout />
          </Layout>
        } />
        <Route path="/shopping-list" element={
          <Layout onSearch={setSearchQuery}>
            <ShoppingList />
          </Layout>
        } />
        <Route path="/reports" element={
          <Layout onSearch={setSearchQuery}>
            <Reports />
          </Layout>
        } />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={
          <Layout onSearch={setSearchQuery}>
            <Profile />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout onSearch={setSearchQuery}>
            <About />
          </Layout>
        } />
        <Route path="/terms" element={
          <Layout onSearch={setSearchQuery}>
            <Terms />
          </Layout>
        } />
        <Route path="/privacy" element={
          <Layout onSearch={setSearchQuery}>
            <Privacy />
          </Layout>
        } />
      </Routes>
      {showAuthModal && <AuthModal />}
    </>
  );
}

export default App;

