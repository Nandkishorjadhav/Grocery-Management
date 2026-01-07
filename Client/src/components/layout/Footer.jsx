import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            <span style={{fontSize: '1.25rem', marginRight: '0.5rem'}}>🛍️</span>
            © {new Date().getFullYear()} Grocery Management System. All rights reserved.
          </p>
          <div className="footer-links">
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/reports" className="footer-link">Reports</Link>
              <Link to="/privacy" className="footer-link">Privacy</Link>
            <Link to="/terms" className="footer-link">Terms</Link>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

