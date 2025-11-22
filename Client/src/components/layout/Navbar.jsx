import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', name: 'Dashboard', icon: '📊' },
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
