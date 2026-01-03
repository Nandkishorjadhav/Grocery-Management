import React, { useState } from 'react';
import Modal from '../common/Modal';
import './Footer.css';

const Footer = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            <span style={{fontSize: '1.25rem', marginRight: '0.5rem'}}>🛍️</span>
            © {new Date().getFullYear()} Grocery Management System. All rights reserved.
          </p>
          <div className="footer-links">
            <button onClick={() => setShowAboutModal(true)} className="footer-link">About</button>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>

      <Modal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)}>
        <div className="about-modal-content">
          <h2 className="about-modal-title">
            <span style={{fontSize: '2rem', marginRight: '0.75rem'}}>🛍️</span>
            About Grocery Management System
          </h2>
          
          <div className="about-section">
            <h3>Welcome to Your Smart Grocery Solution</h3>
            <p>
              Grocery Management System is your one-stop solution for managing groceries efficiently. 
              We provide a seamless online shopping experience that combines convenience, quality, and reliability.
            </p>
          </div>

          <div className="about-section">
            <h3>🌟 Our Features</h3>
            <ul className="about-features-list">
              <li><strong>Quality Products:</strong> Browse through a wide range of fresh and quality grocery items</li>
              <li><strong>Smart Shopping Lists:</strong> Create and manage shopping lists for organized shopping</li>
              <li><strong>Easy Ordering:</strong> Seamless online ordering with intuitive interface</li>
              <li><strong>Real-time Inventory:</strong> Live inventory tracking ensures product availability</li>
              <li><strong>Secure Payments:</strong> Safe and secure payment options including Cash on Delivery</li>
              <li><strong>Fast Delivery:</strong> Quick and reliable delivery to your doorstep</li>
              <li><strong>Order Tracking:</strong> Track your orders in real-time</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>🎯 Our Mission</h3>
            <p>
              To make grocery shopping effortless and enjoyable by providing a comprehensive digital platform 
              that connects customers with quality products, while ensuring convenience, transparency, and 
              exceptional service.
            </p>
          </div>

          <div className="about-section">
            <h3>💡 Why Choose Us?</h3>
            <ul className="about-features-list">
              <li>User-friendly interface designed for everyone</li>
              <li>Comprehensive product catalog with detailed information</li>
              <li>Flexible delivery options</li>
              <li>Responsive customer support</li>
              <li>Regular updates and new features</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Footer;
