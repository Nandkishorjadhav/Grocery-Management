import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          <span style={{fontSize: '1.25rem', marginRight: '0.5rem'}}>🛍️</span>
          © {new Date().getFullYear()} Grocery Management System. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
