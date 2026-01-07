import React, { useEffect, useRef } from 'react';
import './Privacy.css';

const Privacy = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
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
    <div className="privacy-page">
      <div className="privacy-container">
        <header className="privacy-header">
          <div className="privacy-icon">🔒</div>
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">Your data, handled with care and transparency</p>
          <div className="privacy-updated">
            <span className="updated-icon">📅</span>
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <section className="privacy-section" ref={addToRefs}>
          <div className="section-icon">📋</div>
          <h2 className="privacy-section-title">1. Information We Collect</h2>
          <ul className="privacy-list">
            <li><span className="list-icon">👤</span><strong>Account Info:</strong> Name, email, and mobile provided during sign-in.</li>
            <li><span className="list-icon">🛒</span><strong>Order Details:</strong> Items purchased, delivery address, and preferences.</li>
            <li><span className="list-icon">📊</span><strong>Usage Data:</strong> Basic analytics like pages visited and interactions to improve experience.</li>
          </ul>
        </section>

        <section className="privacy-section" ref={addToRefs}>
          <div className="section-icon">⚙️</div>
          <h2 className="privacy-section-title">2. How We Use Your Information</h2>
          <ul className="privacy-list">
            <li><span className="list-icon">📦</span>To process orders and manage deliveries.</li>
            <li><span className="list-icon">✨</span>To personalize product recommendations and improve our services.</li>
            <li><span className="list-icon">📬</span>To communicate important updates about your orders or account.</li>
          </ul>
        </section>

        <section className="privacy-section" ref={addToRefs}>
          <div className="section-icon">🍪</div>
          <h2 className="privacy-section-title">3. Cookies and Local Storage</h2>
          <p className="privacy-text">We use cookies and local storage to keep you signed in, remember your preferences (like theme), and save convenient details such as your last used delivery address on your device.</p>
        </section>

        <section className="privacy-section" ref={addToRefs}>
          <div className="section-icon">🛡️</div>
          <h2 className="privacy-section-title">4. Data Security</h2>
          <p className="privacy-text">We use industry-standard practices to safeguard your information. While no method is 100% secure, we continuously improve our security and restrict access to authorized personnel only.</p>
        </section>

        <section className="privacy-section" ref={addToRefs}>
          <div className="section-icon">⚖️</div>
          <h2 className="privacy-section-title">5. Your Rights</h2>
          <ul className="privacy-list">
            <li><span className="list-icon">👁️</span>View or update your profile information from the Profile page.</li>
            <li><span className="list-icon">✏️</span>Request correction of inaccurate information.</li>
            <li><span className="list-icon">🚪</span>Log out anytime to clear the session from this device.</li>
          </ul>
        </section>

        <section className="privacy-section" ref={addToRefs}>
          <div className="section-icon">📞</div>
          <h2 className="privacy-section-title">6. Contact Us</h2>
          <p className="privacy-text">Have any privacy questions or requests? Reach us at <span className="privacy-highlight">support@groceryhub.local</span>.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
