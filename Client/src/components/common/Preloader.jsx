import React from 'react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="cart-animation">
          <div className="cart-icon">🛒</div>
          <div className="items-loading">
            <span className="item item-1">🍎</span>
            <span className="item item-2">🥬</span>
            <span className="item item-3">🥛</span>
            <span className="item item-4">🍞</span>
          </div>
        </div>
        <h2 className="preloader-title">GroceryHub</h2>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p className="loading-text">Loading your groceries...</p>
      </div>
    </div>
  );
};

export default Preloader;
