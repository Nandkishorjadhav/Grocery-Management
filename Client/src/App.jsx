import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GroceryProvider } from './context/GroceryContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ShoppingList from './pages/ShoppingList';
import Reports from './pages/Reports';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <GroceryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
      </GroceryProvider>
    </Router>
  );
}

export default App;

