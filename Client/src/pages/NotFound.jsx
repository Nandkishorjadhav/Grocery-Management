import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="emoji-container">
          <span className="emoji-main">🔍</span>
          <span className="emoji-float emoji-1">🛒</span>
          <span className="emoji-float emoji-2">🍎</span>
          <span className="emoji-float emoji-3">🥖</span>
          <span className="emoji-float emoji-4">🥛</span>
        </div>
        
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-description">
          Oops! The page you're looking for seems to have wandered off the grocery aisle.
        </p>
        
        <button onClick={handleGoHome} className="btn-home">
          <span className="btn-emoji">🏠</span>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
