import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Inventory', path: '/inventory', icon: '📦' },
    { name: 'Shopping List', path: '/shopping-list', icon: '🛒' },
    { name: 'Reports', path: '/reports', icon: '📈' },
  ];

  return (
    <nav className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <span className="text-4xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10">🛍️</span>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-white tracking-tight">Grocery Manager</span>
                  <div className="h-1 bg-white/30 rounded-full mt-1 group-hover:bg-white/50 transition-colors"></div>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white text-blue-600 shadow-xl scale-105'
                      : 'text-blue-50 hover:bg-white/20 hover:text-white hover:scale-105'
                  }`}
                >
                  <span className="mr-2 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-blue-800/50 backdrop-blur-lg">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
