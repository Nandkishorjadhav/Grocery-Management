import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { Link } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const { inventory } = useGrocery();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Get unique categories
  const categories = ['all', ...new Set(inventory.map(item => item.category))];

  // Filter and sort products
  const filteredProducts = inventory
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

  // Get category emoji
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Fruits': '🍎',
      'Vegetables': '🥗',
      'Dairy': '🥛',
      'Bakery': '🥖',
      'Meat': '🥩',
      'Beverages': '🧃',
      'Snacks': '🍿',
      'Frozen': '🧊',
      'Canned': '🥫',
      'all': '🛒'
    };
    return emojiMap[category] || '📦';
  };

  return (
    <div className="products-page">
      {/* Header Section */}
      <div className="products-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Our Products</h1>
            <p className="page-subtitle">Browse our wide selection of quality grocery items</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-emoji">📦</span>
              <div>
                <div className="stat-value">{inventory.length}</div>
                <div className="stat-label">Total Products</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-emoji">📂</span>
              <div>
                <div className="stat-value">{categories.length - 1}</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="products-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                <span className="category-emoji">{getCategoryEmoji(category)}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-group">
          <label className="filter-label">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="stock">Stock Level</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="results-info">
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">
            {inventory.length === 0 ? '📦' : '🔍'}
          </span>
          <h3 className="empty-title">
            {inventory.length === 0 ? 'No Products Available' : 'No Products Found'}
          </h3>
          <p className="empty-text">
            {inventory.length === 0 
              ? 'Start adding products to your inventory from the dashboard.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {inventory.length === 0 && (
            <Link to="/dashboard" className="btn-primary">
              <span>➕</span> Add Products
            </Link>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image">
                <img 
                  src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={item.name}
                  className="product-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                {item.quantity <= item.minStock && (
                  <span className="badge-low-stock">Low Stock</span>
                )}
              </div>
              
              <div className="product-content">
                <div className="product-category">{item.category}</div>
                <h3 className="product-name">{item.name}</h3>
                
                <div className="product-details">
                  <div className="detail-row">
                    <span className="detail-label">💰 Price:</span>
                    <span className="detail-value price">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📦 Stock:</span>
                    <span className={`detail-value ${item.quantity <= item.minStock ? 'low-stock' : ''}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📊 Min Stock:</span>
                    <span className="detail-value">{item.minStock} {item.unit}</span>
                  </div>
                  {item.expiryDate && (
                    <div className="detail-row">
                      <span className="detail-label">📅 Expiry:</span>
                      <span className="detail-value expiry">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="product-footer">
                <Link to={`/#product-${item.id}`} className="btn-view-details">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
