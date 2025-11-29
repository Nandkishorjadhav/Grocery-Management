import React, { useState, useEffect } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ searchQuery = '' }) => {
  const { inventory } = useGrocery();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
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

    // Apply category filter first
    if (selectedCategory !== 'all') {
      products = products.filter(item => item.category === selectedCategory);
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'popular':
        // Sort by quantity (assuming higher quantity = more popular)
        products = products.sort((a, b) => b.quantity - a.quantity);
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
        // Show all products
        break;
    }

    setFilteredProducts(products);
  }, [inventory, searchQuery, selectedFilter, selectedCategory]);

  const categories = [...new Set(inventory.map(item => item.category))];

  const getDiscountBadge = (item) => {
    // Mock discount calculation
    const randomDiscount = [10, 15, 20, 24, 30];
    return randomDiscount[Math.floor(Math.random() * randomDiscount.length)];
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Dairy': '🥛',
      'Bakery': '🍞',
      'Snacks': '🍿',
      'Beverages': '🥤',
      'Meat': '🥩',
      'Grains': '🌾',
      'default': '🛒'
    };
    return emojiMap[category] || emojiMap['default'];
  };

  const getProductImage = (category, itemName = '') => {
    // When filtering by category, show emoji
    if (selectedCategory !== 'all') {
      return null; // Will show emoji instead
    }

    // Real product image URLs from reliable sources
    const productImages = {
      'Fresh Red Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
      'Organic Bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
      'Sweet Oranges': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400',
      'Green Grapes': 'https://images.unsplash.com/photo-1599819177333-612e79d4a0f7?w=400',
      'Strawberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
      'Brown Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      'Whole Wheat Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      'Fresh Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      'Cheddar Cheese': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400',
      'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
      'Salmon Fillet': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
      'Almond Nuts': 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=400',
    };
    
    // Return specific image if available, otherwise category default
    if (productImages[itemName]) {
      return productImages[itemName];
    }
    
    // Category defaults
    const categoryImages = {
      'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      'Fruits': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
      'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
      'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
      'Beverages': 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400',
      'Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
      'Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    };
    
    return categoryImages[category] || 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400';
  };

  const filterButtons = [
    { id: 'all', label: 'All Products', icon: '🛒' },
    { id: 'popular', label: 'Most Popular', icon: '⭐' },
    { id: 'special', label: "Today's Special", icon: '🔥' },
    { id: 'bestsellers', label: 'Best Sellers', icon: '👑' },
  ];

  return (
    <div className="home-page">
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
          <div className="header-right">
            <span className="product-count">{filteredProducts.length} items</span>
            <div className="category-dropdown-wrapper">
              <button 
                className="category-dropdown-btn"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <span>📁 Shop by Category</span>
                <span className={`dropdown-arrow ${showCategoryDropdown ? 'open' : ''}`}>▼</span>
              </button>
              {showCategoryDropdown && (
                <div className="category-dropdown">
                  <div 
                    className={`category-option ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowCategoryDropdown(false);
                    }}
                  >
                    🛒 All Categories
                  </div>
                  {categories.map(category => (
                    <div
                      key={category}
                      className={`category-option ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <span>{getCategoryEmoji(category)}</span>
                      <span>{category}</span>
                      <span className="category-item-count">
                        {inventory.filter(item => item.category === category).length}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="home-product-card"
              >
                <div className="product-image-wrapper">
                  {getProductImage(item.category, item.name) ? (
                    <img 
                      src={getProductImage(item.category, item.name)} 
                      alt={item.name}
                      className="product-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-emoji">{getCategoryEmoji(item.category)}</div>
                  )}
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
