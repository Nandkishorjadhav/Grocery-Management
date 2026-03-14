import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGrocery } from '../context/GroceryContext';
import { getProductPrimaryImage } from '../utils/imageUtils';
import './Home.css';

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: 'under100', label: 'Under ₹100' },
  { value: '100to500', label: '₹100 - ₹500' },
  { value: '500to1000', label: '₹500 - ₹1000' },
  { value: 'above1000', label: 'Above ₹1000' }
];

const sortOptions = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'stock', label: 'Sort by Stock' }
];

const formatPrice = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
}).format(Number(value) || 0);

const Home = ({ searchQuery = '' }) => {
  const { inventory, addToCart, loading } = useGrocery();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [activeMenu, setActiveMenu] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addedItems, setAddedItems] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.home-storefront__menu')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let products = [...inventory.filter((item) => item.quantity > 0)];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      products = products.filter((item) => item.category === selectedCategory);
    }

    switch (selectedPriceRange) {
      case 'under100':
        products = products.filter((item) => Number(item.price) < 100);
        break;
      case '100to500':
        products = products.filter((item) => Number(item.price) >= 100 && Number(item.price) <= 500);
        break;
      case '500to1000':
        products = products.filter((item) => Number(item.price) > 500 && Number(item.price) <= 1000);
        break;
      case 'above1000':
        products = products.filter((item) => Number(item.price) > 1000);
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'price-low':
        products = [...products].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        products = [...products].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'stock':
        products = [...products].sort((a, b) => Number(b.quantity) - Number(a.quantity));
        break;
      default:
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(products);
  }, [inventory, searchQuery, selectedCategory, selectedPriceRange, sortBy]);

  const allProducts = [...inventory];
  const categories = ['all', ...new Set(allProducts.map((item) => item.category).filter(Boolean))];
  const selectedCategoryLabel = categories.find((category) => category === selectedCategory);
  const selectedPriceOption = priceRanges.find((range) => range.value === selectedPriceRange) || priceRanges[0];
  const selectedSortOption = sortOptions.find((option) => option.value === sortBy) || sortOptions[0];

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      Vegetables: '🥬',
      Fruits: '🍎',
      Dairy: '🥛',
      Bakery: '🍞',
      Snacks: '🍿',
      Beverages: '🥤',
      Meat: '🥩',
      Grains: '🌾',
      default: '🛒'
    };

    return emojiMap[category] || emojiMap.default;
  };

  const getItemImageUrl = (item) => getProductPrimaryImage(item);

  const compactGridClass = searchQuery && viewMode === 'grid' && filteredProducts.length > 0 && filteredProducts.length <= 3
    ? 'home-storefront__grid--compact'
    : '';

  const handleImageError = useCallback((itemId) => {
    setImageErrors((current) => new Set([...current, itemId]));
  }, []);

  const handleAddToCart = async (event, item) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const result = await addToCart(item);
      if (!result) {
        return;
      }

      const itemId = item._id || item.id;
      setAddedItems((current) => new Set([...current, itemId]));

      setTimeout(() => {
        setAddedItems((current) => {
          const next = new Set(current);
          next.delete(itemId);
          return next;
        });
      }, 2000);
    } catch (error) {
      // Intentionally ignored to preserve existing behavior.
    }
  };

  return (
    <div className="home-page home-storefront">
      <div className="home-storefront__toolbar">
        <div className="home-storefront__filters">
          <div className="home-storefront__control home-storefront__menu">
            <span className="home-storefront__control-label">Category</span>
            <button
              type="button"
              className={`home-storefront__menu-trigger ${activeMenu === 'category' ? 'is-open' : ''}`}
              onClick={() => setActiveMenu((current) => current === 'category' ? null : 'category')}
              aria-haspopup="menu"
              aria-expanded={activeMenu === 'category'}
            >
              <span>{selectedCategory === 'all' ? 'All Categories' : selectedCategoryLabel}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
              </svg>
            </button>
            {activeMenu === 'category' && (
              <div className="home-storefront__menu-panel" role="menu" aria-label="Filter by category">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`home-storefront__menu-option ${selectedCategory === category ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveMenu(null);
                    }}
                    role="menuitemradio"
                    aria-checked={selectedCategory === category}
                  >
                    <span>{category === 'all' ? 'All Categories' : category}</span>
                    {selectedCategory === category && (
                      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="m7.5 13.3-2.8-2.8-1.4 1.4 4.2 4.2L16.7 7l-1.4-1.4-7.8 7.7Z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="home-storefront__control home-storefront__menu">
            <span className="home-storefront__control-label">Price</span>
            <button
              type="button"
              className={`home-storefront__menu-trigger ${activeMenu === 'price' ? 'is-open' : ''}`}
              onClick={() => setActiveMenu((current) => current === 'price' ? null : 'price')}
              aria-haspopup="menu"
              aria-expanded={activeMenu === 'price'}
            >
              <span>{selectedPriceOption.label}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
              </svg>
            </button>
            {activeMenu === 'price' && (
              <div className="home-storefront__menu-panel" role="menu" aria-label="Filter by price">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    className={`home-storefront__menu-option ${selectedPriceRange === range.value ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedPriceRange(range.value);
                      setActiveMenu(null);
                    }}
                    role="menuitemradio"
                    aria-checked={selectedPriceRange === range.value}
                  >
                    <span>{range.label}</span>
                    {selectedPriceRange === range.value && (
                      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="m7.5 13.3-2.8-2.8-1.4 1.4 4.2 4.2L16.7 7l-1.4-1.4-7.8 7.7Z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="home-storefront__control home-storefront__control--sort home-storefront__menu">
            <span className="home-storefront__control-label">Sort</span>
            <button
              type="button"
              className={`home-storefront__menu-trigger ${activeMenu === 'sort' ? 'is-open' : ''}`}
              onClick={() => setActiveMenu((current) => current === 'sort' ? null : 'sort')}
              aria-haspopup="menu"
              aria-expanded={activeMenu === 'sort'}
            >
              <span>{selectedSortOption.label}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
              </svg>
            </button>

            {activeMenu === 'sort' && (
              <div className="home-storefront__menu-panel" role="menu" aria-label="Sort products">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`home-storefront__menu-option ${sortBy === option.value ? 'is-active' : ''}`}
                    onClick={() => {
                      setSortBy(option.value);
                      setActiveMenu(null);
                    }}
                    role="menuitemradio"
                    aria-checked={sortBy === option.value}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && (
                      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="m7.5 13.3-2.8-2.8-1.4 1.4 4.2 4.2L16.7 7l-1.4-1.4-7.8 7.7Z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="home-storefront__view-toggle" role="group" aria-label="Choose product layout">
          <span className="home-storefront__view-label">View:</span>
          <button
            type="button"
            className={`home-storefront__view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3 3h5v5H3V3Zm0 9h5v5H3v-5Zm9-9h5v5h-5V3Zm0 9h5v5h-5v-5Z" />
            </svg>
          </button>
          <button
            type="button"
            className={`home-storefront__view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3 4h3v3H3V4Zm5 0h9v3H8V4Zm-5 5h3v3H3V9Zm5 0h9v3H8V9Zm-5 5h3v3H3v-3Zm5 0h9v3H8v-3Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="home-storefront__summary">
        <p className="home-storefront__results">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </p>
      </div>

      {loading ? (
        <div className={`home-storefront__grid home-storefront__grid--${viewMode}`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="home-storefront__skeleton">
              <div className="home-storefront__skeleton-image" />
              <div className="home-storefront__skeleton-body">
                <div className="home-storefront__skeleton-line home-storefront__skeleton-line--title" />
                <div className="home-storefront__skeleton-line home-storefront__skeleton-line--text" />
                <div className="home-storefront__skeleton-line home-storefront__skeleton-line--text" />
                <div className="home-storefront__skeleton-footer">
                  <div className="home-storefront__skeleton-line home-storefront__skeleton-line--price" />
                  <div className="home-storefront__skeleton-line home-storefront__skeleton-line--button" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="home-storefront__empty">
          <div className="home-storefront__empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting the category, price range, or search term.</p>
        </div>
      ) : (
        <div className={`home-storefront__grid home-storefront__grid--${viewMode} ${compactGridClass}`.trim()}>
          {filteredProducts.map((item, index) => {
            const itemId = item._id || item.id;
            const imageUrl = getItemImageUrl(item);
            const showImage = imageUrl && !imageErrors.has(itemId);
            const isAdded = addedItems.has(itemId);
            const originalPrice = Math.round(Number(item.price || 0) * 1.25);
            const discount = originalPrice > 0
              ? Math.max(1, Math.round(((originalPrice - Number(item.price || 0)) / originalPrice) * 100))
              : 0;
            const isLowStock = !item.isSellerProduct && Number(item.quantity) <= Number(item.minStock || 0);

            return (
              <article
                key={itemId}
                className={`home-card home-card--${viewMode}`}
                style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
              >
                <Link to={`/product/${itemId}`} className="home-card__media" aria-label={`Open ${item.name}`}>
                  {showImage ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="home-card__image"
                      loading="lazy"
                      onError={() => handleImageError(itemId)}
                    />
                  ) : (
                    <div className="home-card__placeholder">
                      <span className="home-card__placeholder-emoji">{getCategoryEmoji(item.category)}</span>
                    </div>
                  )}

                  {discount > 0 && (
                    <span className="home-card__badge home-card__badge--discount">-{discount}%</span>
                  )}
                  {item.isSellerProduct && (
                    <span className="home-card__badge home-card__badge--seller">Seller</span>
                  )}
                  {isLowStock && (
                    <span className="home-card__badge home-card__badge--stock">Low Stock</span>
                  )}
                </Link>

                <div className="home-card__content">
                  <div className="home-card__topline">
                    <span className="home-card__category">{item.category || 'General'}</span>
                    <span className="home-card__stock">Stock: {item.quantity}</span>
                  </div>

                  <Link to={`/product/${itemId}`} className="home-card__title-link">
                    <h3 className="home-card__title">{item.name}</h3>
                  </Link>

                  <p className="home-card__description">
                    {item.description || 'Fresh, quality-checked groceries ready for delivery.'}
                  </p>

                  <div className="home-card__price-row">
                    <span className="home-card__price">{formatPrice(item.price)}</span>
                    <span className="home-card__price-was">{formatPrice(originalPrice)}</span>
                  </div>

                  <div className="home-card__actions">
                    <button
                      type="button"
                      className={`home-card__cart-btn ${isAdded ? 'is-added' : ''}`}
                      onClick={(event) => handleAddToCart(event, item)}
                    >
                      {isAdded ? 'Added' : 'Add to Cart'}
                    </button>

                    <Link
                      to={`/product/${itemId}`}
                      className="home-card__view-btn"
                      aria-label={`View ${item.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
