import React, { useState, useEffect } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { Link } from 'react-router-dom';

const Home = ({ searchQuery = '' }) => {
  const { inventory } = useGrocery();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let products = [...inventory];

    // Apply search filter
    if (searchQuery) {
      products = products.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'popular':
        // Sort by quantity (assuming higher quantity = more popular)
        products = products.sort((a, b) => b.quantity - a.quantity).slice(0, 8);
        break;
      case 'special':
        // Show items with low stock or expiring soon
        const today = new Date();
        products = products.filter(item => {
          if (item.expiryDate) {
            const expiry = new Date(item.expiryDate);
            const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
          }
          return false;
        });
        break;
      case 'bestsellers':
        // Show items above minimum stock level
        products = products.filter(item => item.quantity >= item.minStock * 2);
        break;
      default:
        break;
    }

    setFilteredProducts(products);
  }, [inventory, searchQuery, selectedFilter]);

  const categories = [...new Set(inventory.map(item => item.category))];

  const getDiscountBadge = (item) => {
    // Mock discount calculation
    const randomDiscount = [10, 15, 20, 24, 30];
    return randomDiscount[Math.floor(Math.random() * randomDiscount.length)];
  };

  const getProductImage = (category) => {
    const imageMap = {
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Dairy': '🥛',
      'Bakery': '🍞',
      'Snacks': '🍿',
      'Beverages': '🥤',
      'Meat': '🥩',
      'default': '🛒'
    };
    return imageMap[category] || imageMap['default'];
  };

  const filterButtons = [
    { id: 'all', label: 'All Products', icon: '🛒' },
    { id: 'popular', label: 'Most Popular', icon: '⭐' },
    { id: 'special', label: "Today's Special", icon: '🔥' },
    { id: 'bestsellers', label: 'Best Sellers', icon: '👑' },
  ];

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Fresh Groceries Delivered to Your Door</h1>
          <p className="hero-subtitle">Order from our wide selection of products</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-section">
        <div className="filter-buttons">
          {filterButtons.map(button => (
            <button
              key={button.id}
              className={`filter-btn ${selectedFilter === button.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(button.id)}
            >
              <span className="filter-icon">{button.icon}</span>
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            {selectedFilter === 'all' && 'All Products'}
            {selectedFilter === 'popular' && 'Most Popular Items'}
            {selectedFilter === 'special' && "Today's Special Deals"}
            {selectedFilter === 'bestsellers' && 'Best Selling Products'}
          </h2>
          <span className="product-count">{filteredProducts.length} items</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(item => (
              <div key={item.id} className="home-product-card">
                <div className="product-image-wrapper">
                  <div className="product-image">
                    {getProductImage(item.category)}
                  </div>
                  <span className="discount-badge">{getDiscountBadge(item)}% OFF</span>
                  {item.quantity <= item.minStock && (
                    <span className="stock-badge low">Low Stock</span>
                  )}
                </div>
                
                <div className="product-details">
                  <h3 className="product-name">{item.name}</h3>
                  <span className="product-category">{item.category}</span>
                  
                  <div className="product-meta">
                    <div className="product-quantity">
                      <span className="quantity-label">Available:</span>
                      <span className="quantity-value">{item.quantity} {item.unit}</span>
                    </div>
                  </div>

                  <div className="product-footer">
                    <div className="product-price">
                      <span className="price-current">₹{item.price}</span>
                      <span className="price-original">₹{Math.round(item.price * 1.25)}</span>
                    </div>
                    <button className="add-to-cart-btn">
                      <span>Add</span>
                      <span className="cart-icon">🛒</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className="category-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map(category => (
            <div key={category} className="category-card">
              <div className="category-icon">{getProductImage(category)}</div>
              <h3 className="category-name">{category}</h3>
              <span className="category-count">
                {inventory.filter(item => item.category === category).length} items
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
