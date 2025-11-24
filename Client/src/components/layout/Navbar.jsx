import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import HelpButton from '../common/HelpButton';

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const navItems = [
    { path: '/', name: 'Home', icon: '🏠' },
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/products', name: 'Products', icon: '🏷️' },
    { path: '/inventory', name: 'Inventory', icon: '📦' },
    { path: '/shopping-list', name: 'Shopping List', icon: '🛒' },
    { path: '/reports', name: 'Reports', icon: '📈' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🛒</span>
            <span className="brand-title">GroceryHub</span>
          </Link>

          <div className="navbar-search">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

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
          
          <div className="navbar-actions">
            <HelpButton />
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
