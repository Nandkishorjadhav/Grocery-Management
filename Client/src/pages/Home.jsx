import React, { useState, useEffect, useCallback } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { Link } from 'react-router-dom';
import sellerProductService from '../services/sellerProductService';
import './Home.css';

const Home = ({ searchQuery = '' }) => {
  const { inventory, addToCart, loading } = useGrocery();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addedItems, setAddedItems] = useState(new Set());
  const [sellerProducts, setSellerProducts] = useState([]);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await sellerProductService.getMarketplaceProducts({ status: 'approved' });
        if (response && response.success) {
          const transformedProducts = response.products
            .filter(sp => sp.quantity > 0 && sp.status === 'approved')
            .map(sp => ({
              _id: sp._id,
              name: sp.productName,
              category: sp.category,
              price: sp.finalPrice,
              quantity: sp.quantity,
              unit: sp.unit,
              description: sp.description,
              images: sp.images,
              isSellerProduct: true,
              sellerName: sp.sellerName,
              minStock: 0
            }));
          setSellerProducts(transformedProducts);
        }
      } catch (error) {
        setSellerProducts([]);
      }
    };

    fetchSellerProducts();
    const interval = setInterval(fetchSellerProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let products = [
      ...inventory.filter(item => item.quantity > 0),
      ...sellerProducts.filter(item => item.quantity > 0)
    ];

    if (searchQuery) {
      products = products.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      products = products.filter(item => item.category === selectedCategory);
    }

    switch (selectedFilter) {
      case 'popular':
        products = [...products].sort((a, b) => b.quantity - a.quantity);
        break;
      case 'special':
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
        products = products.filter(item => item.quantity >= item.minStock * 2);
        break;
      default:
        break;
    }

    setFilteredProducts(products);
  }, [inventory, sellerProducts, searchQuery, selectedFilter, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.category-dropdown-wrapper')) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allProducts = [...inventory, ...sellerProducts];
  const categories = [...new Set(allProducts.map(item => item.category))];

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

  const getItemImageUrl = (item) => {
    if (item.isSellerProduct) {
      return item.images && item.images.length > 0 ? item.images[0].url : null;
    }
    if (item.image && item.image !== 'https://via.placeholder.com/150') {
      return item.image;
    }
    if (item.images && item.images.length > 0) {
      return typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url;
    }
    return null;
  };

  const handleImageError = useCallback((itemId) => {
    setImageErrors(prev => new Set([...prev, itemId]));
  }, []);

  const handleAddToCart = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(item);
      const id = item._id || item.id;
      setAddedItems(prev => new Set([...prev, id]));
      setTimeout(() => {
        setAddedItems(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 2000);
    } catch (error) {
      // silently handle
    }
  };

  const filterButtons = [
    { id: 'all',         label: 'All Products',    icon: '🛍️' },
    { id: 'popular',     label: 'Most Popular',    icon: '🔥' },
    { id: 'special',     label: "Today's Special", icon: '⚡' },
    { id: 'bestsellers', label: 'Best Sellers',    icon: '⭐' },
  ];

  const sectionTitles = {
    all:         'All Products',
    popular:     'Most Popular Items',
    special:     "Today's Special Deals",
    bestsellers: 'Best Selling Products',
  };

  return (
    <div className="home-page">

      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">🌿 Fresh &amp; Organic</span>
          <h1 className="hero-title">
            Your Daily
            <span className="hero-highlight">Fresh Grocery</span>
            Delivered Fast
          </h1>
          <p className="hero-description">
            Shop from hundreds of fresh, locally-sourced products. Same-day delivery, competitive prices, and quality you can trust.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-value">500+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">2hr</div>
              <div className="stat-label">Delivery</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">4.9★</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/products" className="hero-btn primary">
              <span>🛒</span> Shop Now
            </Link>
            <Link to="/offers" className="hero-btn secondary">
              <span>🏷️</span> View Offers
            </Link>
          </div>
        </div>
        <div className="hero-decoration" aria-hidden="true">
          <span className="floating-item item-1">🍅</span>
          <span className="floating-item item-2">🥑</span>
          <span className="floating-item item-3">🍋</span>
          <span className="floating-item item-4">🥕</span>
          <span className="floating-item item-5">🫐</span>
        </div>
      </div>

      {/* ── Filter Buttons ── */}
      <div className="filter-buttons">
        {filterButtons.map(btn => (
          <button
            key={btn.id}
            className={`filter-btn ${selectedFilter === btn.id ? 'active' : ''}`}
            onClick={() => setSelectedFilter(btn.id)}
          >
            <span className="filter-icon">{btn.icon}</span>
            {btn.label}
          </button>
        ))}
      </div>

      {/* ── Products Section ── */}
      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">{sectionTitles[selectedFilter]}</h2>

          <div className="header-right">
            <span className="product-count">{filteredProducts.length} items</span>

            <div className="category-dropdown-wrapper">
              <button
                className="category-dropdown-btn"
                onClick={() => setShowCategoryDropdown(v => !v)}
                aria-expanded={showCategoryDropdown}
              >
                <span>📁 Shop by Category</span>
                <span className={`dropdown-arrow ${showCategoryDropdown ? 'open' : ''}`}>▼</span>
              </button>

              {showCategoryDropdown && (
                <div className="category-dropdown">
                  <div
                    className={`category-option ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory('all'); setShowCategoryDropdown(false); }}
                  >
                    <span>🛒</span>
                    <span>All Categories</span>
                    <span className="category-item-count">{allProducts.length}</span>
                  </div>
                  {categories.map(cat => (
                    <div
                      key={cat}
                      className={`category-option ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); }}
                    >
                      <span>{getCategoryEmoji(cat)}</span>
                      <span>{cat}</span>
                      <span className="category-item-count">
                        {allProducts.filter(i => i.category === cat).length}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Loading Skeletons ── */}
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-skeleton">
                <div className="skeleton-image" />
                <div className="skeleton-details">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-category" />
                  <div className="skeleton-line skeleton-meta" />
                  <div className="skeleton-footer">
                    <div className="skeleton-line skeleton-price" />
                    <div className="skeleton-line skeleton-btn" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        /* ── Empty State ── */
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>

        /* ── Product Cards ── */
        ) : (
          <div className="products-grid">
            {filteredProducts.map((item, index) => {
              const itemId = item._id || item.id;
              const imageUrl = getItemImageUrl(item);
              const showImage = imageUrl && !imageErrors.has(itemId);
              const isAdded = addedItems.has(itemId);
              const originalPrice = Math.round(item.price * 1.25);
              const discount = Math.round(((originalPrice - item.price) / originalPrice) * 100);

              return (
                <Link
                  key={itemId}
                  to={`/product/${itemId}`}
                  className="pc"
                  style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
                >
                  {/* ── Image / Emoji ── */}
                  <div className="pc-img">
                    {showImage ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="pc-photo"
                        loading="lazy"
                        onError={() => handleImageError(itemId)}
                      />
                    ) : (
                      <div className="pc-emoji">
                        <span className="pc-emoji-icon">{getCategoryEmoji(item.category)}</span>
                        <span className="pc-emoji-cat">{item.category}</span>
                      </div>
                    )}
                    <span className="pc-disc">-{discount}%</span>
                    {item.isSellerProduct && <span className="pc-seller">👤 Seller</span>}
                    {!item.isSellerProduct && item.quantity <= item.minStock && (
                      <span className="pc-lowstock">⚠ Low</span>
                    )}
                  </div>

                  {/* ── Body ── */}
                  <div className="pc-body">
                    <span className="pc-cat">{getCategoryEmoji(item.category)} {item.category}</span>
                    <h3 className="pc-name">{item.name}</h3>
                    <p className="pc-qty">📦 {item.quantity} {item.unit} available</p>
                  </div>

                  {/* ── Footer ── */}
                  <div className="pc-foot">
                    <div className="pc-price">
                      <span className="pc-now">₹{item.price}</span>
                      <span className="pc-was">₹{originalPrice}</span>
                    </div>
                    <button
                      className={`pc-btn${isAdded ? ' pc-btn-ok' : ''}`}
                      onClick={(e) => handleAddToCart(e, item)}
                    >
                      {isAdded ? '✓ Added' : '🛒 Add'}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;