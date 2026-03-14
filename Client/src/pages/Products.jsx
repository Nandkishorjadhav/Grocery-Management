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
        <div className="products-header-content">
          <div className="products-header-text">
            <h1 className="products-page-title">Our Products</h1>
            <p className="products-page-subtitle">Browse our wide selection of quality grocery items</p>
          </div>
          <div className="products-header-stats">
            <div className="products-stat-card">
              <span className="products-stat-emoji">📦</span>
              <div>
                <div className="products-stat-value">{inventory.length}</div>
                <div className="products-stat-label">Total Products</div>
              </div>
            </div>
            <div className="products-stat-card">
              <span className="products-stat-emoji">📂</span>
              <div>
                <div className="products-stat-value">{categories.length - 1}</div>
                <div className="products-stat-label">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="products-filters">
        <div className="products-search-box">
          <span className="products-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="products-search-input"
          />
        </div>

        <div className="products-filter-group">
          <label className="products-filter-label">Category:</label>
          <div className="products-category-buttons">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`products-category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                <span className="products-category-emoji">{getCategoryEmoji(category)}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="products-sort-group">
          <label className="products-filter-label">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="products-sort-select"
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
        <div className="products-results-info">
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="products-empty-state">
          <span className="products-empty-emoji">
            {inventory.length === 0 ? '📦' : '🔍'}
          </span>
          <h3 className="products-empty-title">
            {inventory.length === 0 ? 'No Products Available' : 'No Products Found'}
          </h3>
          <p className="products-empty-text">
            {inventory.length === 0 
              ? 'Start adding products to your inventory from the dashboard.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {inventory.length === 0 && (
            <Link to="/dashboard" className="products-btn-primary">
              <span>➕</span> Add Products
            </Link>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((item) => (
            <div key={item._id || item.id} className="products-card">
              <div className="products-card-media">
                <img 
                  src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={item.name}
                  className="products-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                {item.quantity <= item.minStock && (
                  <span className="products-badge-low-stock">Low Stock</span>
                )}
              </div>
              
              <div className="products-card-content">
                <div className="products-card-category">{item.category}</div>
                <h3 className="products-card-name">{item.name}</h3>
                
                <div className="products-card-details">
                  <div className="products-detail-row">
                    <span className="products-detail-label">💰 Price:</span>
                    <span className="products-detail-value products-detail-price">₹{item.price.toFixed(2)}</span>
                  </div>
                  <div className="products-detail-row">
                    <span className="products-detail-label">📦 Stock:</span>
                    <span className={`products-detail-value ${item.quantity <= item.minStock ? 'products-detail-low-stock' : ''}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="products-detail-row">
                    <span className="products-detail-label">📊 Min Stock:</span>
                    <span className="products-detail-value">{item.minStock} {item.unit}</span>
                  </div>
                  {item.expiryDate && (
                    <div className="products-detail-row">
                      <span className="products-detail-label">📅 Expiry:</span>
                      <span className="products-detail-value products-detail-expiry">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="products-card-footer">
                <Link to={`/product/${item._id || item.id}`} className="products-btn-view-details">
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
