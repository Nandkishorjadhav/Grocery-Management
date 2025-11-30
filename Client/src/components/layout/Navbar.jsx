import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import ProfileButton from '../common/ProfileButton';
import { useGrocery } from '../../context/GroceryContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { inventory } = useGrocery();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Clear search when navigating to different pages
    setSearchQuery('');
    setShowSuggestions(false);
    if (onSearch) {
      onSearch('');
    }
  }, [location.pathname]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
    navigate(`/product/${productId}`);
  };

  const getProductImage = (category) => {
    const images = {
      'Fruits': '🍎',
      'Vegetables': '🥬',
      'Dairy': '🥛',
      'Bakery': '🍞',
      'Meat': '🍗',
      'Snacks': '🍿',
      'Beverages': '🧃',
      'Grains': '🌾'
    };
    return images[category] || '🛒';
  };

  const navItems = [
    { path: '/', name: 'Home', icon: '🏠' },
    { path: '/products', name: 'Products', icon: '🏷️' },
    { path: '/inventory', name: 'Inventory', icon: '📦' },
    { path: '/cart', name: 'Cart', icon: '🛒' },
    { path: '/reports', name: 'Reports', icon: '📈' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            <span className="brand-icon">🛒</span>
            <span className="brand-title">GroceryHub</span>
          </Link>

          <div className="navbar-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="navbar-search navbar-search-desktop" ref={searchRef}>
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, categories..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery && setShowSuggestions(true)}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    <span className="suggestion-icon">{getProductImage(product.category)}</span>
                    <div className="suggestion-content">
                      <div className="suggestion-name">{product.name}</div>
                      <div className="suggestion-meta">
                        <span className="suggestion-category">{product.category}</span>
                        <span className="suggestion-price">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="navbar-actions">
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)} 
              className="mobile-search-btn"
              aria-label="Toggle search"
            >
              <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <ProfileButton />
            <ThemeToggle />
            
            <button onClick={() => setIsOpen(!isOpen)} className="mobile-menu-btn">
              <svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showMobileSearch && (
        <div className="mobile-search-container">
          <div className="navbar-search" ref={searchRef}>
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, categories..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              autoFocus
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    <span className="suggestion-icon">{getProductImage(product.category)}</span>
                    <div className="suggestion-content">
                      <div className="suggestion-name">{product.name}</div>
                      <div className="suggestion-meta">
                        <span className="suggestion-category">{product.category}</span>
                        <span className="suggestion-price">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
