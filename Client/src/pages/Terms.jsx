import React, { useEffect, useRef } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import './Terms.css';

const Terms = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="terms-page">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Terms & Conditions' }]} />
      
      <div className="terms-container">
        <Card>
          <div className="terms-header">
            <div className="terms-icon">📜</div>
            <h1 className="terms-title">Terms & Conditions</h1>
            <p className="terms-subtitle">Last Updated: January 3, 2026</p>
          </div>

          <div className="terms-content">
            <div className="terms-section" ref={addToRefs}>
              <span className="section-badge">01</span>
              <h2>Acceptance of Terms</h2>
              <p>By using our Grocery Management System, you agree to these terms. Please discontinue use if you disagree.</p>
            </div>

            <div className="terms-section" ref={addToRefs}>
              <span className="section-badge">02</span>
              <h2>Products & Pricing</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">📦</span>
                  <p>Accurate descriptions provided, but not guaranteed error-free</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">📊</span>
                  <p>Products subject to availability and stock limits</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <p>Prices in ₹ including taxes, subject to change</p>
                </div>
              </div>
            </div>

            <div className="terms-section" ref={addToRefs}>
              <span className="section-badge">03</span>
              <h2>Orders & Payment</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">🛒</span>
                  <p>Orders subject to acceptance and availability</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">💳</span>
                  <p>Cash on Delivery (COD) accepted in Indian Rupees</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">✅</span>
                  <p>Order confirmation sent, not acceptance guarantee</p>
                </div>
              </div>
            </div>

            <div className="terms-section" ref={addToRefs}>
              <span className="section-badge">04</span>
              <h2>Delivery</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <p>Service area limited, location-based availability</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏰</span>
                  <p>Estimated times may vary due to external factors</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏠</span>
                  <p>Accurate address required to avoid failed delivery</p>
                </div>
              </div>
            </div>

            <div className="terms-section" ref={addToRefs}>
              <span className="section-badge">05</span>
              <h2>Returns & Refunds</h2>
              <div className="return-grid">
                <div className="return-box eligible">
                  <h4>✅ Eligible</h4>
                  <ul>
                    <li>Damaged/spoiled items</li>
                    <li>Wrong or missing items</li>
                    <li>Defective products</li>
                  </ul>
                </div>
                <div className="return-box non-eligible">
                  <h4>❌ Not Eligible</h4>
                  <ul>
                    <li>Consumed products</li>
                    <li>Customer misuse</li>
                    <li>After 24 hours</li>
                  </ul>
                </div>
              </div>
              <div className="return-steps">
                <span>1. Contact within 24hrs</span>
                <span>2. Provide order details</span>
                <span>3. Keep original packaging</span>
              </div>
            </div>

            <div className="terms-section" ref={addToRefs}>
              <span className="section-badge">06</span>
              <h2>User Conduct</h2>
              <div className="conduct-grid">
                <div className="conduct-box">
                  <h4>✓ Do</h4>
                  <ul>
                    <li>Provide accurate info</li>
                    <li>Keep credentials secure</li>
                    <li>Respect personnel</li>
                  </ul>
                </div>
                <div className="conduct-box">
                  <h4>✗ Don't</h4>
                  <ul>
                    <li>Use for illegal purposes</li>
                    <li>Share account</li>
                    <li>Provide false info</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="terms-section" ref={addToRefs}>
              <span className="section-badge">07</span>
              <h2>Legal</h2>
              <div className="legal-grid">
                <div className="legal-item">
                  <span>⚖️</span>
                  <p><strong>Liability:</strong> Limited to product amount paid</p>
                </div>
                <div className="legal-item">
                  <span>©</span>
                  <p><strong>IP Rights:</strong> Content protected by law</p>
                </div>
                <div className="legal-item">
                  <span>🔔</span>
                  <p><strong>Changes:</strong> Terms may be modified anytime</p>
                </div>
              </div>
            </div>

            <div className="terms-footer" ref={addToRefs}>
              <div className="acceptance-box">
                <span className="check-icon">✓</span>
                <p>By using our service, you agree to these terms and conditions</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
